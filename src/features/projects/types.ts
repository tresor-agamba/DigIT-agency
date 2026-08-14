export type ProjectActionState = { status: "idle" | "success" | "error"; message?: string; id?: string };
export const initialProjectActionState: ProjectActionState = { status: "idle" };
