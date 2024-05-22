using ArsAmorisDesignApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace ArsAmorisDesignApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        /*         try
                {
                    var databaseCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                    if (databaseCreator != null)
                    {
                        if (!databaseCreator.CanConnect()) databaseCreator.Create();

                        if (!databaseCreator.HasTables()) databaseCreator.CreateTables();
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                } */
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<ProductCategory> ProductCategories { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<ProductLike> ProductLikes { get; set; } = null!;
    public DbSet<ProductImage> ProductImages { get; set; } = null!;
}