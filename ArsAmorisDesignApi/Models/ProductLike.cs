using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ArsAmorisDesignApi.Models;
[Table("product_likes")]
[PrimaryKey(nameof(UserId), nameof(ProductId))]
public class ProductLike
{
    [Column("user_id")]
    public long UserId { get; set; }
    [Column("product_id")]
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
}