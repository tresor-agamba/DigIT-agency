export function slugifyServiceName(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "service";
}

export function slugCandidate(base: string, attempt: number) {
  return attempt === 1 ? base : `${base}-${attempt}`;
}
