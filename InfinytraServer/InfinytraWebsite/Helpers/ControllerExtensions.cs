using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace InfinytraWebsite.Helpers
{
    public static class ControllerExtensions
    {
        // Reads the authenticated user's id from the JWT NameIdentifier claim. Returns null if missing/invalid -
        // callers behind [Authorize] should treat null as an auth failure that shouldn't normally happen.
        public static int? GetUserId(this ControllerBase controller)
        {
            var idClaim = controller.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (idClaim == null || !int.TryParse(idClaim, out var id))
            {
                return null;
            }

            return id;
        }
    }
}
