# AES-GCM Encryption

#### What is AES-GCM?

AES-GCM (Advanced Encryption Standard – Galois/Counter Mode) is a symmetric encryption algorithm that provides:
- Confidentiality (encrypts data)
- Integrity & authenticity (using authentication TAG)
- Fast & secure (widely used in HTTPS, TLS, VPN, JWT, etc.)

#### Key Concepts

| Term | Meaning |
|------|---------|
| **AES** | Symmetric encryption algorithm (same key used for encrypt & decrypt) |
| **GCM Mode** | Galois/Counter Mode — provides authenticated encryption (protects confidentiality + integrity) |
| **Key** | Secret key used for encryption & decryption (commonly 256-bit = 32 bytes) |
| **Nonce / IV** | Random unique bytes required for each encryption — must not repeat |
| **TAG** | Authentication tag that verifies ciphertext integrity and prevents tampering |

#### How AES-GCM Works (Step-by-Step)
1. Generate a secure random key
2. Convert plain text to bytes
3. Generate a random nonce (IV)
4. Call AesGcm.Encrypt() → returns ciphertext + tag
5. On decrypt, use same key and nonce to restore text
6. If data was modified → decryption fails automatically

#### .NET (C#) Example
**Encrypt**
```c#
using var aes = new AesGcm(key);
aes.Encrypt(nonce, plaintextBytes, ciphertext, tag);

var package = nonce + tag + ciphertext; // send as Base64
```

**Decrypt**
```c#
using var aes = new AesGcm(key);
aes.Decrypt(nonce, ciphertext, tag, resultPlaintextBytes);
```

#### Request / Response Flow (API Demo)
**Encrypt API**
```bash
POST /api/crypto/encrypt
{ "plain": "Hello AES!" }

Response:
"BASE64_packaged_nonce|tag|ciphertext"
```

**Decrypt API**
```bash
POST /api/crypto/decrypt
{ "base64Package": "<encrypted value>" }

Response:
"Hello AES!"
```

#### Important Notes
- Never reuse nonce with the same key → breaks security
- Always use HTTPS to protect encrypted data & key
- Do not send encryption key in API response (sample only)
- AES-256-GCM = 32-byte key + 12-byte nonce + 16-byte tag
- Used in TLS/HTTPS, Signal, WhatsApp, WireGuard, SSH

### Example Use Cases

- Encrypting sensitive data (PAN, Aadhaar, personal details)
- Secure message transfer
- Database field-level encryption