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
    // [Column("image_name")]
    // public string ImageName { get; set; } // ovaj i sljedeci atribut potrebni zbog brisanja 
    // [Column("image_extension")]
    // public string ImageExtension { get; set; }
    [Column("image_url")]
    public string ImageUrl { get; set; } //omoguci vise slika
    [Column("category_id")]
    public Guid? ProductCategoryId { get; set; }
    public ProductCategory? ProductCategory { get; set; }
}