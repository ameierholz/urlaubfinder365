import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
// db() ist eine Funktion – immer als db() aufrufen, nie als db
import {
  SavedActivity, SavedTrip, TiqetsProduct, TravelOffer, UserProfile,
  PriceAlert, TripPlan, TravelDocument, PriceTrend,
} from "@/types";

// ---- User Profile ----

export async function createUserProfile(uid: string, email: string, displayName: string | null) {
  const profile: UserProfile = {
    uid,
    email,
    displayName,
    createdAt: new Date().toISOString(),
    savedTrips: [],
    favoriteDestinations: [],
  };
  await setDoc(doc(db(), "users", uid), profile);
  // Community-Profil automatisch mitanlegen (verhindert "No document to update"-Fehler)
  await setDoc(doc(db(), "communityProfiles", uid), {
    uid,
    displayName: displayName ?? email.split("@")[0],
    visitedCountries: [],
    followersCount: 0,
    followingCount: 0,
    reportsCount: 0,
    tipsCount: 0,
    groupsCount: 0,
    createdAt: serverTimestamp(),
  }, { merge: true });
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db(), "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

// ---- Gespeicherte Reisen ----

export async function saveTrip(uid: string, offer: TravelOffer): Promise<string> {
  const tripsRef = collection(db(), "savedTrips");
  const docRef = await addDoc(tripsRef, {
    userId: uid,
    offer,
    savedAt: serverTimestamp(),
  });

  // product_code in User-Profil speichern für schnellen Check
  await updateDoc(doc(db(), "users", uid), {
    savedTrips: arrayUnion(offer.product_code),
  });

  return docRef.id;
}

export async function unsaveTrip(uid: string, tripDocId: string, productCode: string) {
  const tripRef = doc(db(), "savedTrips", tripDocId);
  await updateDoc(tripRef, { deleted: true });

  await updateDoc(doc(db(), "users", uid), {
    savedTrips: arrayRemove(productCode),
  });
}

export async function getUserSavedTrips(uid: string): Promise<SavedTrip[]> {
  const q = query(
    collection(db(), "savedTrips"),
    where("userId", "==", uid)
  );
  const snap = await getDocs(q);
  // Gelöschte Einträge serverseitig nicht gefiltert (kein Composite Index nötig),
  // Filterung erfolgt client-seitig im SavedTripsTab
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as SavedTrip))
    .filter((t) => !(t as unknown as Record<string, unknown>).deleted);
}

// ---- Favoriten-Urlaubsziele ----

export async function toggleFavoriteDestination(uid: string, slug: string, isFav: boolean) {
  await updateDoc(doc(db(), "users", uid), {
    favoriteDestinations: isFav ? arrayRemove(slug) : arrayUnion(slug),
  });
}

// ---- Reise-Präferenzen ----

export async function updateTravelPreferences(uid: string, preferences: import("@/types").TravelPreferences) {
  await updateDoc(doc(db(), "users", uid), { preferences });
}

// ---- Urlaubs-Checkliste ----

export async function updateChecklist(uid: string, checklist: import("@/types").ChecklistItem[]) {
  await updateDoc(doc(db(), "users", uid), { checklist });
}

// ---- Notizen ----

export async function updateNotes(uid: string, notes: string) {
  await updateDoc(doc(db(), "users", uid), { notes });
}

// ---- Profil aktualisieren ----

export async function updateUserProfile(uid: string, data: { displayName?: string }) {
  await updateDoc(doc(db(), "users", uid), data);
}

// ---- Gespeicherte Aktivitäten (Tiqets) ----

