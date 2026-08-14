export type ActionState = { status: "idle" | "success" | "error"; message?: string; id?: string };
export const initialActionState: ActionState = { status: "idle" };
