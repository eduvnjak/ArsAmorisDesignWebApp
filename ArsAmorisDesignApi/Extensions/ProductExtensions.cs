
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
        public static IQueryable<Product> FilterCategories(this IQueryable<Product> query, string? categories)
        {
            var categoryList = new List<String>();

            if (!String.IsNullOrEmpty(categories))
            {
                categoryList.AddRange(categories.Split(",").ToList());
                query = query.Where(p => categoryList.Contains(p.ProductCategoryId == null ? "null" : p.ProductCategoryId.ToString()!));
            }
            return query;

        }
    }
}