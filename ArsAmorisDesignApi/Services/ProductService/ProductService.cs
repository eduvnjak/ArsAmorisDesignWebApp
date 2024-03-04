using System.Collections.Immutable;
using ArsAmorisDesignApi.Data;
using ArsAmorisDesignApi.Models;
using Microsoft.EntityFrameworkCore;
using ArsAmorisDesignApi.Extensions;

namespace ArsAmorisDesignApi.Services.ProductService
{
    public class ProductService : IProductService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly AppDbContext _dbContext;

        public ProductService(IWebHostEnvironment webHostEnvironment, AppDbContext dbContext)
        {
            _webHostEnvironment = webHostEnvironment;
            _dbContext = dbContext;
        }
        public async Task<Product> AddProduct(ProductPostDTO productPostDTO)
        {
            ValidateImageUpload(productPostDTO.Image);

            string imageExtension = Path.GetExtension(productPostDTO.Image.FileName);
            string imageName = Path.GetRandomFileName().Replace(".", "-");
            // provjeriti da li ima neka vec slika sa istim imenom
            var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{imageName}{imageExtension}");
            using var stream = new FileStream(localFilePath, FileMode.Create);
            await productPostDTO.Image.CopyToAsync(stream);

            // var urlImagePath = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{imageName}{imageExtension}";

            var product = new Product
            {
                Name = productPostDTO.Name,
                Price = productPostDTO.Price,
                Description = productPostDTO.Description,
                ImageFileName = $"{imageName}{imageExtension}",
                ProductCategoryId = productPostDTO.ProductCategoryId,
                Featured = productPostDTO.Featured
            };

            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();
            await _dbContext.Entry(product).Reference(p => p.ProductCategory).LoadAsync(); // explicit loading

            return product;
        }

        public async Task<IEnumerable<Product>> GetAllProducts(string? sortBy, string? categories)
        {
            var products = _dbContext.Products.Sort(sortBy).FilterCategories(categories).AsQueryable();
            return await products.Include(p => p.ProductCategory).ToListAsync();
        }
        // da li ovdje treba Product ? upitnik da označui nullable 
        public async Task<Product?> GetProduct(Guid id)
        {
            var product = await _dbContext.Products.Include(p => p.ProductCategory).FirstOrDefaultAsync(p => p.Id == id);

            return product;
        }
        // da li je prihvatljivo bool vratiti
        public async Task<bool> DeleteProduct(Guid id)
        {
            var product = await _dbContext.Products.FindAsync(id);

            if (product == null)
            {
                return false;
            }
            _dbContext.Products.Remove(product);
            await _dbContext.SaveChangesAsync();
            // obrisi sliku
            var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{product.ImageFileName}");
            // kakvi ovdje izuzeci se mogu dogoditi?
            File.Delete(localFilePath);

            return true;
        }
        private static void ValidateImageUpload(IFormFile imageFile)
        {
            var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
            if (!allowedExtensions.Contains(Path.GetExtension(imageFile.FileName)))
            {
                throw new Exception("Unsupported image extension");
            }
            if (imageFile.Length > 5242880)  // 5MB limit
            {
                throw new Exception("Image too large");
            }
        }
        public async Task<Product?> EditProduct(Guid id, ProductEditDTO productEditDTO)
        {
            var product = await _dbContext.Products.FindAsync(id);

            if (product == null)
            {
                return null;
            }
            if (productEditDTO.Image != null)
            {
                ValidateImageUpload(productEditDTO.Image);
                // obrisi sliku
                var oldLocalFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{product.ImageFileName}");
                // kakvi ovdje izuzeci se mogu dogoditi?
                File.Delete(oldLocalFilePath); // ne provjerava da li file postoji
                // ovaj upload je ponavljanje koda
                string imageExtension = Path.GetExtension(productEditDTO.Image.FileName);
                string imageName = Path.GetRandomFileName().Replace(".", "-");
                // provjeriti da li ima neka vec slika sa istim imenom
                var newLocalFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{imageName}{imageExtension}");
                using var stream = new FileStream(newLocalFilePath, FileMode.Create);
                await productEditDTO.Image.CopyToAsync(stream);

                product.ImageFileName = $"{imageName}{imageExtension}";
            }
            // ovdje bi dobro dosao mapper
            product.Name = productEditDTO.Name;
            product.Description = productEditDTO.Description;
            product.Price = productEditDTO.Price;
            product.ProductCategoryId = productEditDTO.ProductCategoryId;
            product.Featured = productEditDTO.Featured;
            await _dbContext.Entry(product).Reference(p => p.ProductCategory).LoadAsync(); // explicit loading

            await _dbContext.SaveChangesAsync();
            return product;
        }
        public async Task<IEnumerable<Product>> GetProductsByCategory(Guid? categoryId, string? sortBy)
        {
            return await _dbContext.Products.Sort(sortBy).Include(p => p.ProductCategory).Where(p => p.ProductCategoryId == categoryId).ToListAsync();
        }
        public async Task<IEnumerable<Product>> GetFeaturedProducts()
        {
            return await _dbContext.Products.Where(product => product.Featured).Include(product => product.ProductCategory).ToListAsync();
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
            return await _dbContext.ProductLikes.Where(pl => products.Contains(pl.ProductId)).GroupBy(pl => pl.ProductId).Select(group => new { ProductId = group.Key, LikeCount = group.Count() }).ToDictionaryAsync(t => t.ProductId, t => t.LikeCount);
        }
    }
}
