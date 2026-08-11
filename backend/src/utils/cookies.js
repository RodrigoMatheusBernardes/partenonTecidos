function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getCookieBaseOptions(overrides = {}) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'none' : 'lax',
    path: '/',
    ...overrides,
  };
}

function getAccessTokenCookieName() {
  return process.env.ACCESS_COOKIE_NAME || 'parthenon_at';
}

function getRefreshTokenCookieName() {
  return process.env.REFRESH_COOKIE_NAME || 'parthenon_rt';
}

function getAccessTokenMaxAgeMs() {
  return Number.parseInt(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE_MS || `${15 * 60 * 1000}`, 10);
}

function getRefreshTokenMaxAgeMs() {
  return Number.parseInt(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS || `${7 * 24 * 60 * 60 * 1000}`, 10);
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  if (accessToken) {
    res.cookie(getAccessTokenCookieName(), accessToken, getCookieBaseOptions({ maxAge: getAccessTokenMaxAgeMs() }));
  }
  if (refreshToken) {
    res.cookie(getRefreshTokenCookieName(), refreshToken, getCookieBaseOptions({ maxAge: getRefreshTokenMaxAgeMs() }));
  }
}

function clearAuthCookies(res) {
  res.clearCookie(getAccessTokenCookieName(), getCookieBaseOptions());
  res.clearCookie(getRefreshTokenCookieName(), getCookieBaseOptions());
}

module.exports = {
  clearAuthCookies,
  getAccessTokenCookieName,
  getRefreshTokenCookieName,
  getRefreshTokenMaxAgeMs,
  setAuthCookies,
};