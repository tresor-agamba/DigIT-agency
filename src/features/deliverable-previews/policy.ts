import type { UserRole, VersionStatus } from "@prisma/client";
export const clientVisiblePreviewStatuses:VersionStatus[]=["READY_FOR_REVIEW","CHANGES_REQUESTED","APPROVED","FINAL"];
export function isPreviewVisibleToClient(status:VersionStatus){return clientVisiblePreviewStatuses.includes(status)}
export function canReadPreview(role:UserRole,userId:string,clientId:string,status:VersionStatus){return role==="ADMIN"||(role==="CLIENT"&&userId===clientId&&isPreviewVisibleToClient(status))}
