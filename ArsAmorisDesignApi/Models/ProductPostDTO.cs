using System.ComponentModel.DataAnnotations;

namespace ArsAmorisDesignApi.Models
{
    public class ProductPostDTO
    {
        [Required]
        public List<IFormFile> Images { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public Guid? ProductCategoryId { get; set; }
        [Required]
        public bool Featured { get; set; }
    }
}
