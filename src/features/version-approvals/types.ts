export type ApprovalActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialApprovalActionState: ApprovalActionState = { status: "idle" };
