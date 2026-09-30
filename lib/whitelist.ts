/**
 * Whitelist emailov, ki lahko dostopajo do admin panela.
 * Vsak drug Google račun bo zavrnjen tudi če ima veljavno prijavo.
 */
export const ADMIN_EMAILS = [
  'ujete.bedarije@gmail.com',    // Ujete Bedarije (glavni admin — business email)
  'claudinka33@gmail.com',       // Claudia (admin)
  'szekar14@gmail.com',          // Anita (staff)
  'stanislavzekar@gmail.com',    // Stane (staff)
] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase());
}
