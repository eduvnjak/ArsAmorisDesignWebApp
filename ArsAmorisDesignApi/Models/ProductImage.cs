using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ArsAmorisDesignApi.Models;
[Table("product_images")]
[PrimaryKey(nameof(ProductId), nameof(ImageName))]
public class ProductImage
{

    [Column("product_id")]
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    [Column("image_name")]
    public required string ImageName { get; set; }
    [Column("order")]
    public int? Order { get; set; }
}