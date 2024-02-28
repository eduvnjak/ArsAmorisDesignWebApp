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
        Task<IEnumerable<Product>> GetFeaturedProducts();
        Task<bool> LikeProduct(long userId, Guid productId);
        Task<bool> UnlikeProduct(long userId, Guid productId);
        Task<int> GetLikeCountForProduct(Guid productId);
        Task<IEnumerable<Guid>> GetLikedProductsForUser(long userId); // da li ovo i ovaj ispod ide u ovaj service uopste
        Task<bool> IsProductLikedByUser(Guid productId, long userId);
    }
}
