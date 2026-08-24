using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InfinytraWebsite.Data;
using InfinytraWebsite.Models;

namespace InfinytraWebsite.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsApiController : ControllerBase
    {
        private readonly BandContext _context;

        public NewsApiController(BandContext context)
        {
            _context = context;
        }

        // GET: api/NewsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsPost>>> GetNews()
        {
            return await _context.NewsPosts.OrderByDescending(n => n.PostedDate).ToListAsync();
        }

        // GET: api/NewsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsPost>> GetNewsPost(int id)
        {
            var newsPost = await _context.NewsPosts.FindAsync(id);

            if (newsPost == null)
            {
                return NotFound();
            }

            return newsPost;
        }

        // PUT: api/NewsApi/5
        [Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNewsPost(int id, NewsPost newsPost)
        {
            if (id != newsPost.Id)
            {
                return BadRequest();
            }

            _context.Entry(newsPost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NewsPostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/NewsApi
        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<ActionResult<NewsPost>> PostNewsPost(NewsPost newsPost)
        {
            _context.NewsPosts.Add(newsPost);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNewsPost", new { id = newsPost.Id }, newsPost);
        }

        // DELETE: api/NewsApi/5
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNewsPost(int id)
        {
            var newsPost = await _context.NewsPosts.FindAsync(id);
            if (newsPost == null)
            {
                return NotFound();
            }

            _context.NewsPosts.Remove(newsPost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NewsPostExists(int id)
        {
            return _context.NewsPosts.Any(e => e.Id == id);
        }
    }
}
