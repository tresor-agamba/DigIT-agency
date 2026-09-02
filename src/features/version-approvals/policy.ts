import type { VersionStatus } from "@prisma/client";

export function canApproveVersion(status: VersionStatus, alreadyApproved: boolean) {
  return status === "READY_FOR_REVIEW" && !alreadyApproved;
}

export function canRequestModification(status: VersionStatus) {
  return status !== "APPROVED" && status !== "FINAL";
}
