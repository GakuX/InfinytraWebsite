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
    public class OrdersApiController : ControllerBase
    {
        private readonly BandContext _context;

        public OrdersApiController(BandContext context)
        {
            _context = context;
        }

        // GET: api/OrdersApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userId = this.GetUserId();
            if (userId == null) return Unauthorized();

            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        // POST: api/OrdersApi/checkout
        [HttpPost("checkout")]
        public async Task<ActionResult<Order>> Checkout(CheckoutRequest request)
        {
            var userId = this.GetUserId();
            if (userId == null) return Unauthorized();

            if (request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(new { message = "Cart is empty." });
            }

            var merchIds = request.Items.Select(i => i.MerchId).ToList();
            var merches = await _context.Merches.Where(m => merchIds.Contains(m.Id)).ToListAsync();

            var order = new Order
            {
                UserId = userId.Value,
                OrderDate = DateTime.UtcNow,
                Status = "Placed"
            };

            decimal total = 0;

            foreach (var item in request.Items)
            {
                var merch = merches.FirstOrDefault(m => m.Id == item.MerchId);
                if (merch == null || item.Qty < 1) continue;

                // Always price from the server's current record, never trust a client-supplied price.
                var unitPrice = merch.OnSale && merch.SalePrice.HasValue ? merch.SalePrice.Value : merch.Price;

                order.Items.Add(new OrderItem
                {
                    MerchId = merch.Id,
                    ItemName = merch.ItemName,
                    UnitPrice = unitPrice,
                    Qty = item.Qty
                });

                total += unitPrice * item.Qty;
            }

            if (order.Items.Count == 0)
            {
                return BadRequest(new { message = "None of the items in the cart could be found." });
            }

            order.Total = total;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
