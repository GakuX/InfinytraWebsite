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
    public class TourDatesApiController : ControllerBase
    {
        private readonly BandContext _context;

        public TourDatesApiController(BandContext context)
        {
            _context = context;
        }

        // GET: api/TourDatesApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourDate>>> GetTourDates()
        {
            return await _context.TourDates.OrderBy(t => t.ShowDate).ToListAsync();
        }

        // GET: api/TourDatesApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TourDate>> GetTourDate(int id)
        {
            var tourDate = await _context.TourDates.FindAsync(id);

            if (tourDate == null)
            {
                return NotFound();
            }

            return tourDate;
        }

        // PUT: api/TourDatesApi/5
        [Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTourDate(int id, TourDate tourDate)
        {
            if (id != tourDate.Id)
            {
                return BadRequest();
            }

            _context.Entry(tourDate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourDateExists(id))
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

        // POST: api/TourDatesApi
        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<ActionResult<TourDate>> PostTourDate(TourDate tourDate)
        {
            _context.TourDates.Add(tourDate);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTourDate", new { id = tourDate.Id }, tourDate);
        }

        // DELETE: api/TourDatesApi/5
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourDate(int id)
        {
            var tourDate = await _context.TourDates.FindAsync(id);
            if (tourDate == null)
            {
                return NotFound();
            }

            _context.TourDates.Remove(tourDate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TourDateExists(int id)
        {
            return _context.TourDates.Any(e => e.Id == id);
        }
    }
}
