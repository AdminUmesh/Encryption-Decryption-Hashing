using Secure_API.Models;

namespace Secure_API.Services
{
    public interface IBcryptService
    {
        User? GetByUserName(string username);
        User Create(string username, string password); // returns created user
        bool ValidateCredentials(string username, string password, out User? user);
    }
}
