# Password access and reset handoff

`login.html` keeps the approved Google, Microsoft and emailed-link sign-in. The quiet
“Sign in with a password” link opens a separate password route. Password support on the live
service is still an authentication decision; these screens do not replace the passwordless flow.

| Screen | States |
| --- | --- |
| `login-password.html` | Email and password, Show/Hide, Forgot your password, return to passwordless sign-in |
| `reset-password.html` | Reset request, neutral Check your email confirmation, try another email |
| `new-password.html` | New and confirm password, Show/Hide, length/mismatch errors, completion |
| `new-password.html?state=expired` | Expired/used link, request a fresh link |

These are interactive **design previews**. They make no authentication or email requests, use
no tokens, and persist no credentials or email addresses. The reset confirmation is conditional
so it never identifies whether an account exists. The preview label remains visible. The link
from Check your email to the new-password screen is explicitly labeled a preview and must not
exist in the production reset request response.

The new-password example accepts 15–128 Unicode code points, including spaces, and asks for a
matching confirmation. There are no character-composition rules or paste restrictions. This is
a proposed policy for a password flow without MFA; the authentication owner must confirm the
same policy across sign-up, sign-in and reset. Production must also check common/breached
passwords. Show/Hide controls have explicit accessible names and pressed states. Password
values are cleared after the simulated reset and when leaving the page.

## Production connection

Connect these screens to the actual authentication provider. The provider must validate expiring,
single-use reset tokens, enforce the password policy, rate-limit requests, and give equivalent
responses for existing and nonexistent accounts. Only show a success state after a confirmed
server response. Use secure password storage and HTTPS, keep credentials out of URLs/logs, and
set an appropriate no-referrer policy on token pages. Real reset links cannot be replaced by the
design-only `state` parameter. Agree session invalidation and send a reset notification without
including the password. Return the user to sign-in after a reset; do not automatically authenticate.

Reference: [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
and [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

## Review

Use synthetic credentials only. Check malformed/empty email, email confirmation and edit focus,
Show/Hide, short passwords, mismatched confirmation, successful preview with cleared password
fields, and the expired-link route. Verify desktop and narrow layouts and keyboard access.
No real password reset or email delivery is tested by this static handoff.
