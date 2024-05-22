using System.Collections.Immutable;
using ArsAmorisDesignApi.Data;
using ArsAmorisDesignApi.Models;
using Microsoft.EntityFrameworkCore;
using ArsAmorisDesignApi.Extensions;

namespace ArsAmorisDesignApi.Services.ProductService
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _dbContext;

        public ProductService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Product> AddProduct(Product product)
        {


            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();
            await _dbContext.Entry(product).Reference(p => p.ProductCategory).LoadAsync(); // explicit loading
            await _dbContext.Entry(product).Collection(p => p.Images).LoadAsync();

            return product;
        }

        public async Task<IEnumerable<Product>> GetAllProducts(string? sortBy, string? categories)
        {
            var products = _dbContext.Products.Sort(sortBy).FilterCategories(categories).AsQueryable();
            return await products.Include(p => p.ProductCategory).Include(p => p.Images).ToListAsync();
        }
        // da li ovdje treba Product ? upitnik da označui nullable 
        public async Task<Product?> GetProduct(Guid id)
        {
            var product = await _dbContext.Products.Include(p => p.ProductCategory).Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);

            return product;
        }
        // da li je prihvatljivo bool vratiti
        // public async Task<bool> DeleteProduct(Guid id)
        // {
        //     var product = await _dbContext.Products.FindAsync(id);

        //     if (product == null)
        //     {
        //         return false;
        //     }
        //     _dbContext.Products.Remove(product);
        //     await _dbContext.SaveChangesAsync();
        //     // obrisi sliku
        //     var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{product.ImageFileName}");
        //     // kakvi ovdje izuzeci se mogu dogoditi?
        //     File.Delete(localFilePath);

        //     return true;
        // }

        public async Task<Product?> EditProduct(Guid id, Product updatedProduct)
        {
            var product = await _dbContext.Products.FindAsync(id);

            if (product == null)
            {
                return null;
            }


            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.ProductCategoryId = updatedProduct.ProductCategoryId;
            product.Featured = updatedProduct.Featured;
            foreach (var image in updatedProduct.Images)
            {
                product.Images.Add(image);
            }
            await _dbContext.SaveChangesAsync();
            await _dbContext.Entry(product).Reference(p => p.ProductCategory).LoadAsync(); // explicit loading
            await _dbContext.Entry(product).Collection(p => p.Images).LoadAsync();
            return product;
        }
        public async Task<IEnumerable<Product>> GetProductsByCategory(Guid? categoryId, string? sortBy)
        {
            return await _dbContext.Products.Sort(sortBy).Include(p => p.ProductCategory).Include(p => p.Images).Where(p => p.ProductCategoryId == categoryId).ToListAsync();
        }
        public async Task<IEnumerable<Product>> GetFeaturedProducts()
        {
            return await _dbContext.Products.Where(product => product.Featured).Include(product => product.ProductCategory).Include(p => p.Images).ToListAsync();
        }

        public async Task<bool> LikeProduct(long userId, Guid productId)
        {
            // da li da provjeravam usera uopste
            // da li da provjerim product da li postoji? dodao fk!
            try
            {
                await _dbContext.ProductLikes.AddAsync(new ProductLike { UserId = userId, ProductId = productId });
                await _dbContext.SaveChangesAsync();

            }
            catch (DbUpdateException)
            {
                return false;
            }

            return true;
        }
        public async Task<bool> UnlikeProduct(long userId, Guid productId)
        {
            // da li da provjeravam usera uopste
            // da li da provjerim product da li postoji? dodao fk!
            try
            {
                var productLike = await _dbContext.ProductLikes.FindAsync(userId, productId);

                if (productLike == null)
                {
                    return false;
                }
                _dbContext.ProductLikes.Remove(productLike);
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return false;
            }
            return true;
        }
        public async Task<int> GetLikeCountForProduct(Guid productId)
        {
            return await _dbContext.ProductLikes.CountAsync(pl => pl.ProductId == productId);
        }
        public ISet<Guid> GetLikedProductsForUser(long userId)
        {
            return _dbContext.ProductLikes.Where(pl => pl.UserId == userId).Select(pl => pl.ProductId).ToHashSet();
        }
        public async Task<bool> IsProductLikedByUser(Guid productId, long userId)
        {
            return await _dbContext.ProductLikes.AnyAsync(pl => pl.ProductId == productId && pl.UserId == userId);
        }
        public async Task<Dictionary<Guid, int>> GetLikeCountForProducts(ISet<Guid> products)
        {
            var dictionary = await _dbContext.ProductLikes.Where(pl => products.Contains(pl.ProductId)).GroupBy(pl => pl.ProductId).Select(group => new { ProductId = group.Key, LikeCount = group.Count() }).ToDictionaryAsync(t => t.ProductId, t => t.LikeCount);
            var productsWithZeroLikes = products.Except(dictionary.Keys);
            foreach (var key in productsWithZeroLikes)
            {
                dictionary[key] = 0;
            }
            return dictionary;
        }
        public async Task<IEnumerable<Product>> GetRandomByCategory(Guid? categoryId, int count)
        {
            // order by Guid.NewGuid() ne radi 
            var products = await _dbContext.Products.Include(p => p.ProductCategory).Include(p => p.Images).Where(p => p.ProductCategoryId == categoryId).ToListAsync();
            return products.OrderBy(x => Guid.NewGuid()).Take(count).ToList();
        }
        public async Task<IEnumerable<string>> GetImagesForProduct(Guid productId)
        {
            // ne provjeravam da li proizvod postoji
            var productImages = await _dbContext.ProductImages.Where(productImage => productImage.ProductId == productId).Select(productImage => productImage.ImageName).ToListAsync(); // ovo bi na set promijenit
            return productImages;
        }
        public async Task<bool> DeleteImages(Guid productId, IEnumerable<string> images)
        {
            var toDelete = await _dbContext.ProductImages.Where(pi => pi.ProductId == productId && images.Contains(pi.ImageName)).ToListAsync();
            if (toDelete.Any())
            {
                _dbContext.ProductImages.RemoveRange(toDelete);
                await _dbContext.SaveChangesAsync();
            }
            return true; // false u slucaju izuzetka???
        }
        public async Task<bool> ReorderImages(Dictionary<string, int> keyValues)
        {
            // pretpostavljam da su primljeni podaci ispravni
            var toReorder = await _dbContext.ProductImages.Where(pi => keyValues.Keys.Contains(pi.ImageName)).ToListAsync();
            if (toReorder.Any())
            {
                foreach (var image in toReorder)
                {
                    image.Order = keyValues[image.ImageName];
                }
                await _dbContext.SaveChangesAsync();
            }
            return true; // ista primjedba ??
        }
    }
}
