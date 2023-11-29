using ArsAmorisDesignApi.Models;

namespace ArsAmorisDesignApi.Services.ProductService
{
    public interface IProductService
    {
        Task<Product> AddProduct(ProductPostDTO productPostDTO);
        Task<IEnumerable<Product>> GetAllProducts(string? sortBy, string? categoryId);
        Task<Product?> GetProduct(Guid id);
        Task<bool> DeleteProduct(Guid id);
        Task<Product?> EditProduct(Guid id, ProductEditDTO productEditDTO);
        Task<IEnumerable<Product>> GetProductsByCategory(Guid? categoryId, string? sortBy);
    }
}
