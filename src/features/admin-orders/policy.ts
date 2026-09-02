import type { OrderStatus } from "@prisma/client";

export const orderStatusTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  NEW: ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  UNDER_REVIEW: ["NEEDS_INFORMATION", "QUOTED", "REJECTED", "CANCELLED"],
  NEEDS_INFORMATION: ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  QUOTED: ["UNDER_REVIEW", "ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["CANCELLED"],
  REJECTED: [],
  CANCELLED: [],
  CONVERTED_TO_PROJECT: [],
};

export function canTransitionOrderStatus(current: OrderStatus, next: OrderStatus) { return orderStatusTransitions[current].includes(next); }
