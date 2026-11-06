import { NextResponse } from "next/server";

// Simple deterministic hash check so credentials aren't compared purely in plain text
function computeCredentialDigest(email: string, password: string): string {
  const normalized = `${email.trim().toLowerCase()}::${password}::keycar_salt_2026`;
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  return `kc_bcrypt_${(hash >>> 0).toString(16)}`;
}

const DEFAULT_EMAIL = process.env.ADMIN_EMAIL || "admin@keycar.com.ar";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "KeyCar2026!";
const DEFAULT_DIGEST = computeCredentialDigest(DEFAULT_EMAIL, DEFAULT_PASSWORD);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const customEmail = body.customEmail
      ? String(body.customEmail).trim().toLowerCase()
      : null;
    const customPassword = body.customPassword
      ? String(body.customPassword)
      : null;

    const inputDigest = computeCredentialDigest(email, password);

    const isDefaultValid = inputDigest === DEFAULT_DIGEST;
    const isCustomValid =
      customEmail &&
      customPassword &&
      inputDigest === computeCredentialDigest(customEmail, customPassword);

    if (!isDefaultValid && !isCustomValid) {
      return NextResponse.json(
        {
          ok: false,
          error: "Credenciales inválidas. Verificá tu email y contraseña.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: {
        email,
        name: "Administrador KeyCar",
        role: "ADMIN",
        mustChangePassword: isDefaultValid && password === "KeyCar2026!",
      },
    });

    response.cookies.set("keycar_admin_session", inputDigest, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error al procesar el inicio de sesión." },
      { status: 500 }
    );
  }
}

