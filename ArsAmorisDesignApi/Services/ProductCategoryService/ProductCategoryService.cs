using ArsAmorisDesignApi.Data;
using ArsAmorisDesignApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ArsAmorisDesignApi.Services.ProductCategoryService
{
    public class ProductCategoryService : IProductCategoryService
    {
        private readonly AppDbContext _dbContext;

        public ProductCategoryService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<ProductCategory> AddCategory(string productCategoryName)
        {
            if (await CategoryExists(productCategoryName)) throw new Exception("Product category already exists!");
            var newProductCategory = new ProductCategory
            {
                Name = productCategoryName
            };
            await _dbContext.ProductCategories.AddAsync(newProductCategory);
            await _dbContext.SaveChangesAsync();
            return newProductCategory;
        }

        public async Task<bool> DeleteCategory(Guid id)
        {
            var productCategory = await _dbContext.ProductCategories.FindAsync(id);
            if (productCategory == null)
            {
                return false;
            }
            _dbContext.ProductCategories.Remove(productCategory);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProductCategory>> GetAllCategories()
        {
            return await _dbContext.ProductCategories.ToListAsync();
        }

        public async Task<ProductCategory?> GetCategoryById(Guid id)
        {
            return await _dbContext.ProductCategories.FindAsync(id);
        }

        public async Task<ProductCategory?> EditProductCategory(Guid id, string newProductCategoryName)
        {
            if (await CategoryExists(newProductCategoryName)) throw new Exception("Product category already exists!");
            var productCategory = await _dbContext.ProductCategories.FindAsync(id);
            if (productCategory == null) return null;
            productCategory.Name = newProductCategoryName;
            await _dbContext.SaveChangesAsync();
            return productCategory;
        }

        private async Task<bool> CategoryExists(string categoryName)
        {
            var productCategory = await _dbContext.ProductCategories.Where(pc => pc.Name == categoryName).FirstOrDefaultAsync(); // case insensitive - provjeri case sensitivity and collations 

            if (productCategory == null)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}