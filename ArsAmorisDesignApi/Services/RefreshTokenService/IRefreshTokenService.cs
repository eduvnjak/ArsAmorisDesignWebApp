using ArsAmorisDesignApi.Models;

namespace ArsAmorisDesignApi.Services.RefreshTokenService
{
    public interface IRefreshTokenService
    {
        Task<RefreshToken> AddNewRefreshToken(RefreshToken refreshToken);
        Task<bool> DeleteRefreshToken(Guid value);
        Task<RefreshToken?> GetRefreshToken(Guid value);
    }
}