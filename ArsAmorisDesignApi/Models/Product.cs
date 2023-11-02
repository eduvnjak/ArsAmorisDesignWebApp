using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArsAmorisDesignApi.Models;
[Table("products")]
public class Product
{

    [Key]
    [Column("id")]
    public Guid Id { get; set; }
    [NotMapped]
    public IFormFile Image { get; set; } //ovdje bi trebalo moci zadati niz slika
    [Column("name")]
    public string Name { get; set; }
    [Column("price")]
    public decimal Price { get; set; }
    [Column("description")]
    public string? Description { get; set; }
    [Column("image_name")]
    public string ImageName { get; set; }
    [Column("image_extension")]
    public string ImageExtension { get; set; }
    [Column("image_size")]
    public long ImageSizeInBytes { get; set; }
    [Column("file_path")]
    public string FilePath { get; set; }
}