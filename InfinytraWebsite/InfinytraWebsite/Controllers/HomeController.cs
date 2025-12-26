using System.Diagnostics;
using InfinytraWebsite.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfinytraWebsite.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        public IActionResult ListenModal()
        {
            return PartialView("_ListenModal");
        }

        [HttpPost]
        public IActionResult NewsletterSignup(string email)
        {
            // Later: validate + save to DB
            if (string.IsNullOrWhiteSpace(email))
                return Json(new { ok = false });

            return Json(new { ok = true });
        }


        public IActionResult NewsletterModal()
        {
            return PartialView("_NewsletterModal");
        }


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
