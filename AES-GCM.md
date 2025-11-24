# AES‑GCM Notes for .NET (Step‑by‑Step)

> Downloadable quick reference and step-by-step notes for AES‑GCM using .NET (AesGcm). Includes how the service and controller work, DI registration, key generation, encryption/decryption flow, curl examples, and security recommendations.

---

## Overview
AES‑GCM (Galois/Counter Mode) is an authenticated symmetric encryption mode that provides both confidentiality (encryption) and integrity/authenticity via an authentication tag. In .NET you can use the `System.Security.Cryptography.AesGcm` class to perform AES‑GCM encryption and decryption.

This document explains the sample `AesGcmService` and `CryptoController` step by step, how to register the service in DI, and how to call the API endpoints.

---

## Files in sample
- `Secure_API.Services.AesGcmService` — service that generates/stores key in memory, provides encrypt/decrypt helpers.
- `Secure_API.Controllers.CryptoController` — API controller with endpoints:
  - `GET api/crypto/key` — returns the base64 key (demo only)
  - `POST api/crypto/encrypt` — encrypts a plaintext JSON payload and returns base64 package
  - `POST api/crypto/decrypt` — decrypts a base64 package and returns plaintext

---

## Step 1 — DI registration (Program.cs)
Register the service so ASP.NET Core can inject it into controllers. Example uses **Singleton** so the same key stays in memory for the app lifetime (demo only):

```csharp
// Program.cs (or wherever you do service registration)
builder.Services.AddSingleton<Secure_API.Services.AesGcmService>();
// or, if you had an interface:
// builder.Services.AddSingleton<IAesGcmService, AesGcmService>();
```

**Why Singleton here?** The sample keeps a generated key in memory inside the service. Using Singleton ensures the same key is reused across requests for the app lifetime. For production you'll want secure key storage (Key Vault) and consider rotation — do NOT keep keys as singletons in most real systems unless the key is securely managed and rotated.

---

## Step 2 — How the AesGcmService works (walkthrough)

### Service code (core parts)
```csharp
public class AesGcmService
{
    public const int KeySize = 32; // 256-bit key
    public const int NonceSize = 12;
    public const int TagSize = 16;

    private readonly byte[] _key;

    public AesGcmService()
    {
        _key = new byte[KeySize];
        RandomNumberGenerator.Fill(_key); // secure random key generation
    }

    public byte[] GetKey() => (byte[])_key.Clone();

    public string EncryptToBase64(byte[] plaintext)
    {
        var nonce = new byte[NonceSize];
        RandomNumberGenerator.Fill(nonce);

        var ciphertext = new byte[plaintext.Length];
        var tag = new byte[TagSize];

        using var aes = new AesGcm(_key);
        aes.Encrypt(nonce, plaintext, ciphertext, tag);

        // package: nonce + tag + ciphertext
        var package = new byte[nonce.Length + tag.Length + ciphertext.Length];
        Buffer.BlockCopy(nonce, 0, package, 0, nonce.Length);
        Buffer.BlockCopy(tag, 0, package, nonce.Length, tag.Length);
        Buffer.BlockCopy(ciphertext, 0, package, nonce.Length + tag.Length, ciphertext.Length);

        return Convert.ToBase64String(package);
    }

    public byte[] DecryptFromBase64(string base64Package)
    {
        var package = Convert.FromBase64String(base64Package);
        // validate length
        var nonce = new byte[NonceSize];
        var tag = new byte[TagSize];
        var ciphertext = new byte[package.Length - NonceSize - TagSize];

        Buffer.BlockCopy(package, 0, nonce, 0, NonceSize);
        Buffer.BlockCopy(package, NonceSize, tag, 0, TagSize);
        Buffer.BlockCopy(package, NonceSize + TagSize, ciphertext, 0, ciphertext.Length);

        var plaintext = new byte[ciphertext.Length];
        using var aes = new AesGcm(_key);
        aes.Decrypt(nonce, ciphertext, tag, plaintext);

        return plaintext;
    }
}
```

### Key generation
- `RandomNumberGenerator.Fill(_key)` creates a cryptographically secure random key of 256 bits (32 bytes).
- This key is stored in the `_key` field for the lifetime of the service (Singleton), so encryption and decryption use the same key.
- **Production advice:** store keys in a secure secret store (Azure Key Vault, AWS KMS, HashiCorp Vault, or OS key store). Rotate keys periodically and avoid keeping plaintext keys in process memory unless necessary and protected.

### Nonce (IV) and Tag
- `NonceSize = 12` bytes (96-bit) — recommended size for AES‑GCM.
- `TagSize = 16` bytes (128-bit) — authentication tag length produced by AES‑GCM.
- For each encryption you MUST use a fresh, unpredictable nonce. The sample uses `RandomNumberGenerator.Fill(nonce)` for that purpose.

### Package format used by the sample
- Concatenate: `nonce (12) || tag (16) || ciphertext (variable)`
- Then base64-encode the whole package for transport/storage.

---

## Step 3 — Controller endpoints (step-by-step flow)

