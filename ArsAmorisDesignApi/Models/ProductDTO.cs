
namespace ArsAmorisDesignApi.Models;
public class ProductDTO
{

    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public List<string> Images { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public bool Featured { get; set; }
    public int LikeCount { get; set; } = 0;
    public bool Liked { get; set; } = false;

    public ProductDTO(Product product, List<string> images, int likeCount, bool liked)
    {
        Id = product.Id;
        Name = product.Name;
        Price = product.Price;
        Description = product.Description;
        Images = images;
        CategoryId = product.ProductCategoryId;
        CategoryName = product.ProductCategory?.Name;
        Featured = product.Featured;
        LikeCount = likeCount;
        Liked = liked;
    }
}