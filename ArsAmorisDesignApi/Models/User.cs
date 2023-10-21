using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArsAmorisDesignApi.Models;
[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public long Id { get; set; }
    [Column("username")]
    public string Username { get; set; }
    // password sredi
    [Column("password")]
    public string Password { get; set; }
}