Controller code (core parts):
```csharp
[ApiController]
[Route("api/[controller]")]
public class CryptoController : ControllerBase
{
    private readonly AesGcmService _service;
    public CryptoController(AesGcmService service)
    {
        _service = service;
    }

    [HttpGet("key")]
    public ActionResult<string> GetKeyBase64()
    {
        var key = Convert.ToBase64String(_service.GetKey());
        return key;
    }

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
```

### Endpoint flow — `GET api/crypto/key`
1. Client sends GET request to `api/crypto/key`.
2. ASP.NET Core routes request to `CryptoController.GetKeyBase64`.
3. Controller calls `_service.GetKey()` which returns a clone of the key bytes.
4. Controller converts the key bytes to Base64 and returns as response body.
- **Demo only:** do NOT expose keys in real APIs. This endpoint is for demonstration only.

### Endpoint flow — `POST api/crypto/encrypt`
1. Client sends POST JSON like: `{ "plain": "hello" }` to `api/crypto/encrypt`.
2. Model binding maps JSON to `PlainRequest` object.
3. Controller converts string to bytes and calls `_service.EncryptToBase64(plaintextBytes)`.
4. Service: generate nonce, call `AesGcm.Encrypt`, package nonce+tag+ciphertext, base64 encode and return string.
5. Controller returns the base64 string in response body.

### Endpoint flow — `POST api/crypto/decrypt`
1. Client sends POST JSON like: `{ "base64Package": "BASE64STRING" }`.
2. Model binding maps JSON to `EncryptedRequest` object.
3. Controller calls `_service.DecryptFromBase64(base64String)`.
4. Service decodes base64, extracts nonce, tag and ciphertext, constructs plaintext buffer, calls `AesGcm.Decrypt`.
   - If authentication fails (wrong tag or tampered ciphertext), `AesGcm` throws `CryptographicException` and we return `BadRequest`.
5. Controller returns the plaintext string.

---

## Step 4 — Example CURL requests

**Encrypt:**
```bash
curl -X POST http://localhost:5000/api/crypto/encrypt \
  -H "Content-Type: application/json" \
  -d '{"plain":"Hello world"}'
# returns a base64 string like: "AAE..."
```

**Decrypt:**
```bash
curl -X POST http://localhost:5000/api/crypto/decrypt \
  -H "Content-Type: application/json" \
  -d '{"base64Package":"<PASTE_BASE64_HERE>"}'
# returns: Hello world
```

**Get key (demo only):**
```bash
curl http://localhost:5000/api/crypto/key
# returns base64 key (do NOT expose in production)
```

---

## Step 5 — Security notes & best practices

- **Never expose encryption keys** via API endpoints in production. The sample `GET /key` is for demonstration only.
- **Use secure key storage**: Azure Key Vault, AWS KMS, HashiCorp Vault, or a hardware security module (HSM).
- **Key rotation**: plan for key rotation. Design a way to re-encrypt stored data when keys change, or use envelope encryption (data encrypted with a data key that is itself encrypted with a master key).
- **Unique nonces**: never reuse a nonce (IV) with the same key. Reusing a nonce in AES‑GCM is catastrophic for security. Use cryptographically random nonces or a counter that is never repeated for the same key.
- **Tag length**: 16 bytes (128 bits) is recommended; lower sizes reduce security.
- **Authenticated encryption**: always verify the tag on decrypt — `AesGcm.Decrypt` does this and throws on failure.
- **Transport security**: always use HTTPS for any transport of ciphertexts and keys; do not send sensitive material over HTTP.
- **Replay protection**: authenticated ciphertexts can still be replayed; include replay protections (timestamps, nonces checked server-side, sequence numbers) in protocols where that matters.
- **Limit key exposure in memory**: avoid logging keys and consider using secure memory if needed for high-security systems.

---

## Step 6 — Example: Using an interface (recommended for testing)
```csharp
public interface IAesGcmService
{
    string EncryptToBase64(byte[] plaintext);
    byte[] DecryptFromBase64(string base64Package);
    byte[] GetKey();
}

public class AesGcmService : IAesGcmService { ... }

// registration
builder.Services.AddSingleton<IAesGcmService, AesGcmService>();
// controller: inject IAesGcmService (better for unit testing)
public CryptoController(IAesGcmService service) { ... }
```

---

## Appendix — FAQ

**Q: Why package `nonce||tag||ciphertext` (nonce first)?**  
A: It's convenient to keep metadata and ciphertext together. On decrypt you know the nonce and tag sizes and can split the bytes deterministically.

**Q: Can I use other nonce sizes?**  
A: AES‑GCM supports other nonce lengths but 96‑bit (12 bytes) is the recommended size and fastest in many implementations. If you use other sizes, the library may internally derive a counter block (GHASH) — stick to 12 bytes unless you have a strong reason.

**Q: Is AES‑GCM safe?**  
A: When used correctly (unique nonces, strong keys, correct tag verification, secure key storage), AES‑GCM is a safe authenticated encryption mode widely used in TLS, disk encryption, and many protocols.

---

## Useful Links (for later reading)
- Microsoft docs: `System.Security.Cryptography.AesGcm`
- OWASP Crypto Cheat Sheet
- Azure Key Vault documentation
- NIST SP 800‑38D (Galois/Counter Mode)

---

## License / Notes
This file is educational/demo material. Do not use the demo key exposure endpoint in production. Review cryptographic best practices and compliance when deploying encryption into production.
