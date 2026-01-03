export function getPublicProfilePath(user: { id: string; username?: string | null }): string {
  const u = (user.username ?? "").trim();
  if (u) return `/profile/@${u}`;
  return `/profile/${user.id}`;
}


