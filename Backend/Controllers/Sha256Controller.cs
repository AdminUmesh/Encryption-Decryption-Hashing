using Microsoft.AspNetCore.Mvc;
using Secure_API.Services;

namespace Secure_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Sha256Controller : ControllerBase
    {
        private readonly ISha256Service _shaService;

        public Sha256Controller(ISha256Service shaService)
        {
            _shaService = shaService;
        }

        public class RegisterRequest
        {
            public string UserName { get; set; } = "";
            public string Password { get; set; } = "";
        }

        public class LoginRequest
        {
            public string UserName { get; set; } = "";
            public string Password { get; set; } = "";
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            try
            {
                var user = _shaService.Create(req.UserName, req.Password);
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
            if (!_shaService.ValidateCredentials(req.UserName, req.Password, out var user) || user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { message = "Login successful" });
        }
    }
}
