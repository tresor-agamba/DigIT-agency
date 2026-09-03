export type PaymentActionState={status:"idle"|"success"|"error";message?:string;id?:string};export const initialPaymentActionState:PaymentActionState={status:"idle"};
