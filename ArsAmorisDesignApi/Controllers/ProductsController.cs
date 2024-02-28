﻿using System.Security.Claims;
using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.ProductService;
using Microsoft.AspNetCore.Authorization;
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
                return Ok(await MapDomainToDTO(product));
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
            return Ok(await MapDomainToDTO(products));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(Guid id)
        {
            var product = await _productService.GetProduct(id);
            if (product == null) return NotFound();
            return await MapDomainToDTO(product); // treba li ovo umotati u Ok ???
        }
        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("{id}")] // ovaj put odstupa od HTTP standarda 
        public async Task<ActionResult<ProductDTO>> EditProduct(Guid id, [FromForm] ProductEditDTO productEditDTO)
        {
            try
            {
                var product = await _productService.EditProduct(id, productEditDTO);
                if (product == null) return NotFound();

                return Ok(await MapDomainToDTO(product)); // da li ovo ili no content;
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("Category/{categoryId?}")] // swagger ne detektuje optional route parameter
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByCategory([FromQuery] string? sortBy, Guid? categoryId = null) // ovo sa null je mozda malo grbavo ali radi
        {
            var products = await _productService.GetProductsByCategory(categoryId, sortBy);
            return Ok(await MapDomainToDTO(products));
        }
        [HttpGet("Featured")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetFeaturedProducts() // za sada ne trebaju nikakvi parametri
        {
            var products = await _productService.GetFeaturedProducts();
            return Ok(await MapDomainToDTO(products));
        }
        [Authorize]
        [HttpPost("{productId}/Like")]
        public async Task<IActionResult> LikeProduct(Guid productId)
        {
            return await _productService.LikeProduct(GetUserId(), productId) ? Ok() : BadRequest();
        }
        [Authorize]
        [HttpDelete("{productId}/Like")]
        public async Task<IActionResult> UnlikeProduct(Guid productId)
        {
            return await _productService.UnlikeProduct(GetUserId(), productId) ? Ok() : BadRequest();
        }
        private async Task<ProductDTO> MapDomainToDTO(Product product)
        {
            return await MappingHelper(product, await IsProductLiked(product.Id));
        }
        private async Task<IEnumerable<ProductDTO>> MapDomainToDTO(IEnumerable<Product> products)
        {
            var likedProducts = await GetLikedProducts();
            var productsDTO = new List<ProductDTO>();

            foreach (var product in products)
            {
                productsDTO.Add(await MappingHelper(product, likedProducts != null && likedProducts.Contains(product.Id)));
            }
            return productsDTO;
        }
        // kako nazvati ovo čudo
        private async Task<ProductDTO> MappingHelper(Product product, bool liked)
        {
            int likeCount = await _productService.GetLikeCountForProduct(product.Id);
            return new ProductDTO(
                    product,
                    $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{product.ImageFileName}",
                    likeCount,
                    liked
            );
        }
        private async Task<List<Guid>?> GetLikedProducts()
        {
            try
            {
                return (List<Guid>?)await _productService.GetLikedProductsForUser(GetUserId());
            }
            catch (ArgumentNullException)
            {
                return null;
            }
        }
        private async Task<bool> IsProductLiked(Guid productId)
        {
            try
            {
                return await _productService.IsProductLikedByUser(productId, GetUserId());
            }
            catch (ArgumentNullException)
            {
                return false;
            }
        }
        private long GetUserId()
        {
            // oprez! ovo moze baciti ArgumentNullException 
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var userIdString = identity?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return long.Parse(userIdString!);
        }
    }
}
