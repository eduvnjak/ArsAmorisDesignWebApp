using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArsAmorisDesignApi.Models;
[Table("users")]
public class User
{
    //public User(string username, string passwordHash)
    //{
    //    Username = username;
    //    PasswordHash = passwordHash;
    //}

    [Key]
    [Column("id")]
    public long Id { get; set; }
    [Column("username")]
    public string Username { get; set; }
    [Column("password_hash")]
    public string PasswordHash { get; set; }
    [Column("is_admin")]
    public bool IsAdmin { get; set; } = false;
}