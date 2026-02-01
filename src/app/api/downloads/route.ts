import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebaseAdmin";

const DOC_PATH = "counters/downloads";

function isAdminConfigured() {
  return Boolean(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);
}

export async function GET() {
  // During local build (or if env not set), don't fail the build
  if (!isAdminConfigured()) {
    return NextResponse.json({ count: 0, disabled: true });
  }

  const adminDb = getAdminDb();
  const ref = adminDb.doc(DOC_PATH);
  const snap = await ref.get();

  const count = snap.exists ? Number(snap.data()?.count ?? 0) : 0;
  return NextResponse.json({ count });
}

export async function POST(req: Request) {
  // During local build (or if env not set), don't fail the build
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: false, disabled: true, count: 0 }, { status: 200 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    lang?: "en" | "ur";
    file?: string;
  };

  const adminDb = getAdminDb();
  const ref = adminDb.doc(DOC_PATH);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      tx.set(ref, { count: 1, updatedAt: FieldValue.serverTimestamp() });
    } else {
      tx.update(ref, {
        count: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  });

  const snap2 = await ref.get();
  const count = snap2.exists ? Number(snap2.data()?.count ?? 0) : 0;

  return NextResponse.json({ count, meta: { lang: body.lang ?? null, file: body.file ?? null } });
}