export async function saveActivity(uid: string, activity: TiqetsProduct): Promise<string> {
  const ref = collection(db(), "savedActivities");
  const docRef = await addDoc(ref, {
    userId: uid,
    activity,
    savedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function unsaveActivity(uid: string, activityDocId: string) {
  await updateDoc(doc(db(), "savedActivities", activityDocId), { deleted: true });
}

export async function getUserSavedActivities(uid: string): Promise<SavedActivity[]> {
  const q = query(collection(db(), "savedActivities"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as SavedActivity))
    .filter((a) => !(a as unknown as Record<string, unknown>).deleted);
}

// ── Preisalarme ──────────────────────────────────────────────────────────────

export async function createPriceAlert(
  uid: string,
  alert: Omit<PriceAlert, "id" | "userId" | "createdAt">
): Promise<string> {
  const ref = collection(db(), "priceAlerts");
  const docRef = await addDoc(ref, { ...alert, userId: uid, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getPriceAlerts(uid: string): Promise<PriceAlert[]> {
  const q = query(collection(db(), "priceAlerts"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PriceAlert));
}

export async function updatePriceAlert(
  uid: string,
  docId: string,
  updates: Partial<Omit<PriceAlert, "id" | "userId" | "createdAt">>
): Promise<void> {
  void uid;
  await updateDoc(doc(db(), "priceAlerts", docId), updates as Record<string, unknown>);
}

export async function deletePriceAlert(uid: string, docId: string): Promise<void> {
  void uid;
  await deleteDoc(doc(db(), "priceAlerts", docId));
}

// ── Urlaubspläne ────────────────────────────────────────────────────────────────

export async function createTripPlan(
  uid: string,
  plan: Omit<TripPlan, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = collection(db(), "tripPlans");
  const docRef = await addDoc(ref, {
    ...plan,
    userId: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTripPlans(uid: string): Promise<TripPlan[]> {
  const q = query(collection(db(), "tripPlans"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TripPlan));
}

export async function updateTripPlan(
  uid: string,
  docId: string,
  updates: Partial<Omit<TripPlan, "id" | "userId" | "createdAt">>
): Promise<void> {
  void uid;
  await updateDoc(doc(db(), "tripPlans", docId), {
    ...(updates as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTripPlan(uid: string, docId: string): Promise<void> {
  void uid;
  await deleteDoc(doc(db(), "tripPlans", docId));
}

// ── Reisedokumente ────────────────────────────────────────────────────────────

export async function saveTravelDocument(
  uid: string,
  document: Omit<TravelDocument, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = collection(db(), "travelDocuments");
  const docRef = await addDoc(ref, {
    ...document,
    userId: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTravelDocuments(uid: string): Promise<TravelDocument[]> {
  const q = query(collection(db(), "travelDocuments"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TravelDocument));
}

export async function updateTravelDocument(
  uid: string,
  docId: string,
  updates: Partial<Omit<TravelDocument, "id" | "userId" | "createdAt">>
): Promise<void> {
  void uid;
  await updateDoc(doc(db(), "travelDocuments", docId), {
    ...(updates as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTravelDocument(uid: string, docId: string): Promise<void> {
  void uid;
  await deleteDoc(doc(db(), "travelDocuments", docId));
}

// ── Community Reisen-Tipps (Reisenden-Karte) ────────────────────────────────

export async function getTravelTips(): Promise<import("@/types").TravelTip[]> {
  const snap = await getDocs(collection(db(), "travelTips"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as import("@/types").TravelTip))
    .filter((t) => t.status === "approved");
}

export async function addTravelTip(
  uid: string,
  tip: Omit<import("@/types").TravelTip, "id" | "userId" | "createdAt" | "status">
): Promise<string> {
  const ref = collection(db(), "travelTips");
  const docRef = await addDoc(ref, {
    ...tip,
    userId: uid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteTravelTip(uid: string, tipId: string): Promise<void> {
  void uid;
  await deleteDoc(doc(db(), "travelTips", tipId));
}

// ── Bereiste Länder (Reisenden-Karte) ────────────────────────────────────────

export async function getVisitedCountries(uid: string): Promise<string[]> {
  const snap = await getDoc(doc(db(), "visitedCountries", uid));
  if (!snap.exists()) return [];
  const data = snap.data() as { countries?: string[] };
  return data.countries ?? [];
}

export async function saveVisitedCountries(uid: string, countries: string[]): Promise<void> {
  await setDoc(doc(db(), "visitedCountries", uid), {
    countries,
    updatedAt: serverTimestamp(),
  });
}

// ── Preisverläufe (öffentlich lesbar, geschrieben nur vom Cron-Job) ──────────

/** Preistrend für eine einzelne Destination laden */
export async function getPriceTrend(slug: string): Promise<PriceTrend | null> {
  const snap = await getDoc(doc(db(), "priceTrends", slug));
  return snap.exists() ? (snap.data() as PriceTrend) : null;
}

/** Preistrends für mehrere Destinationen parallel laden */
export async function getPriceTrends(
  slugs: string[]
): Promise<Record<string, PriceTrend>> {
  const results: Record<string, PriceTrend> = {};
  await Promise.all(
    slugs.map(async (slug) => {
      const trend = await getPriceTrend(slug);
      if (trend) results[slug] = trend;
    })
  );
  return results;
}

// ══════════════════════════════════════════════════════════════════════════════
// COMMUNITY: Urlaubsberichte
// ══════════════════════════════════════════════════════════════════════════════

export async function getTravelReports(limitN = 20): Promise<import("@/types").TravelReport[]> {
  const q = query(collection(db(), "travelReports"),
    where("isPublished", "==", true), orderBy("createdAt", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import("@/types").TravelReport));
}

export async function getTravelReportsByUser(uid: string): Promise<import("@/types").TravelReport[]> {
  const q = query(collection(db(), "travelReports"),
    where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import("@/types").TravelReport));
}

export async function getTravelReport(id: string): Promise<import("@/types").TravelReport | null> {
  const snap = await getDoc(doc(db(), "travelReports", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as import("@/types").TravelReport) : null;
}

export async function createTravelReport(
  uid: string,
  data: Omit<import("@/types").TravelReport, "id" | "userId" | "createdAt" | "likesCount" | "likedBy" | "commentsCount" | "isPublished">
): Promise<string> {
  const ref = await addDoc(collection(db(), "travelReports"), {
    ...data, userId: uid, likesCount: 0, likedBy: [], commentsCount: 0,
    isPublished: false, createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTravelReport(uid: string, id: string, data: Partial<import("@/types").TravelReport>): Promise<void> {
  void uid;
  await updateDoc(doc(db(), "travelReports", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTravelReport(uid: string, id: string): Promise<void> {
  void uid;
  await deleteDoc(doc(db(), "travelReports", id));
}

export async function publishTravelReport(uid: string, id: string): Promise<void> {
  void uid;
  await updateDoc(doc(db(), "travelReports", id), { isPublished: true });
}

export async function likeTravelReport(uid: string, reportId: string, hasLiked: boolean): Promise<void> {
  const ref = doc(db(), "travelReports", reportId);
  if (hasLiked) {
    await updateDoc(ref, { likedBy: arrayRemove(uid), likesCount: (await getDoc(ref)).data()?.likesCount - 1 || 0 });
  } else {
    await updateDoc(ref, { likedBy: arrayUnion(uid), likesCount: ((await getDoc(ref)).data()?.likesCount || 0) + 1 });
  }
}

// ── Kommentare ────────────────────────────────────────────────────────────────

export async function getComments(reportId: string): Promise<import("@/types").TravelReportComment[]> {
  const q = query(collection(db(), "travelReportComments"),
    where("reportId", "==", reportId), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import("@/types").TravelReportComment));
}

export async function addComment(
  reportId: string, uid: string, displayName: string, text: string
): Promise<string> {
  const ref = await addDoc(collection(db(), "travelReportComments"), {
    reportId, userId: uid, displayName, text, createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db(), "travelReports", reportId), {
    commentsCount: (await getDoc(doc(db(), "travelReports", reportId))).data()?.commentsCount + 1 || 1,
  });
  return ref.id;
}

// ── Follower-System ───────────────────────────────────────────────────────────

export async function followUser(uid: string, targetUid: string): Promise<void> {
  await setDoc(doc(db(), "userFollows", `${uid}_${targetUid}`), {
    followerId: uid, followingId: targetUid, createdAt: serverTimestamp(),
  });
  // setDoc mit merge: true → funktioniert auch wenn Dokument noch nicht existiert
  const mySnap = await getDoc(doc(db(), "communityProfiles", uid));
  await setDoc(doc(db(), "communityProfiles", uid), {
    followingCount: (mySnap.data()?.followingCount || 0) + 1,
  }, { merge: true });
  const targetSnap = await getDoc(doc(db(), "communityProfiles", targetUid));
  await setDoc(doc(db(), "communityProfiles", targetUid), {
    followersCount: (targetSnap.data()?.followersCount || 0) + 1,
  }, { merge: true });
}

export async function unfollowUser(uid: string, targetUid: string): Promise<void> {
  await deleteDoc(doc(db(), "userFollows", `${uid}_${targetUid}`));
  const mySnap = await getDoc(doc(db(), "communityProfiles", uid));
  await setDoc(doc(db(), "communityProfiles", uid), {
    followingCount: Math.max(0, (mySnap.data()?.followingCount || 1) - 1),
  }, { merge: true });
  const targetSnap = await getDoc(doc(db(), "communityProfiles", targetUid));
  await setDoc(doc(db(), "communityProfiles", targetUid), {
    followersCount: Math.max(0, (targetSnap.data()?.followersCount || 1) - 1),
  }, { merge: true });
}

export async function isFollowing(uid: string, targetUid: string): Promise<boolean> {
  const snap = await getDoc(doc(db(), "userFollows", `${uid}_${targetUid}`));
  return snap.exists();
}

// ── Community-Profile ─────────────────────────────────────────────────────────

export async function getCommunityProfile(uid: string): Promise<import("@/types").CommunityProfile | null> {
  const snap = await getDoc(doc(db(), "communityProfiles", uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as import("@/types").CommunityProfile;
}

export async function updateCommunityProfile(
  uid: string,
  data: Partial<Omit<import("@/types").CommunityProfile, "uid">>
): Promise<void> {
  await setDoc(doc(db(), "communityProfiles", uid), data, { merge: true });
}

export async function getCommunityProfiles(limitN = 24): Promise<import("@/types").CommunityProfile[]> {
  const q = query(collection(db(), "communityProfiles"),
    orderBy("reportsCount", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as import("@/types").CommunityProfile));
}

// ══════════════════════════════════════════════════════════════════════════════
// COMMUNITY: Urlaubs-Gruppen
// ══════════════════════════════════════════════════════════════════════════════

export async function getTravelGroups(limitN = 20): Promise<import("@/types").TravelGroup[]> {
  const q = query(collection(db(), "travelGroups"),
    where("isPublic", "==", true), orderBy("createdAt", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import("@/types").TravelGroup));
}

export async function getUserGroups(uid: string): Promise<import("@/types").TravelGroup[]> {
  const q = query(collection(db(), "travelGroups"),
    where("memberIds", "array-contains", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import("@/types").TravelGroup));
}

export async function getTravelGroup(id: string): Promise<import("@/types").TravelGroup | null> {
  const snap = await getDoc(doc(db(), "travelGroups", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as import("@/types").TravelGroup) : null;
}

export async function createGroup(
  uid: string,
  displayName: string,
  data: Omit<import("@/types").TravelGroup, "id" | "creatorId" | "creatorName" | "membersCount" | "memberIds" | "postsCount" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db(), "travelGroups"), {
    ...data, creatorId: uid, creatorName: displayName,
    membersCount: 1, memberIds: [uid], postsCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function joinGroup(uid: string, groupId: string): Promise<void> {
  const ref = doc(db(), "travelGroups", groupId);
  await updateDoc(ref, {
    memberIds: arrayUnion(uid),
    membersCount: ((await getDoc(ref)).data()?.membersCount || 0) + 1,
  });
}

export async function leaveGroup(uid: string, groupId: string): Promise<void> {
  const ref = doc(db(), "travelGroups", groupId);
  const cnt = (await getDoc(ref)).data()?.membersCount || 1;
  await updateDoc(ref, { memberIds: arrayRemove(uid), membersCount: Math.max(0, cnt - 1) });
}

export async function getGroupPosts(groupId: string): Promise<import("@/types").GroupPost[]> {
  const q = query(collection(db(), "groupPosts"),
    where("groupId", "==", groupId), orderBy("createdAt", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import("@/types").GroupPost));
}

export async function addGroupPost(uid: string, displayName: string, groupId: string, text: string): Promise<string> {
  const ref = await addDoc(collection(db(), "groupPosts"), {
    groupId, userId: uid, displayName, text, likesCount: 0, createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db(), "travelGroups", groupId), {
    postsCount: ((await getDoc(doc(db(), "travelGroups", groupId))).data()?.postsCount || 0) + 1,
  });
  return ref.id;
}
