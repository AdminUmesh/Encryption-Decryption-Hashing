namespace Secure_API.Services
{
    using Secure_API.Models;

    public class InMemoryBcryptService : IBcryptService
    {
        private readonly List<User> _users = new();

        public User? GetByUserName(string username) =>
            _users.FirstOrDefault(u => u.UserName.Equals(username, StringComparison.OrdinalIgnoreCase));

        public User Create(string username, string password)
        {
            if (GetByUserName(username) != null)
                throw new InvalidOperationException("User already exists");

            // Choose work factor (cost). 10-12 is common. Higher = slower but more secure.
            var workFactor = 12;
            var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor);

            var user = new User { UserName = username, PasswordHash = hash };
            _users.Add(user);
            return user;
        }

        public bool ValidateCredentials(string username, string password, out User? user)
        {
            user = GetByUserName(username);
            if (user == null) return false;

            // Verify will return false if wrong password or hash mismatch.
            return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        }
    }
}
