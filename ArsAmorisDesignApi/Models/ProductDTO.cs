
namespace ArsAmorisDesignApi.Models;
public class ProductDTO
{

    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string ImageUrl { get; set; } //omoguci vise slika
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public bool Featured { get; set; }
}