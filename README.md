# Alluvo – Digital Multiplex

Frontend: React (Vite) with neon theme, hover sidebar, looping slideshow, OTP login UI, loader.svg, optional opening video.
Backend: Node.js (Express) OTP via SMS (Twilio) or Email (SMTP). If not configured, OTP prints in backend logs so you can test.

Public URL (after deploy): https://alluvoservices.github.io/Alluvo-Digital-Multiplex/

Quick steps:
1) Upload assets into client/public:
   - logo.jpg (your logo)
   - loader.svg (loading animation)
   - opening.mp4 (optional opening video)
2) Commit & Push (Source Control panel).
3) Deploy backend on Render (root: server). Set env vars:
   - CORS_ORIGIN = https://alluvoservices.github.io
   - JWT_SECRET = your-strong-secret
   - (Optional SMS) TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE
   - (Optional Email) SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_EMAIL
4) Copy the Render URL (e.g., https://your-api.onrender.com).
5) In GitHub → Repo → Settings → Secrets and variables → Actions → New secret:
   - Name: API_URL
   - Value: your Render URL
6) Ensure Settings → Pages → Build and deployment → Source = GitHub Actions.
7) The workflow builds and deploys automatically. Visit your site URL above.

