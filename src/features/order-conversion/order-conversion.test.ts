import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import { PrismaClient, type OrderStatus } from "@prisma/client";
import { convertAcceptedOrder } from "./operation";
import { findClientOrder } from "@/features/orders/queries";
import { findClientProject } from "@/features/client-portal/queries";

const prisma = new PrismaClient();

test("conversion atomique d’une commande acceptée en projet", async () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const userIds:string[]=[]; const serviceIds:string[]=[]; const orderIds:string[]=[];
  try {
    const passwordHash=await bcrypt.hash("PasswordTest123!",4);
    const admin=await prisma.user.create({data:{name:"Admin conversion",phone:`+24380${Date.now().toString().slice(-8)}`,passwordHash,role:"ADMIN"}});userIds.push(admin.id);
    const client=await prisma.user.create({data:{name:"Client conversion",phone:`+24381${Date.now().toString().slice(-8)}`,passwordHash,role:"CLIENT"}});userIds.push(client.id);
    const service=await prisma.service.create({data:{name:"Service conversion",slug:`conversion-${suffix}`,shortDescription:"Test",description:"Test",category:"Test",priceType:"QUOTE",projectType:"MOBILE_APP"}});serviceIds.push(service.id);
    const makeOrder=async(status:OrderStatus,label:string)=>{const order=await prisma.order.create({data:{orderNumber:`CONV-${label}-${suffix}`,clientId:client.id,serviceId:service.id,title:`Projet ${label}`,description:"Description du projet",currency:"USD",status}});orderIds.push(order.id);return order};

    const accepted=await makeOrder("ACCEPTED","ok");
    const project=await convertAcceptedOrder(admin.id,{orderId:accepted.id,projectName:"Application client",projectDescription:"Production",projectType:service.projectType});
    const converted=await prisma.order.findUniqueOrThrow({where:{id:accepted.id},include:{project:true,auditLogs:true}});
    assert.equal(converted.status,"CONVERTED_TO_PROJECT");assert.equal(converted.project?.id,project.id);assert.equal(converted.project?.clientId,client.id);assert.equal(converted.project?.orderId,accepted.id);assert.equal(converted.project?.type,"MOBILE_APP");assert.equal(converted.project?.status,"DRAFT");
    const audit=converted.auditLogs.find(log=>log.action==="ORDER_CONVERTED_TO_PROJECT");assert.equal(audit?.adminId,admin.id);assert.equal(audit?.oldValue,"ACCEPTED");assert.match(audit?.newValue??"",new RegExp(project.id));
    await assert.rejects(convertAcceptedOrder(admin.id,{orderId:accepted.id,projectName:"Bis",projectType:"OTHER"}));
    await assert.rejects(prisma.project.create({data:{name:"Doublon",type:"OTHER",clientId:client.id,orderId:accepted.id}}));
    const manual=await prisma.project.create({data:{name:"Projet manuel",type:"OTHER",clientId:client.id}});assert.equal(manual.orderId,null);

    for(const status of ["NEW","UNDER_REVIEW","NEEDS_INFORMATION","QUOTED","REJECTED","CANCELLED","CONVERTED_TO_PROJECT"] as OrderStatus[]){const order=await makeOrder(status,status);await assert.rejects(convertAcceptedOrder(admin.id,{orderId:order.id,projectName:"Refus",projectType:"OTHER"}));}

    const rollback=await makeOrder("ACCEPTED","rollback");await assert.rejects(convertAcceptedOrder("clxxxxxxxxxxxxxxxxxxxxxxxxx",{orderId:rollback.id,projectName:"Rollback",projectType:"OTHER"}));const rolledBack=await prisma.order.findUniqueOrThrow({where:{id:rollback.id},include:{project:true}});assert.equal(rolledBack.status,"ACCEPTED");assert.equal(rolledBack.project,null);

    const race=await makeOrder("ACCEPTED","race");const results=await Promise.allSettled([convertAcceptedOrder(admin.id,{orderId:race.id,projectName:"Course A",projectType:"OTHER"}),convertAcceptedOrder(admin.id,{orderId:race.id,projectName:"Course B",projectType:"OTHER"})]);assert.equal(results.filter(result=>result.status==="fulfilled").length,1);assert.equal(await prisma.project.count({where:{orderId:race.id}}),1);assert.equal(await prisma.orderAuditLog.count({where:{orderId:race.id,action:"ORDER_CONVERTED_TO_PROJECT"}}),1);

    const clientOrder=await findClientOrder(client.id,accepted.id);const clientProject=await findClientProject(client.id,project.id);assert.equal(clientOrder?.project?.id,project.id);assert.equal(clientProject?.order?.orderNumber,accepted.orderNumber);assert.equal(await findClientProject(admin.id,project.id),null);
  } finally {
    await prisma.project.deleteMany({where:{clientId:{in:userIds}}});
    await prisma.order.deleteMany({where:{id:{in:orderIds}}});
    await prisma.service.deleteMany({where:{id:{in:serviceIds}}});
    await prisma.user.deleteMany({where:{id:{in:userIds}}});
  }
});

test.after(async()=>{await prisma.$disconnect()});
