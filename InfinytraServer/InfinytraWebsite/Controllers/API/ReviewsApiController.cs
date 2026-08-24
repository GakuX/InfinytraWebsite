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
    public class ReviewsApiController : ControllerBase
    {
        private readonly BandContext _context;

        public ReviewsApiController(BandContext context)
        {
            _context = context;
        }

        // GET: api/ReviewsApi/merch/5
        [HttpGet("merch/{merchId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsForMerch(int merchId)
        {
            return await _context.Reviews
                .Where(r => r.MerchId == merchId)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();
        }

        // POST: api/ReviewsApi/merch/5
        [Authorize]
        [HttpPost("merch/{merchId}")]
        public async Task<ActionResult<Review>> PostReview(int merchId, ReviewRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var userId = this.GetUserId();
            if (userId == null) return Unauthorized();

            var merchExists = await _context.Merches.AnyAsync(m => m.Id == merchId);
            if (!merchExists) return NotFound(new { message = "Item not found." });

            var alreadyReviewed = await _context.Reviews.AnyAsync(r => r.UserId == userId && r.MerchId == merchId);
            if (alreadyReviewed)
            {
                return Conflict(new { message = "You've already reviewed this item." });
            }

            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null) return Unauthorized();

            var review = new Review
            {
                MerchId = merchId,
                UserId = userId.Value,
                Username = user.Username,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedDate = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(review);
        }

        // DELETE: api/ReviewsApi/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userId = this.GetUserId();
            if (userId == null) return Unauthorized();

            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            var isAdmin = User.HasClaim("IsAdmin", "true");
            if (review.UserId != userId && !isAdmin)
            {
                return Forbid();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
