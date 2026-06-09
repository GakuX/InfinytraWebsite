using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InfinytraWebsite.Data;
using InfinytraWebsite.Models;

namespace InfinytraWebsite.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class MerchesApiController : ControllerBase
    {
        private readonly BandContext _context;

        public MerchesApiController(BandContext context)
        {
            _context = context;
        }

        // GET: api/MerchesApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Merch>>> GetMerches()
        {
            return await _context.Merches.ToListAsync();
        }

        // GET: api/MerchesApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Merch>> GetMerch(int id)
        {
            var merch = await _context.Merches.FindAsync(id);

            if (merch == null)
            {
                return NotFound();
            }

            return merch;
        }

        // PUT: api/MerchesApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMerch(int id, Merch merch)
        {
            if (id != merch.Id)
            {
                return BadRequest();
            }

            _context.Entry(merch).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MerchExists(id))
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

        // POST: api/MerchesApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Merch>> PostMerch(Merch merch)
        {
            _context.Merches.Add(merch);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMerch", new { id = merch.Id }, merch);
        }

        // DELETE: api/MerchesApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMerch(int id)
        {
            var merch = await _context.Merches.FindAsync(id);
            if (merch == null)
            {
                return NotFound();
            }

            _context.Merches.Remove(merch);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MerchExists(int id)
        {
            return _context.Merches.Any(e => e.Id == id);
        }
    }
}
