using Microsoft.AspNetCore.Mvc;
using Secure_API.Services;

namespace Secure_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Md5Controller : ControllerBase
    {
        private readonly IMd5Service _md5Service;

        public Md5Controller(IMd5Service md5Service)
        {
            _md5Service = md5Service;
        }

        public class RegisterRequest { public string UserName { get; set; } = ""; public string Password { get; set; } = ""; }
        public class LoginRequest { public string UserName { get; set; } = ""; public string Password { get; set; } = ""; }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            try
            {
                var user = _md5Service.Create(req.UserName, req.Password);
                return Ok(new { user.Id, user.UserName, user.PasswordHash });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (_md5Service.ValidateCredentials(req.UserName, req.Password, out var user))
                return Ok(new { message = "Login successful" });

            return Unauthorized(new { message = "Invalid username or password" });
        }
    }
}