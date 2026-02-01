import { NextResponse } from "next/server";

// Cloudflare Turnstile verification
// Env:
//  - TURNSTILE_SECRET_KEY (server-side)
//  - NEXT_PUBLIC_TURNSTILE_SITE_KEY (client-side)

export async function POST(req: Request) {
  try {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      // If not configured (e.g., local dev), don't block downloads.
      return NextResponse.json({ success: true, skipped: true });
    }

    const { token } = (await req.json()) as { token?: string };
    if (!token) {
      return NextResponse.json(
        { success: false, error: "missing-token" },
        { status: 400 }
      );
    }

    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);

    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: form,
      }
    );

    const data = (await verify.json()) as {
      success?: boolean;
      [k: string]: unknown;
    };
    return NextResponse.json({ success: Boolean(data?.success), data });
  } catch {
    return NextResponse.json(
      { success: false, error: "server-error" },
      { status: 500 }
    );
  }
}
