using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.ProductService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArsAmorisDesignApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductsController(IProductService productService, IHttpContextAccessor httpContextAccessor)
        {
            _productService = productService;
            _httpContextAccessor = httpContextAccessor;

        }
        [Authorize(Policy = "AdminPolicy")]
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
        [Authorize(Policy = "AdminPolicy")]
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
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts([FromQuery] string? sortBy, [FromQuery] string? categories) // mozda razdvoji na sort column i sort order
        {
            var products = await _productService.GetAllProducts(sortBy, categories);
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
        [Authorize(Policy = "AdminPolicy")]
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
        [HttpGet("Featured")]
        public async Task<ActionResult<ProductDTO>> GetFeaturedProducts() // za sada ne trebaju nikakvi parametri
        {
            var products = await _productService.GetFeaturedProducts();
            var productsDTO = new List<ProductDTO>();
            foreach (var product in products)
            {
                productsDTO.Add(MapDomainToDTO(product));
            }
            return Ok(productsDTO);
        }
        private ProductDTO MapDomainToDTO(Product product)
        {
            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                ImageUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{product.ImageFileName}",
                CategoryId = product.ProductCategoryId,
                CategoryName = product.ProductCategory?.Name,
                Featured = product.Featured
            };
        }
    }
}
