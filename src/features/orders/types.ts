export type OrderActionState = { status: "idle" | "success" | "error"; message?: string; order?: { orderNumber: string; serviceName: string; status: "NEW"; createdAt: string }; existingAccount?: boolean };
export const initialOrderActionState: OrderActionState = { status: "idle" };
