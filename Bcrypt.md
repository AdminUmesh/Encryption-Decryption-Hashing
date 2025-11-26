# Bcrypt Hashing

## Step 1: — Install BCrypt Package
dotnet add package `BCrypt.Net-Next`

## Step 2: — Hash Password During Registration
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
- Recommended work factor = 10–12.
- Always use HTTPS.

#### What is Salt
Salt is a random string of bytes added to the password before hashing.

**Why do we use Salt?**
- To make every hash unique, even if two users have the same password
- To protect from rainbow table attacks (pre-computed hash databases)

**Example:**
|User|	Password|	Salt|	Result Hash|
|---|-----------|-----|------------|
|A	| 123456	| abc123 |	hgd67agf8....|
|B	| 123456	| xy6z99 |	oopl8jha....|

➡️ Same password, but different hash because salt is different.

####  What is Work Factor (Cost Factor)?
WorkFactor (also called Cost) controls how slow BCrypt hashing will run.

**Why add slowness on purpose?**
- To slow down attackers
- Increasing time makes brute-force attacks extremely expensive

**How it works**
WorkFactor = number of rounds of internal calculations (2^cost)
- `Cost=10` → `2¹⁰` = `1024 rounds`
- `Cost=12` → `2¹²` = `4096 rounds`