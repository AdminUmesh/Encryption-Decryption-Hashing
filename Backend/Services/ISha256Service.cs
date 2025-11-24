using Secure_API.Models;
using Secure_API.Models;

namespace Secure_API.Services
{
    public interface ISha256Service
    {
        User? GetByUserName(string username);
        User Create(string username, string password);
        bool ValidateCredentials(string username, string password, out User? user);
    }
}
