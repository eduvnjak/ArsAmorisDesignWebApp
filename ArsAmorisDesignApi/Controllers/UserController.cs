using Microsoft.AspNetCore.Mvc;
using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.UserService;

namespace ArsAmorisDesignApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _userService.GetUsers();
    }
    [HttpPost]
    public async Task<ActionResult> Create(User user)
    {
        var result = await _userService.AddUser(user);
        return Ok(result);
    }
    // za sada neka bude ovdje 
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
        return Ok(newUser);
    }
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(UserDTO request)
    {
        var user = await _userService.GetUserByUsername(request.Username);
        if (user == null)
        {
            return BadRequest("User not found");
        }
        if(!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            // izmijeniti ovo
            return BadRequest("Invalid password");
        }
        return Ok(user);
    }
}