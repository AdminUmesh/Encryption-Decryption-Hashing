# MD5 Hashing
No required packages like Bcrypt.

**Important Notes About MD5**
|Topic	| Explanation |
|------ |------------ |
| MD5 is weak & broken|	MD5 is fast and easy to brute-force |
| Never use MD5 for real password storage |	Used only for legacy systems or learning purposes |
| No Salt built-in | Unlike BCrypt, MD5 needs salt to make hashes unique |
| Vulnerable to rainbow table attacks |	Hackers can reverse weak MD5 hashes using database lookups |

**Example Weakness**
Two users with same password produce same MD5 hash:

| User |	Password |	MD5 Hash |
|-----| -------------| ----------|
| A |	123456 |	E10ADC3949BA59ABBE56E057F20F883E |
| B |	123456 |	E10ADC3949BA59ABBE56E057F20F883E |

➡️ Attackers instantly know they used the same password.