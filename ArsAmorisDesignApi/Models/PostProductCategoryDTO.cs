using System.ComponentModel.DataAnnotations;

namespace ArsAmorisDesignApi.Models
{
    public class PostProductCategoryDTO
    {
        [Required]
        public required string Name { get; set; }
    }
}
