using System.ComponentModel.DataAnnotations;

namespace ArsAmorisDesignApi.Models
{
    public class ProductEditDTO
    {
        public class IndexFilePair
        {
            public int Index { get; set; }
            public IFormFile File { get; set; }
        }
        public class IndexImageNamePair
        {
            public int Index { get; set; }
            public string ImageName { get; set; }
        }
        public List<IndexFilePair>? NewImages { get; set; }
        public List<IndexImageNamePair>? ExistingImages { get; set; }
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
