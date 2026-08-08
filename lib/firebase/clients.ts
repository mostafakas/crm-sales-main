import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./config";
import { sanitizeForFirestore } from "./sanitize";
import type { Client } from "@/lib/types/client";

const CLIENTS_COLLECTION = "clients";

export async function getClients(): Promise<Client[]> {
  const q = query(collection(db, CLIENTS_COLLECTION), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const clients: Client[] = [];
  querySnapshot.forEach((doc) => {
    clients.push({ id: doc.id, ...doc.data() } as Client);
  });
  return clients;
}

export async function saveClient(client: Omit<Client, "id"> & { id?: string }): Promise<Client> {
  const isNew = !client.id;
  const id = client.id || crypto.randomUUID();
  /* On edit, always keep the original createdAt. The caller is expected to
   * pass it through (see client-form-modal.tsx), but this guards against
   * that value ever being an explicit `undefined` reaching Firestore
   * (which used to make every single client edit fail). */
  const createdAt = isNew ? new Date().toISOString() : client.createdAt ?? new Date().toISOString();
  const clientData = {
    ...client,
    id,
    createdAt,
  };

  await setDoc(doc(db, CLIENTS_COLLECTION, id), sanitizeForFirestore(clientData));
  return clientData as Client;
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, CLIENTS_COLLECTION, id));
}
