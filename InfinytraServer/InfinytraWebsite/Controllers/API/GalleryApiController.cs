using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InfinytraWebsite.Data;
using InfinytraWebsite.Models;

namespace InfinytraWebsite.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryApiController : ControllerBase
    {
        private readonly BandContext _context;

        public GalleryApiController(BandContext context)
        {
            _context = context;
        }

        // GET: api/GalleryApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GalleryImage>>> GetImages()
        {
            return await _context.GalleryImages.OrderByDescending(g => g.UploadedDate).ToListAsync();
        }

        // GET: api/GalleryApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GalleryImage>> GetImage(int id)
        {
            var image = await _context.GalleryImages.FindAsync(id);
            if (image == null)
            {
                return NotFound();
            }

            return image;
        }

        // POST: api/GalleryApi
        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<ActionResult<GalleryImage>> PostImage(GalleryImage image)
        {
            image.UploadedDate = DateTime.UtcNow;
            _context.GalleryImages.Add(image);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetImage", new { id = image.Id }, image);
        }

        // DELETE: api/GalleryApi/5
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.GalleryImages.FindAsync(id);
            if (image == null)
            {
                return NotFound();
            }

            _context.GalleryImages.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
