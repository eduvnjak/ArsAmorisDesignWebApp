using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArsAmorisDesignApi.Models;
[Table("refresh_tokens")]
public class RefreshToken
{
    [Key]
    [Column("value")]
    public Guid Value { get; set; }
    [Column("expiration_date")]
    public DateTime ExpirationDate { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    public User User { get; set; } // treba li mi ovaj property?
}