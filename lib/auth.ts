import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const COOKIE_NAME = "delina_admin_session";
const COOKIE_VALUE = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export { COOKIE_NAME, COOKIE_VALUE };
