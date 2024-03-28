using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArsAmorisDesignApi.Models;
[Table("products")]
public class Product
{

    [Key]
    [Column("id")]
    public Guid Id { get; set; }
    [Column("name")]
    public string Name { get; set; }
    [Column("price")]
    public decimal Price { get; set; }
    [Column("description")]
    public string? Description { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    [Column("category_id")]
    public Guid? ProductCategoryId { get; set; }
    public ProductCategory? ProductCategory { get; set; }
    [Column("featured")]
    public bool Featured { get; set; }
}