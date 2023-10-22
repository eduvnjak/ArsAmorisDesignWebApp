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
    public async Task<ActionResult<IEnumerable<User>>> getUsers()
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