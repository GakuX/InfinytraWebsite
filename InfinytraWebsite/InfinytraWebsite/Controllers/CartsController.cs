using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using InfinytraWebsite.Data;
using InfinytraWebsite.Models;
using System.Text.Json;
namespace InfinytraWebsite.Controllers
{
    public class CartsController : Controller
    {
        private readonly BandContext _context;

        public CartsController(BandContext context)
        {
            _context = context;
        }

        // GET: Carts
        public async Task<IActionResult> Index()
        {
            var cart = GetCart();

            var ids = cart.Select(x => x.Id).ToList();
            var merches = await _context.Merches
                .Where(m => ids.Contains(m.Id))
                .ToListAsync();

            // Build a view model inline (simple)
            var result = cart.Select(ci => new
            {
                Merch = merches.FirstOrDefault(m => m.Id == ci.Id),
                Qty = ci.Qty
            }).Where(x => x.Merch != null).ToList();

            ViewBag.Total = result.Sum(x =>
                (x.Merch.OnSale && x.Merch.SalePrice.HasValue ? x.Merch.SalePrice.Value : x.Merch.Price) * x.Qty
            );

            return View(result);
        }
        


        //session json cart thingy
        private List<Cart> GetCart()
        {
            var json = HttpContext.Session.GetString("CART");
            if (json == null) return new List<Cart>();
            return JsonSerializer.Deserialize<List<Cart>>(json) ?? new List<Cart>();
        }


        private void SaveCart(List<Cart> cart)
        {
            var json = JsonSerializer.Serialize(cart);
            HttpContext.Session.SetString("CART", json);
        }

        [HttpPost]
        public IActionResult Add(int id)
        {
            var cart = GetCart();

            var existing = cart.FirstOrDefault(x => x.Id == id);
            if (existing == null)
                cart.Add(new Cart { Id = id, Qty = 1 });
            else
                existing.Qty = existing.Qty + 1;

            SaveCart(cart);

            return RedirectToAction("Index");
        }







        // GET: Carts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cart = await _context.Carts
                .FirstOrDefaultAsync(m => m.Id == id);
            if (cart == null)
            {
                return NotFound();
            }

            return View(cart);
        }

        // GET: Carts/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Carts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Qty")] Cart cart)
        {
            if (ModelState.IsValid)
            {
                _context.Add(cart);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(cart);
        }

        // GET: Carts/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cart = await _context.Carts.FindAsync(id);
            if (cart == null)
            {
                return NotFound();
            }
            return View(cart);
        }

        // POST: Carts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Qty")] Cart cart)
        {
            if (id != cart.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(cart);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CartExists(cart.Id))
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
            return View(cart);
        }

        // GET: Carts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cart = await _context.Carts
                .FirstOrDefaultAsync(m => m.Id == id);
            if (cart == null)
            {
                return NotFound();
            }

            return View(cart);
        }

        // POST: Carts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart != null)
            {
                _context.Carts.Remove(cart);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CartExists(int id)
        {
            return _context.Carts.Any(e => e.Id == id);
        }
    }
}
