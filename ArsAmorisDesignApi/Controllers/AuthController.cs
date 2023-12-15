using Microsoft.AspNetCore.Mvc;
using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.UserService;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace ArsAmorisDesignApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthController(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
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
        var newUser = new User();
        newUser.Username = request.Username;
        newUser.PasswordHash = passwordHash;
        await _userService.AddUser(newUser);
        return Ok();
    }
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(UserDTO request)
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

        string token = CreateToken(user);
        var response = new LoginResponse { Token = token };

        return Ok(response);
    }
    private string CreateToken(User user)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim("name", user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Token:Secret").Value!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512); // koji algoritam ovdje
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(30), //vrati na addminutes 30
            signingCredentials: creds);
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }
}