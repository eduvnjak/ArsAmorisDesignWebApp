using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArsAmorisDesignApi.Models;
[Table("product_categories")]
public class ProductCategory
{

    [Key]
    [Column("id")]
    public Guid Id { get; set; }
    [Column("name")]
    public required string Name { get; set; } // trebao bi biti unique
    // treba li mi property za pripadajuce producte???
}