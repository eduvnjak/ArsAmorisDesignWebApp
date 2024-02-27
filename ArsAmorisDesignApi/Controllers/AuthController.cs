using Microsoft.AspNetCore.Mvc;
using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.UserService;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using ArsAmorisDesignApi.Services.RefreshTokenService;

namespace ArsAmorisDesignApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public AuthController(IUserService userService, IRefreshTokenService refreshTokenService, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
    {
        _userService = userService;
        _refreshTokenService = refreshTokenService;
        _configuration = configuration;
        _webHostEnvironment = webHostEnvironment;
    }
    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(UserDTO request)
    {
        var user = await _userService.GetUserByUsername(request.Username);
        if (user != null)
        {
            return BadRequest("Username already taken");
        }
        // da li je password ili username prazan itd
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        // var newUser = new User(request.Username, passwordHash); jesul konstruktori belaj????
        var newUser = new User
        {
            Username = request.Username,
            PasswordHash = passwordHash
        };
        await _userService.AddUser(newUser);
        return Ok();
    }
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(UserDTO request)
    {
        var user = await _userService.GetUserByUsername(request.Username);
        if (user == null)
        {
            return BadRequest("User not found");
        }
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            // izmijeniti ovo
            return BadRequest("Invalid password");
        }

        string accessToken = CreateJwtToken(user);

        RefreshToken refreshToken = new()
        {
            Value = Guid.NewGuid(),
            ExpirationDate = DateTime.UtcNow.AddDays(7),
            UserId = user.Id
        };
        // zapisi u bazu
        await _refreshTokenService.AddNewRefreshToken(refreshToken);

        var response = new LoginResponse { AccessToken = accessToken };
        // scopeaj ovaj cookie samo an refresh route
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.Now.AddDays(7),
            Path = "/api/Auth/Token",
            SameSite = _webHostEnvironment.IsProduction() ? SameSiteMode.Strict : SameSiteMode.None,
            Secure = true
        };
        // postavi refreshToken u cookie
        Response.Cookies.Append("refreshToken", refreshToken.Value.ToString(), cookieOptions);
        return Ok(response);
    }
    [HttpPost("Token/refresh")]//izmijeni mozda ovaj login response 
    public async Task<ActionResult<LoginResponse>> GetNewAccessToken()
    {
        string? refreshTokenString = Request.Cookies["refreshToken"];
        // imas li refresh token u cookie-u
        if (refreshTokenString == null)
        {
            return Unauthorized("No refresh token"); // da li ovo vratiti ??
        }

        try
        {
            // provjeri jel guid
            Guid refreshTokenValue = Guid.Parse(refreshTokenString);
            // provjeri u bazi jel dobar token
            var token = await _refreshTokenService.GetRefreshToken(refreshTokenValue);
            // da li token postoji
            if (token == null)
            {
                return Unauthorized("Invalid token");
            }
            // da li je istekao 
            if (DateTime.UtcNow > token.ExpirationDate)
            {
                //obrisi ga iz baze, ovo malo mozda malo traljavo jer svaki sljedeci req vraca invalid
                await _refreshTokenService.DeleteRefreshToken(refreshTokenValue);
                return Unauthorized("Expired token");
            }
            // daj korisnika iz baze  i napravi mu novi JWT
            var user = await _userService.GetUser(token.UserId);
            // ondelete cascade je postavljeno, ovo vjerovatno ne treba  
            if (user == null)
            {
                return Unauthorized("No user");
            }
            var accessToken = CreateJwtToken(user);

            return Ok(new LoginResponse { AccessToken = accessToken });
        }
        catch (FormatException)
        {
            return Unauthorized("Invalid token");
        }
    }
    // da li treba biti authorized??
    // ovo token zbog cookie path scopeanja
    [HttpPost("Token/logout")]
    public async Task<ActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        // imas li refresh token u cookie-u
        if (refreshToken == null)
        {
            return NoContent(); // da li ovo vratiti ??
        }
        try
        {
            // obrisi token u bazi
            await _refreshTokenService.DeleteRefreshToken(Guid.Parse(refreshToken));
        }
        catch (FormatException)
        {
            // u slucaju neuspjeha parsiranja tokena tj nevalidnog tokena
        }
        // izbrisi cookie
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.Now.AddDays(-1),
            Path = "/api/Auth/Token",
            SameSite = _webHostEnvironment.IsProduction() ? SameSiteMode.Strict : SameSiteMode.None,
            Secure = true
        };
        Response.Cookies.Append("refreshToken", "", cookieOptions);
        return NoContent();
    }
    private string CreateJwtToken(User user)
    {
        List<Claim> claims = new()
        {
            new Claim("name", user.Username),
            new Claim("sub", user.Id.ToString()), // ovaj sub je mozda suvisan
            new Claim("isAdmin", user.IsAdmin.ToString().ToLower())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Token:Secret").Value!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512); // koji algoritam ovdje
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: creds);
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }
}