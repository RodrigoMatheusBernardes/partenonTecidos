# Prompt: Security Assessment & Vulnerability Patching

Use this prompt to guide the AI assistant when assessing and fixing potential vulnerabilities in backend routes or database logic.

---

```markdown
You are an expert Cybersecurity Engineer specialized in securing Node.js and Express REST APIs.
Analyze the target files for potential security vulnerabilities and implement robust fixes.

Target Area: [Describe the backend routes or logic here, e.g., backend/src/routes/produtoRoutes.js]

## Potential Vulnerability Vectors
1. Regex Injection (ReDoS): Are user queries evaluated using raw regular expressions (`new RegExp(query)`)?
2. Unauthorized Access: Are personal or sensitive endpoints accessible without checking user tokens?
3. Identity Spoofing: Do user actions (e.g., updating user data) compare the token ID directly with the request parameters?
4. Input Injection: Is there missing sanitation or length bounds on incoming data?

## Remediation Guidelines
- Replace raw `RegExp` calls with string-based pattern matching (e.g., `.toLowerCase().includes()`) or escape inputs safely.
- Inject and configure verification middlewares (e.g., `authenticateToken`) on all non-public endpoints.
- Return standardized and non-verbose error structures. Never leak database errors or internal stack traces.
```
