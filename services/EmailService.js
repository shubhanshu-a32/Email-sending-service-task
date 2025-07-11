const ProviderA = require("./providers/MockProviderA");
const ProviderB = require("./providers/MockProviderB");
const { isRateLimited } = require("../utils/rateLimiter");
const { log } = require("../utils/logger");
const crypto = require("crypto");

const MAX_RETRIES = 3;
const BACKOFF = 300;
const MAX_FAILURES = 3;
const COOLDOWN = 30_000; //30 seconds

const sent = new Set();
const status = {};
const circuit = { A: { fail: 0, open: 0 }, B: { fail: 0, open: 0 } };

const hashEmail = ({ to, subject, body, requestId }) =>
  crypto
    .createHash("sha256")
    .update(to + subject + body + requestId)
    .digest("hex");

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

async function tryProvider(key, provider, email) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await provider.sendEmail(email);
      circuit[key] = { fail: 0, open: 0 };
      return { success: true, provider: key, attempts: i + 1 };
    } catch {
      log(`${key} retry ${i + 1} failed`);
      await wait(BACKOFF * 2 ** i);
    }
  }
  circuit[key].fail++;
  if (circuit[key].fail >= MAX_FAILURES) {
    circuit[key].open = Date.now() + COOLDOWN;
    log(`[CircuitBreaker] ${key} paused for ${COOLDOWN / 1000}s`);
  }
  return { success: false, provider: key };
}

function isOpen(key) {
  return Date.now() < circuit[key].open;
}

async function sendEmail(email) {
  const id = email.requestId;
  const hash = hashEmail(email);
  const userId = email.userId || email.to;

  if (sent.has(hash)) return { status: "duplicate" };
  if (isRateLimited(userId)) return { status: "Rate_limited" };

  let res = !isOpen("A") ? await tryProvider("A", ProviderA, email) : null;
  if (!res?.success && !isOpen("B"))
    res = await tryProvider("B", ProviderB, email);
  if (!res?.success) return { status: "failed" };

  sent.add(hash);
  status[id] = { status: "sent", provider: res.provider, at: Date.now() };
  return { status: "sent", provider: res.provider };
}

const getStatus = (id) => status[id] || { status: "unknown" };

module.exports = { sendEmail, getStatus };
