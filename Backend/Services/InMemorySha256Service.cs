using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Secure_API.Models;

namespace Secure_API.Services
{
    public class InMemorySha256Service : ISha256Service
    {
        private readonly List<User> _users = new();

        public User? GetByUserName(string username) =>
            _users.FirstOrDefault(u =>
                u.UserName.Equals(username, StringComparison.OrdinalIgnoreCase));

        public User Create(string username, string password)
        {
            if (GetByUserName(username) != null)
                throw new InvalidOperationException("User already exists");

            // Generate salt
            var salt = RandomNumberGenerator.GetBytes(16); // 128-bit salt
            var hash = ComputeSha256(password, salt);

            // Store as: salt:hash
            string storedValue =
                $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";

            var user = new User
            {
                UserName = username,
                PasswordHash = storedValue
            };

            _users.Add(user);
            return user;
        }

        public bool ValidateCredentials(string username, string password, out User? user)
        {
            user = GetByUserName(username);
            if (user == null) return false;

            var parts = user.PasswordHash.Split(':');
            if (parts.Length != 2) return false;

            var salt = Convert.FromBase64String(parts[0]);
            var expectedHash = Convert.FromBase64String(parts[1]);

            var actualHash = ComputeSha256(password, salt);

            return CryptographicOperations.FixedTimeEquals(expectedHash, actualHash);
        }

        private static byte[] ComputeSha256(string password, byte[] salt)
        {
            var pwBytes = Encoding.UTF8.GetBytes(password);
            var combined = new byte[salt.Length + pwBytes.Length];

            Buffer.BlockCopy(salt, 0, combined, 0, salt.Length);
            Buffer.BlockCopy(pwBytes, 0, combined, salt.Length, pwBytes.Length);

            using var sha = SHA256.Create();
            return sha.ComputeHash(combined);
        }
    }
}
