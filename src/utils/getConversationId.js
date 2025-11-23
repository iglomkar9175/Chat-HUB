
export function getConversationId(a, b) {
  if (!a || !b) {
    console.warn("getConversationId: missing uid(s)", { a, b });
    return null;
  }

  const cleanA = String(a).trim().toLowerCase();
  const cleanB = String(b).trim().toLowerCase();

  return [cleanA, cleanB].sort().join("_");
}
