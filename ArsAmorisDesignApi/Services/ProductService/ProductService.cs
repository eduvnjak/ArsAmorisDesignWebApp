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
        public async Task<Product> AddProduct(Product product)
        {
            var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{product.ImageName}{product.ImageExtension}");
            using var stream = new FileStream(localFilePath, FileMode.Create);
            await product.Image.CopyToAsync(stream);
            var urlImagePath = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{product.ImageName}{product.ImageExtension}";

            product.FilePath = urlImagePath;

            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();

            return product;
        }

        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            return await _dbContext.Products.ToListAsync();
        }
        // da li ovdje treba Product ? upitnik da označui nullable 
        public async Task<Product?> GetProduct(Guid id)
        {
            var product = await _dbContext.Products.FindAsync(id);

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
            var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{product.ImageName}{product.ImageExtension}");
            // kakvi ovdje izuzeci se mogu dogoditi?
            File.Delete(localFilePath);

            return true;
        }
    }
}
