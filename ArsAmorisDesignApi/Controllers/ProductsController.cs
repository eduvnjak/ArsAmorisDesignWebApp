using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.ProductService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArsAmorisDesignApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // authorize samo adminu
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> PostProduct([FromForm] ProductDTO productDTO)
        {
            ValidateImageUpload(productDTO);
            if (ModelState.IsValid)
            {
                var product = new Product
                {
                    Name = productDTO.Name,
                    Image = productDTO.Image,
                    Price = productDTO.Price,
                    ImageName = productDTO.ImageName,
                    Description = productDTO.Description,
                    ImageSizeInBytes = productDTO.Image.Length,
                    ImageExtension = Path.GetExtension(productDTO.Image.FileName)
                };

                await _productService.AddProduct(product);

                return Ok(product);
            }
            return BadRequest(ModelState);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _productService.GetAllProducts();
            return Ok(products);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            var product = await _productService.GetProduct(id);
            if (product == null) return NotFound();
            return product;
        }
        private void ValidateImageUpload(ProductDTO productDTO)
        {
            var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
            if (!allowedExtensions.Contains(Path.GetExtension(productDTO.Image.FileName)))
            {
                ModelState.AddModelError("image", "Unsupported image extension");
            }
            if (productDTO.Image.Length > 5242880)  // 5MB limit
            {
                ModelState.AddModelError("image", "Image too large");
            }
        }
    }
}
