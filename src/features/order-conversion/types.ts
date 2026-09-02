export type ConvertOrderActionState = { status: "idle" | "error"; message?: string };
export const initialConvertOrderActionState: ConvertOrderActionState = { status: "idle" };
