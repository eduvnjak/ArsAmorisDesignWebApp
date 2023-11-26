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
                return Ok(product);
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
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? sortBy) // mozda razdvoji na sort column i sort order
        {
            var products = await _productService.GetAllProducts(sortBy);
            return Ok(products);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            var product = await _productService.GetProduct(id);
            if (product == null) return NotFound();
            return product; // treba li ovo umotati u Ok ???
        }
        [HttpPut("{id}")] // ovaj put odstupa od HTTP standarda 
        public async Task<ActionResult<Product>> EditProduct(Guid id, [FromForm] ProductEditDTO productEditDTO)
        {
            try
            {
                var product = await _productService.EditProduct(id, productEditDTO);
                if (product == null) return NotFound();
                return Ok(product); // da li ovo ili no content;
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
