using ArsAmorisDesignApi.Models;

namespace ArsAmorisDesignApi.Services.ProductCategoryService
{
    public interface IProductCategoryService
    {
        Task<IEnumerable<ProductCategory>> GetAllCategories();
        Task<ProductCategory?> GetCategoryById(Guid id);
        Task<ProductCategory> AddCategory(string productCategoryName);
        Task<bool> DeleteCategory(Guid id);
        Task<ProductCategory?> EditProductCategory(Guid id, string newProductCategoryName);

    }
}