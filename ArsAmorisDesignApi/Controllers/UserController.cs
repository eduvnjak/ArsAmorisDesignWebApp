using Microsoft.AspNetCore.Mvc;
using ArsAmorisDesignApi.Models;
using ArsAmorisDesignApi.Services.UserService;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace ArsAmorisDesignApi.Controllers;

[Authorize]
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
}