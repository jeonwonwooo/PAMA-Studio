const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

export function rateLimit(ip: string): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(ip, { count: 1, resetAt });
    return { success: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  rateLimitStore.set(ip, record);
  return { success: true, remaining: MAX_REQUESTS - record.count, resetAt: record.resetAt };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}