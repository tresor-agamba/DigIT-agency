import type{UserRole}from"@prisma/client";export function canReadPaymentProof(role:UserRole,userId:string,projectClientId:string){return role==="ADMIN"||(role==="CLIENT"&&userId===projectClientId)}
