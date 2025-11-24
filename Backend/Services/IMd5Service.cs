using Secure_API.Models;
namespace Secure_API.Services
{
    public interface IMd5Service
    {
        User? GetByUserName(string username);
        User Create(string username, string password);
        bool ValidateCredentials(string username, string password, out User? user);
    }
}