using ArsAmorisDesignApi.Data;
using ArsAmorisDesignApi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace ArsAmorisDesignApi.Services.ProductService
{
    public class ProductService : IProductService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _dbContext;

        public ProductService(IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, AppDbContext dbContext)
        {
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
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

            var urlImagePath = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{imageName}{imageExtension}";

            var product = new Product
            {
                Name = productPostDTO.Name,
                Price = productPostDTO.Price,
                Description = productPostDTO.Description,
                ImageUrl = urlImagePath,
                ProductCategoryId = productPostDTO.ProductCategoryId
            };

            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();
            await _dbContext.Entry(product).Reference(p => p.ProductCategory).LoadAsync(); // explicit loading

            return product;
        }

        public async Task<IEnumerable<Product>> GetAllProducts(string? sortBy, string? categoryId)
        {
            var products = _dbContext.Products.AsQueryable();
            // sort
            if (!String.IsNullOrWhiteSpace(sortBy))
            {
                products = sortBy switch
                {
                    "nameAsc" => products.OrderBy(product => product.Name),
                    "nameDesc" => products.OrderByDescending(product => product.Name),
                    "priceAsc" => products.OrderBy(product => product.Price),
                    "priceDesc" => products.OrderByDescending(product => product.Price),
                    _ => products
                };
            }
            if (categoryId != null)
            {
                try
                {
                    Guid? guid = categoryId == "null" ? null : new Guid(categoryId);
                    products = products.Where(p => p.ProductCategoryId == guid);
                }
                catch (FormatException)
                {
                    return new List<Product>();
                }
            }

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
            var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{Path.GetFileName(product.ImageUrl)}");
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
                var oldLocalFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{Path.GetFileName(product.ImageUrl)}");
                // kakvi ovdje izuzeci se mogu dogoditi?
                File.Delete(oldLocalFilePath); // ne provjerava da li file postoji
                // ovaj upload je ponavljanje koda
                string imageExtension = Path.GetExtension(productEditDTO.Image.FileName);
                string imageName = Path.GetRandomFileName().Replace(".", "-");
                // provjeriti da li ima neka vec slika sa istim imenom
                var newLocalFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{imageName}{imageExtension}");
                using var stream = new FileStream(newLocalFilePath, FileMode.Create);
                await productEditDTO.Image.CopyToAsync(stream);

                var urlImagePath = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{imageName}{imageExtension}";
                product.ImageUrl = urlImagePath;
            }
            // ovdje bi dobro dosao mapper
            product.Name = productEditDTO.Name;
            product.Description = productEditDTO.Description;
            product.Price = productEditDTO.Price;
            product.ProductCategoryId = productEditDTO.ProductCategoryId;
            await _dbContext.Entry(product).Reference(p => p.ProductCategory).LoadAsync(); // explicit loading

            await _dbContext.SaveChangesAsync();
            return product;
        }
        public async Task<IEnumerable<Product>> GetProductsByCategory(Guid? categoryId) // na ovo mozda sort query param
        {
            return await _dbContext.Products.Include(p => p.ProductCategory).Where(p => p.ProductCategoryId == categoryId).ToListAsync();
        }
    }
}
