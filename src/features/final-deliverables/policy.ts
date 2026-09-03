import type{ProjectStatus,UserRole}from"@prisma/client";
export function canAccessFinalDeliverable(role:UserRole,userId:string,clientId:string,status:ProjectStatus,paid:boolean){return role==="ADMIN"||(role==="CLIENT"&&userId===clientId&&status==="DELIVERED"&&paid)}
