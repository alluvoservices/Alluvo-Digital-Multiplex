import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import twilio from "twilio";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Multi-origin CORS (dev + GitHub Pages)
const ORIGIN = process.env.CORS_ORIGIN || "*";
const whitelist = ORIGIN.split(",").map(o => o.trim());
app.use(cors({
  origin(origin, cb) {
    if (!origin || whitelist.includes("*") || whitelist.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));

app.use(express.json());

// OTP store (in memory; use Redis/DB for production)
const otpStore = new Map(); // key -> { code, expiresAt }
const OTP_TTL_MS = 5 * 60 * 1000;

// Rate limit for request-otp
const limiter = rateLimit({ windowMs: 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
app.use("/api/auth/request-otp", limiter);

// Optional SMS + Email clients
let smsClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

let mailer = null;
if (process.env.SMTP_HOST) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

const makeOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const keyFor = ({ phone, email }) => phone?.trim() || email?.trim()?.toLowerCase() || null;

async function sendOtp({ phone, email, code }) {
  if (phone) {
    if (smsClient && process.env.TWILIO_PHONE) {
      await smsClient.messages.create({
        to: phone,
        from: process.env.TWILIO_PHONE,
        body: `Your Alluvo login code is ${code}. It expires in 5 minutes.`
      });
      return { via: "sms" };
    } else {
      console.log("[DEV SMS OTP]", phone, code);
      return { via: "sms-dev" };
    }
  }
  if (email) {
    if (mailer) {
      await mailer.sendMail({
        to: email,
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        subject: "Alluvo OTP",
        text: `Your Alluvo login code is ${code}. It expires in 5 minutes.`,
        html: `<p>Your Alluvo login code is <b>${code}</b>. It expires in 5 minutes.</p>`
      });
      return { via: "email" };
    } else {
      console.log("[DEV EMAIL OTP]", email, code);
      return { via: "email-dev" };
    }
  }
  throw new Error("No phone or email provided");
}

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/auth/request-otp", async (req, res) => {
  const phone = req.body.phone?.trim();
  const email = req.body.email?.trim()?.toLowerCase();
  if (!phone && !email) return res.status(400).json({ error: "Provide phone or email" });

  const key = keyFor({ phone, email });
  const code = makeOTP();
  otpStore.set(key, { code, expiresAt: Date.now() + OTP_TTL_MS });
  setTimeout(() => otpStore.delete(key), OTP_TTL_MS + 1000);

  try {
    const info = await sendOtp({ phone, email, code });
    res.json({ sent: true, via: info.via });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/api/auth/verify-otp", (req, res) => {
  const phone = req.body.phone?.trim();
  const email = req.body.email?.trim()?.toLowerCase();
  const code = String(req.body.code || "");
  const key = keyFor({ phone, email });

  if (!key || !code) return res.status(400).json({ error: "Missing data" });

  const record = otpStore.get(key);
  if (!record) return res.status(400).json({ error: "OTP not found or expired" });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return res.status(400).json({ error: "OTP expired" });
  }
  if (record.code !== code) return res.status(400).json({ error: "Invalid code" });

  otpStore.delete(key);
  const user = { id: key };
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

// Example content
app.get("/api/content/home", (_, res) => {
  res.json({
    hero: [
      {
        id: "1",
        title: "Little Hearts",
        tag: "UA13+ | Comedy, Romance",
        cta: "Book now",
        image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1400&q=80&auto=format",
        poster: "https://images.unsplash.com/photo-1542206395-9feb3edaa68f?w=900&q=80&auto=format"
      },
      {
        id: "2",
        title: "Cars 3",
        tag: "U | Adventure, Family",
        cta: "Watch trailer",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1400&q=80&auto=format",
        poster: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&q=80&auto=format"
      }
    ],
    rows: [
      {
        title: "Only in Theatres",
        items: new Array(12).fill(0).map((_, i) => ({
          id: "t" + i,
          title: "Movie " + (i + 1),
          thumb: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=400&q=60&auto=format"
        }))
      },
      {
        title: "Suggested Content",
        items: new Array(12).fill(0).map((_, i) => ({
          id: "s" + i,
          title: "Show " + (i + 1),
          thumb: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&q=60&auto=format"
        }))
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
