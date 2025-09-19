export function setAccessTokenCookie(token: string) {
  const maxAge = 60 * 60 * 24 * 7; // 7 días
  document.cookie = `accessToken=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

export function clearAccessTokenCookie() {
  document.cookie = `accessToken=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
}
