using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using InfinytraWebsite.Data;
using InfinytraWebsite.Models;

namespace InfinytraWebsite.Controllers
{
    public class MerchesController : Controller
    {
        private readonly BandContext _context;

        public MerchesController(BandContext context)
        {
            _context = context;
        }

        // GET: Merches
        public IActionResult Index(string q, string category, string gender, string price, bool inStockOnly)
        {
            var merches = _context.Merches.ToList(); 

;
            if (!string.IsNullOrWhiteSpace(q))
            {
                merches = merches.Where(n => n.ItemName.ToLower().Contains(q)).ToList(); 
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                merches = merches.Where(c => c.Categories == category).ToList(); 
            }


            if (!string.IsNullOrWhiteSpace(price))
            {
                if (price == "0-25")
                    merches = merches.Where(m => m.Price < 25m).ToList();

                else if (price == "25-50")
                    merches = merches.Where(m => m.Price >= 25m && m.Price <= 50m).ToList();

                else if (price == "50-999")
                    merches = merches.Where(m => m.Price > 50m).ToList();
            }

            if (inStockOnly)
            {
                merches = merches
                    .Where(m => m.InStock)
                    .ToList();
            }


            if (!string.IsNullOrWhiteSpace(gender))
            {

                merches = merches.Where(g => g.Gender == gender).ToList(); 

            }


                return View(merches);
        }


        public async Task<IActionResult> Filffter(string q, string category, string gender, string price, bool inStockOnly)
        {

            if (!string.IsNullOrWhiteSpace(q))
            {
                var name = _context.Merches.Where(n => n.ItemName.Contains(q)); 
            }



            return View(); 
        }

        // GET: Merches/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var merch = await _context.Merches
                .FirstOrDefaultAsync(m => m.Id == id);
            if (merch == null)
            {
                return NotFound();
            }

            return View(merch);
        }

        // GET: Merches/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Merches/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,ItemName,ItemDescription,NewItem,Price,ImageURL,InStock,Categories")] Merch merch)
        {
            if (ModelState.IsValid)
            {
                _context.Add(merch);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(merch);
        }

        // GET: Merches/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var merch = await _context.Merches.FindAsync(id);
            if (merch == null)
            {
                return NotFound();
            }
            return View(merch);
        }

        // POST: Merches/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ItemName,ItemDescription,NewItem,Price,ImageURL,InStock,Categories")] Merch merch)
        {
            if (id != merch.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(merch);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MerchExists(merch.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(merch);
        }

        // GET: Merches/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var merch = await _context.Merches
                .FirstOrDefaultAsync(m => m.Id == id);
            if (merch == null)
            {
                return NotFound();
            }

            return View(merch);
        }

        // POST: Merches/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var merch = await _context.Merches.FindAsync(id);
            if (merch != null)
            {
                _context.Merches.Remove(merch);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MerchExists(int id)
        {
            return _context.Merches.Any(e => e.Id == id);
        }
    }
}
