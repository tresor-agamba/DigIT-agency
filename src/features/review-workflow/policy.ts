import type{ModificationRequestStatus,VersionStatus}from"@prisma/client";
export const requestTransitions:Record<ModificationRequestStatus,ModificationRequestStatus[]>={PENDING:["IN_PROGRESS","REJECTED"],IN_PROGRESS:["COMPLETED","REJECTED"],COMPLETED:[],REJECTED:[]};
export function canTransitionRequest(from:ModificationRequestStatus,to:ModificationRequestStatus){return requestTransitions[from].includes(to)}
export function canPublishVersion(status:VersionStatus){return status==="DRAFT"}
export function canDecideVersion(status:VersionStatus){return status==="READY_FOR_REVIEW"}
