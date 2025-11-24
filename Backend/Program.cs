
using Secure_API.Services;

namespace Secure_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSingleton<Secure_API.Services.AesGcmService>(); //For AES-GCM Encryption
            builder.Services.AddSingleton<IBcryptService, InMemoryBcryptService>(); //For Bcrypt Hashing
            builder.Services.AddSingleton<IMd5Service, InMemoryIMd5Service>(); //For MD5 Hashing
            builder.Services.AddSingleton<ISha256Service, InMemorySha256Service>(); //For SHA-256 Hashing

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
            });
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(); // shows detailed errors in dev
                app.UseSwagger();
                app.UseSwaggerUI();
            }


            app.UseCors();
            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
