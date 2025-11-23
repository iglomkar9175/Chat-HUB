import { getUserByUid } from "./getUserByUid";


export async function getFriendsList(uid) {
  const me = await getUserByUid(uid);
  const friendUids = me?.friends || [];
  const out = [];
  for (const fuid of friendUids) {
    const u = await getUserByUid(fuid);
    if (u) out.push({ uid: fuid, username: u.username || u.name, name: u.name, photoURL: u.photoURL });
  }
  return out;
}
