# Bcrypt Hashing

## Step 1: — Install BCrypt Package
dotnet add package `BCrypt.Net-Next`

## Step 2: — Hash Password During Registratio
```c#
var workFactor = 12; // cost (recommended 10–12)
var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor);

// save hash in DB
user.PasswordHash = hash;
```

## Step 3: - Verify Password During Login
```c#
bool isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

if (!isValid)
    return Unauthorized("Invalid credentials");
```

## Angular (Frontend)

- Send username + password normally:

```ts
this.http.post('/api/bcrypt/login', {
  userName: this.userName,
  password: this.password
});
```
- No hashing is done on Angular side.
- BCrypt hashing is always done on the server.

**Important Notes**

- BCrypt automatically generates salt (no need to manage manually).
- BCrypt is slow on purpose → protects from brute-force attacks.
- Do not store plaintext passwords.
- Recommended work factor = 10–12.
- Always use HTTPS.