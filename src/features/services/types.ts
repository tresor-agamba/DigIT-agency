export type ServiceActionState = { status: "idle" | "success" | "error"; message?: string; id?: string };
export const initialServiceActionState: ServiceActionState = { status: "idle" };
