using Microsoft.AspNetCore.Mvc;
using Secure_API.Services;

namespace Secure_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BCryptController : ControllerBase
    {
        private readonly IBcryptService _bcyptService;

        public BCryptController(IBcryptService bcyptService)
        {
            _bcyptService = bcyptService;
        }

        public class RegisterRequest { public string UserName { get; set; } = ""; public string Password { get; set; } = ""; }
        public class LoginRequest { public string UserName { get; set; } = ""; public string Password { get; set; } = ""; }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            try
            {
                var user = _bcyptService.Create(req.UserName, req.Password);
                return Ok(new { user.Id, user.UserName });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (!_bcyptService.ValidateCredentials(req.UserName, req.Password, out var user) || user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            // If no JWT, return simple success
            return Ok(new { message = "Login successful" });
        }
    }
}
