using System;
using System.Security.Cryptography;

namespace Secure_API.Services
{
    public class AesGcmService
    {
        public const int KeySize = 32; // 256-bit
        public const int NonceSize = 12;
        public const int TagSize = 16;

        private readonly byte[] _key;

        // For demo we generate and keep a key in memory.
        // In production store key securely (Key Vault / environment / keystore).
        public AesGcmService()
        {
            _key = new byte[KeySize];
            RandomNumberGenerator.Fill(_key);
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

            var package = new byte[nonce.Length + tag.Length + ciphertext.Length];
            Buffer.BlockCopy(nonce, 0, package, 0, nonce.Length);
            Buffer.BlockCopy(tag, 0, package, nonce.Length, tag.Length);
            Buffer.BlockCopy(ciphertext, 0, package, nonce.Length + tag.Length, ciphertext.Length);

            return Convert.ToBase64String(package);
        }

        public byte[] DecryptFromBase64(string base64Package)
        {
            var package = Convert.FromBase64String(base64Package);
            if (package.Length < NonceSize + TagSize)
                throw new ArgumentException("Invalid package length");

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
}
