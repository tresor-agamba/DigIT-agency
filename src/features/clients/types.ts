export type ClientActionState = { status: "idle" | "success" | "error"; message?: string; phone?: string; id?: string };

export const initialClientActionState: ClientActionState = { status: "idle" };
