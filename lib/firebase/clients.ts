import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./config";
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
  const clientData = {
    ...client,
    createdAt: isNew ? new Date().toISOString() : client.createdAt,
  };
  
  await setDoc(doc(db, CLIENTS_COLLECTION, id), clientData);
  return { id, ...clientData } as Client;
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, CLIENTS_COLLECTION, id));
}
