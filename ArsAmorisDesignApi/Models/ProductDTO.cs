using System.ComponentModel.DataAnnotations;

namespace ArsAmorisDesignApi.Models
{
    public class ProductDTO
    {
        [Required]
        public IFormFile Image { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string? Description { get; set; }
        [Required]
        public string ImageName { get; set; }
    }
}
