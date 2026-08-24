using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InfinytraWebsite.Data;
using InfinytraWebsite.Helpers;
using InfinytraWebsite.Models;

namespace InfinytraWebsite.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesApiController : ControllerBase
    {
        private readonly BandContext _context;

        public FavoritesApiController(BandContext context)
        {
            _context = context;
        }

        // GET: api/FavoritesApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Merch>>> GetFavorites()
        {
            var userId = this.GetUserId();
            if (userId == null) return Unauthorized();

            var merches = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Merch)
                .Select(f => f.Merch!)
                .ToListAsync();

            return merches;
        }

        // POST: api/FavoritesApi/5   (5 = merchId)
        [HttpPost("{merchId}")]
        public async Task<IActionResult> AddFavorite(int merchId)
        {
            var userId = this.GetUserId();
            if (userId == null) return Unauthorized();

            var merchExists = await _context.Merches.AnyAsync(m => m.Id == merchId);
            if (!merchExists) return NotFound(new { message = "Item not found." });

            var alreadyFavorited = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.MerchId == merchId);
            if (!alreadyFavorited)
            {
                _context.Favorites.Add(new Favorite
                {
                    UserId = userId.Value,
                    MerchId = merchId,
                    CreatedDate = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        // DELETE: api/FavoritesApi/5   (5 = merchId)
        [HttpDelete("{merchId}")]
        public async Task<IActionResult> RemoveFavorite(int merchId)
        {
            var userId = this.GetUserId();
            if (userId == null) return Unauthorized();

            var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.MerchId == merchId);
            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }
    }
}
