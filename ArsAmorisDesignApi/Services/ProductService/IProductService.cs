using ArsAmorisDesignApi.Models;

namespace ArsAmorisDesignApi.Services.ProductService
{
    public interface IProductService
    {
        Task<Product> AddProduct(Product product);
        Task<IEnumerable<Product>> GetAllProducts();
        Task<Product> GetProduct(Guid id);
        Task<bool> DeleteProduct(Guid id);
    }
}
