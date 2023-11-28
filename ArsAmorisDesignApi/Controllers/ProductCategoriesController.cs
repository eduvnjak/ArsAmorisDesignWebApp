using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.ProductCategoryService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArsAmorisDesignApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCategoriesController : ControllerBase
    {
        private readonly IProductCategoryService _productCategoryService;

        public ProductCategoriesController(IProductCategoryService productCategoryService)
        {
            _productCategoryService = productCategoryService;
        }

        [HttpPost]
        public async Task<ActionResult<ProductCategory>> PostProductCategory([FromBody] PostProductCategoryDTO postProductCategoryDTO)
        {
            try
            {
                // provjeri je li unique
                var productCategory = await _productCategoryService.AddCategory(postProductCategoryDTO.Name);
                return Ok(productCategory);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductCategory(Guid id)
        {
            bool deleted = await _productCategoryService.DeleteCategory(id);
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
        public async Task<ActionResult<IEnumerable<ProductCategory>>> GetProductCategories()
        {
            var productCategories = await _productCategoryService.GetAllCategories();

            return Ok(productCategories);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductCategory>> GetProductCategory(Guid id)
        {
            var productCategory = await _productCategoryService.GetCategoryById(id);
            if (productCategory == null) return NotFound();
            return Ok(productCategory);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductCategory>> EditProductCategory(Guid id, [FromBody] PostProductCategoryDTO postProductCategoryDTO)
        {
            try
            {
                var productCategory = await _productCategoryService.EditProductCategory(id, postProductCategoryDTO.Name);
                if (productCategory == null) return NotFound();
                return Ok(productCategory); // da li ovo ili no content;
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
