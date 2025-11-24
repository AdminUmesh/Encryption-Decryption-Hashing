namespace Secure_API.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserName { get; set; } = "";
        public string PasswordHash { get; set; } = ""; // store only hashed password
    }
}
