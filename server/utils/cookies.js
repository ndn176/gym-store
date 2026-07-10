const isProd = process.env.NODE_ENV === 'production';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const baseOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProd,
  path: '/',
};

export function setAuthCookie(res, name, token) {
  res.cookie(name, token, { ...baseOptions, maxAge: SEVEN_DAYS_MS });
}

export function clearAuthCookie(res, name) {
  res.clearCookie(name, baseOptions);
}
