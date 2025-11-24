using Microsoft.AspNetCore.Mvc;
using Secure_API.Models;
using System.Security.Cryptography;
using System.Text;

namespace Secure_API.Services
{
    public class InMemoryIMd5Service : IMd5Service
    {
        private readonly List<User> _users = new();

        public User? GetByUserName(string username) =>
            _users.FirstOrDefault(u => u.UserName.Equals(username, StringComparison.OrdinalIgnoreCase));

        public User Create(string username, string password)
        {
            if (GetByUserName(username) != null)
                throw new InvalidOperationException("User already exists");

            var hash = HashPasswordMD5(password);

            var user = new User
            {
                UserName = username,
                PasswordHash = hash
            };

            _users.Add(user);
            return user;
        }

        public bool ValidateCredentials(string username, string password, out User? user)
        {
            user = GetByUserName(username);
            if (user == null) return false;

            var hash = HashPasswordMD5(password);
            return user.PasswordHash == hash;
        }

        private static string HashPasswordMD5(string input)
        {
            using var md5 = MD5.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hashBytes = md5.ComputeHash(bytes);
            return Convert.ToHexString(hashBytes);   // produces uppercase hex (e.g., "E10ADC3949BA59AB...")
        }
    }
}
