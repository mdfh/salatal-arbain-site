import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function parseServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Missing FIREBASE_ADMIN_SERVICE_ACCOUNT");

  const sa = JSON.parse(raw) as ServiceAccount;

  return {
    project_id: sa.project_id,
    client_email: sa.client_email,
    private_key: sa.private_key.replace(/\\n/g, "\n"),
  };
}

export function getAdminDb() {
  const sa = parseServiceAccount();

  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId: sa.project_id,
            clientEmail: sa.client_email,
            privateKey: sa.private_key,
          }),
        });

  return getFirestore(app);
}
