
using ArsAmorisDesignApi.Models;

namespace ArsAmorisDesignApi.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string? sortBy)
        {
            if (!String.IsNullOrWhiteSpace(sortBy))
            {
                query = sortBy switch
                {
                    "nameAsc" => query.OrderBy(product => product.Name),
                    "nameDesc" => query.OrderByDescending(product => product.Name),
                    "priceAsc" => query.OrderBy(product => product.Price),
                    "priceDesc" => query.OrderByDescending(product => product.Price),
                    _ => query
                };
            }
            return query;
        }
    }
}