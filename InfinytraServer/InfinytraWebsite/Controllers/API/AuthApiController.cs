using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using InfinytraWebsite.Data;
using InfinytraWebsite.Helpers;
using InfinytraWebsite.Models;

namespace InfinytraWebsite.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {
        private readonly BandContext _context;
        private readonly IConfiguration _config;

        public AuthApiController(BandContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // POST: api/AuthApi/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var username = request.Username.Trim();
            var email = request.Email.Trim();

            var usernameTaken = await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower());
            if (usernameTaken)
            {
                return Conflict(new { message = "That username is already taken." });
            }

            var emailTaken = await _context.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());
            if (emailTaken)
            {
                return Conflict(new { message = "That email is already registered." });
            }

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = PasswordHasher.Hash(request.Password),
                CreatedDate = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(BuildAuthResponse(user));
        }

        // POST: api/AuthApi/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var usernameOrEmail = request.UsernameOrEmail.Trim().ToLower();

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Username.ToLower() == usernameOrEmail || u.Email.ToLower() == usernameOrEmail);

            if (user == null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid username/email or password." });
            }

            return Ok(BuildAuthResponse(user));
        }

        // GET: api/AuthApi/me
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<AuthResponse>> Me()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (idClaim == null || !int.TryParse(idClaim, out var id))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(new AuthResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            });
        }

        private AuthResponse BuildAuthResponse(User user)
        {
            return new AuthResponse
            {
                Token = GenerateToken(user),
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            };
        }

        private string GenerateToken(User user)
        {
            var jwtSection = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("IsAdmin", user.IsAdmin ? "true" : "false")
            };

            var expiryMinutes = double.Parse(jwtSection["ExpiryMinutes"] ?? "10080");

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
