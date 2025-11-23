AES-GCM Demo (Backend .NET 8 + Frontend Angular 19)

Structure:
- backend/   -> .NET 8 Web API (AesGcm demo)
- frontend/  -> Minimal Angular 19 app (calls backend)

Steps to run:
1. Run backend:
   cd backend
   dotnet run
2. Run frontend (in separate terminal):
   cd frontend
   npm install
   npm start
3. Open http://localhost:4200 (Angular) and use the UI to encrypt/decrypt.

Security note: This demo keeps a random key in memory and exposes it via /api/crypto/key for demonstration only. DO NOT expose keys in real apps.
