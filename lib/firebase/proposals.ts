import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./config";
import type { StoredProposal } from "@/lib/types/proposal";
import { cleanUndefined } from "@/lib/utils";

const PROPOSALS_COLLECTION = "proposals";

export async function getProposals(): Promise<StoredProposal[]> {
  const q = query(collection(db, PROPOSALS_COLLECTION), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const proposals: StoredProposal[] = [];
  querySnapshot.forEach((doc) => {
    proposals.push({ id: doc.id, ...doc.data() } as StoredProposal);
  });
  return proposals;
}

export async function saveFirebaseProposal(proposal: StoredProposal): Promise<StoredProposal> {
  const cleanProposal = cleanUndefined(proposal);
  await setDoc(doc(db, PROPOSALS_COLLECTION, proposal.id), cleanProposal);
  return proposal;
}

export async function deleteFirebaseProposal(id: string): Promise<void> {
  await deleteDoc(doc(db, PROPOSALS_COLLECTION, id));
}
