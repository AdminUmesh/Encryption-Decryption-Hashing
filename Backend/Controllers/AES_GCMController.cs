using Microsoft.AspNetCore.Mvc;
using Secure_API.Services;
using System.Text;

namespace Secure_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AES_GCMController : ControllerBase
    {
        private readonly AES_GcmService _service;
        public AES_GCMController(AES_GcmService service)
        {
            _service = service;
        }

        [HttpGet("key")]
        public ActionResult<string> GetKeyBase64()
        {
            var key= Convert.ToBase64String(_service.GetKey());
            return key;
        }

        public class PlainRequest { public string Plain { get; set; } = ""; }
        public class EncryptedRequest { public string Base64Package { get; set; } = ""; }

        [HttpPost("encrypt")]
        public ActionResult<string> Encrypt([FromBody] PlainRequest req)
        {
            var b = Encoding.UTF8.GetBytes(req.Plain ?? "");
            var outB64 = _service.EncryptToBase64(b);
            return outB64;
        }

        [HttpPost("decrypt")]
        public ActionResult<string> Decrypt([FromBody] EncryptedRequest req)
        {
            try
            {
                var plain = _service.DecryptFromBase64(req.Base64Package);
                return Encoding.UTF8.GetString(plain);
            }
            catch
            {
                return BadRequest("Decryption failed (tampered or wrong data).");
            }
        }
    }
}
