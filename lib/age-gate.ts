
import { createHmac, timingSafeEqual } from "node:crypto";

const getSignature = () => {
  const secret = process.env.AGE_GATE_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AGE_GATE_SECRET must be at least 32 characters.");
  }

  return createHmac("sha256", secret)
    .update("serafine-age-confirmed-18")
    .digest("hex");
};

export function signAgeCookie() {
  return getSignature();
}

export function verifyAgeCookie(value?: string) {
  if (!value) return false;

  const expected = Buffer.from(getSignature());
  const actual = Buffer.from(value);

  if (actual.length !== expected.length) return false;

  return timingSafeEqual(actual, expected);
}
