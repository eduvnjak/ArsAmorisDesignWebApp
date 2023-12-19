using System.Threading.RateLimiting;
using ArsAmorisDesignApi.Data;
using ArsAmorisDesignApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ArsAmorisDesignApi.Services.RefreshTokenService
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly AppDbContext _dbContext;
        public RefreshTokenService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<RefreshToken> AddNewRefreshToken(RefreshToken refreshToken)
        {
            await _dbContext.RefreshTokens.AddAsync(refreshToken);
            await _dbContext.SaveChangesAsync();
            return refreshToken;
        }

        public async Task<bool> DeleteRefreshToken(Guid value)
        {
            var token = await _dbContext.RefreshTokens.FindAsync(value);

            if (token == null)
            {
                return false;
            }
            _dbContext.RefreshTokens.Remove(token);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<RefreshToken?> GetRefreshToken(Guid value)
        {
            return await _dbContext.RefreshTokens.FindAsync(value);
        }
    }
}