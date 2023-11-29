using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.ProductService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArsAmorisDesignApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // authorize ostavi za kasnije, sada svima dostupno sve
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromForm] ProductPostDTO productPostDTO)
        {
            try
            {
                var product = await _productService.AddProduct(productPostDTO);
                return Ok(MapDomainToDTO(product));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            bool deleted = await _productService.DeleteProduct(id);
            if (deleted)
            {
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts([FromQuery] string? sortBy, [FromQuery] string? categoryId) // mozda razdvoji na sort column i sort order
        {
            var products = await _productService.GetAllProducts(sortBy, categoryId);
            var productsDTO = new List<ProductDTO>();
            foreach (var product in products)
            {
                productsDTO.Add(MapDomainToDTO(product));
            }
            return Ok(productsDTO);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(Guid id)
        {
            var product = await _productService.GetProduct(id);
            if (product == null) return NotFound();
            return MapDomainToDTO(product); // treba li ovo umotati u Ok ???
        }
        [HttpPut("{id}")] // ovaj put odstupa od HTTP standarda 
        public async Task<ActionResult<ProductDTO>> EditProduct(Guid id, [FromForm] ProductEditDTO productEditDTO)
        {
            try
            {
                var product = await _productService.EditProduct(id, productEditDTO);
                if (product == null) return NotFound();
                return Ok(MapDomainToDTO(product)); // da li ovo ili no content;
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("Category/{categoryId?}")] // swagger ne detektuje optional route parameter
        public async Task<ActionResult<ProductDTO>> GetProductsByCategory([FromQuery] string? sortBy, Guid? categoryId = null) // ovo sa null je mozda malo grbavo ali radi
        {
            var products = await _productService.GetProductsByCategory(categoryId, sortBy);
            var productsDTO = new List<ProductDTO>();
            foreach (var product in products)
            {
                productsDTO.Add(MapDomainToDTO(product));
            }
            return Ok(productsDTO);
        }
        private static ProductDTO MapDomainToDTO(Product product)
        {
            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                ImageUrl = product.ImageUrl,
                CategoryId = product.ProductCategoryId,
                CategoryName = product.ProductCategory?.Name
            };
        }
    }
}
