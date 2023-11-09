using ArsAmorisDesignApi.Models;

namespace ArsAmorisDesignApi.Services.UserService
{
    public interface IUserService
    {
        Task<List<User>> GetUsers();

        Task<User?> GetUser(long id);

        Task<List<User>> AddUser(User user);

        Task<List<User>> DeleteUser(long id);

        Task<User?> GetUserByUsername(string username);
    }
}