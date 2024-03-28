using System.Security.Claims;
using System.Text.RegularExpressions;
using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.ProductService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArsAmorisDesignApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductsController(IProductService productService, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHostEnvironment)
        {
            _productService = productService;
            _httpContextAccessor = httpContextAccessor;
            _webHostEnvironment = webHostEnvironment;


        }
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromForm] ProductPostDTO productPostDTO)
        {
            try
            {
                if (productPostDTO.Images.Count > 5) return BadRequest("Too many images"); // max 5 images
                productPostDTO.Images.ForEach(ValidateImageUpload);
                List<ProductImage> productImageList = new();
                Regex sWhitespace = MyRegex();
                var productNameNoWhitespace = sWhitespace.Replace(productPostDTO.Name, "");
                for (int i = 0; i < productPostDTO.Images.Count; i++)
                {
                    var image = productPostDTO.Images[i];
                    string imageExtension = Path.GetExtension(image.FileName);
                    //string imageName = Path.GetRandomFileName().Replace(".", "-");
                    string imageName = $"{productNameNoWhitespace}{i + 1}";
                    // provjeriti da li ima neka vec slika sa istim imenom
                    var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", $"{imageName}{imageExtension}");
                    using var stream = new FileStream(localFilePath, FileMode.Create);
                    await image.CopyToAsync(stream);
                    // trebao bih staviti neki error handling
                    productImageList.Add(new ProductImage { ImageName = $"{imageName}{imageExtension}" });
                }
                var product = new Product
                {
                    Name = productPostDTO.Name,
                    Price = productPostDTO.Price,
                    Description = productPostDTO.Description,
                    Images = productImageList,
                    ProductCategoryId = productPostDTO.ProductCategoryId,
                    Featured = productPostDTO.Featured
                };
                product = await _productService.AddProduct(product);
                return Ok(await MapDomainToDTO(product));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        // [Authorize(Policy = "AdminPolicy")]
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteProduct(Guid id)
        // {
        //     bool deleted = await _productService.DeleteProduct(id);
        //     if (deleted)
        //     {
        //         return NoContent();
        //     }
        //     else
        //     {
        //         return NotFound();
        //     }
        // }
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
        // [Authorize(Policy = "AdminPolicy")]
        // [HttpPut("{id}")] // ovaj put odstupa od HTTP standarda 
        // public async Task<ActionResult<ProductDTO>> EditProduct(Guid id, [FromForm] ProductEditDTO productEditDTO)
        // {
        //     try
        //     {
        //         var product = await _productService.EditProduct(id, productEditDTO);
        //         if (product == null) return NotFound();

        //         return Ok(await MapDomainToDTO(product)); // da li ovo ili no content;
        //     }
        //     catch (Exception e)
        //     {
        //         return BadRequest(e.Message);
        //     }
        // }
        [HttpGet("Category/{categoryIdRouteParam}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByCategory([FromQuery] string? sortBy, string categoryIdRouteParam)
        {
            try
            {
                Guid? categoryId = categoryIdRouteParam == "null" ? null : Guid.Parse(categoryIdRouteParam);
                var products = await _productService.GetProductsByCategory(categoryId, sortBy);
                return Ok(await MapDomainToDTO(products));
            }
            catch (FormatException)
            {
                return BadRequest();
            }
        }
        [HttpGet("Category/{categoryIdRouteParam}/Random/{count}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetRandomProductsFromCategory(string categoryIdRouteParam, int count)
        {
            try
            {
                Guid? categoryId = categoryIdRouteParam == "null" ? null : Guid.Parse(categoryIdRouteParam);
                var products = await _productService.GetRandomByCategory(categoryId, count);
                return Ok(await MapDomainToDTO(products));
            }
            catch (FormatException)
            {
                return BadRequest();
            }
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
            int likeCount = await _productService.GetLikeCountForProduct(product.Id);
            return MappingHelper(product, likeCount, await IsProductLiked(product.Id));
        }
        private async Task<IEnumerable<ProductDTO>> MapDomainToDTO(IEnumerable<Product> products)
        {
            var likedProducts = GetLikedProducts();
            var productLikesDictionary = await _productService.GetLikeCountForProducts(products.Select(product => product.Id).ToHashSet());
            return products.Select(product => MappingHelper(product, productLikesDictionary[product.Id], likedProducts != null && likedProducts.Contains(product.Id))).ToList();
        }
        // kako nazvati ovo čudo
        private ProductDTO MappingHelper(Product product, int likeCount, bool liked)
        {
            return new ProductDTO(
                    product,
                    product.Images.Select(productImage => $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{productImage.ImageName}").ToList(),
                    likeCount,
                    liked
            );
        }
        private ISet<Guid>? GetLikedProducts()
        {
            try
            {
                return _productService.GetLikedProductsForUser(GetUserId());
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
        private static void ValidateImageUpload(IFormFile imageFile)
        {
            var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
            if (!allowedExtensions.Contains(Path.GetExtension(imageFile.FileName)))
            {
                throw new Exception($"{imageFile.FileName} has unsupported image extension");
            }
            if (imageFile.Length > 5242880)  // 5MB limit
            {
                throw new Exception($"Image {imageFile.FileName} too large");
            }
        }

        [GeneratedRegex("\\s+")]
        private static partial Regex MyRegex();
    }
}
