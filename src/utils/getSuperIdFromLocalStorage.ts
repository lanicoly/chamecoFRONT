export function getSuperIdFromLocalStorage(): number | undefined {
  const raw = localStorage.getItem("userData");
  if (!raw) return undefined;
  try {
    const obj = JSON.parse(raw);
    const cand =
      obj?.superusuarioId ?? obj?.superuserId ?? obj?.id ?? obj?.userId ?? raw;
    const n = Number(cand);
    return Number.isFinite(n) ? n : undefined;
  } catch {
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }
}
