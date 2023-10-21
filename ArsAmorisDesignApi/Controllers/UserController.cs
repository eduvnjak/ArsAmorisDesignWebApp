using Microsoft.AspNetCore.Mvc;
using ArsAmorisDesignApi.Models;

namespace ArsAmorisDesignApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserDbContext _dbContext;
    public UserController(UserDbContext userDbContext)
    {
        _dbContext = userDbContext;
    }

    [HttpGet]
    public ActionResult<IEnumerable<User>> getUsers()
    {
        return _dbContext.Users;
    }
    [HttpPost]
    public async Task<ActionResult> Create(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
        return Ok();
    }
}