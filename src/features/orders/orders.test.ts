import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { createWebsiteOrder } from "./actions";
import { formatOrderNumber } from "./number";
import { findClientOrder } from "./queries";
import { publicOrderSchema } from "./validation";
import { initialOrderActionState } from "./types";

const prisma = new PrismaClient();
const baseInput = { name: "Client Test", phone: "+243812345678", password: "MotDePasseTest123!", passwordConfirmation: "MotDePasseTest123!", companyName: "Entreprise Test", title: "Besoin de test", description: "Description suffisamment longue pour une commande de test.", budget: "250", currency: "usd", desiredDeadline: "2027-01-15" };
function form(input: Record<string,string>){const result=new FormData();for(const[key,value]of Object.entries(input))result.set(key,value);return result}

test("validation et numéro de commande",()=>{assert.equal(publicOrderSchema.safeParse({...baseInput,serviceId:"clx1234567890123456789012",budget:"-1"}).success,false);assert.equal(publicOrderSchema.safeParse({...baseInput,serviceId:"clx1234567890123456789012",passwordConfirmation:"différent"}).success,false);assert.equal(formatOrderNumber(BigInt(1),2026),"DIG-2026-000001")});

test("le flux public crée des comptes et commandes isolés avec valeurs serveur",async()=>{const suffix=`${Date.now()}`.slice(-8);const phones=[`+24381${suffix}`,`+24382${suffix}`,`+24383${suffix}`,`+24384${suffix}`];const serviceIds:string[]=[];try{const active=await prisma.service.create({data:{name:"Service commande test",slug:`order-test-${suffix}`,shortDescription:"Test",description:"Service de test",category:"Test",priceType:"QUOTE"}});serviceIds.push(active.id);const inactive=await prisma.service.create({data:{name:"Service inactif test",slug:`order-inactive-${suffix}`,shortDescription:"Test",description:"Service de test",category:"Test",priceType:"QUOTE",isActive:false}});serviceIds.push(inactive.id);
  const first=await createWebsiteOrder(initialOrderActionState,form({...baseInput,phone:phones[0],serviceId:active.id,clientId:"injecte",role:"ADMIN",source:"ADMIN",status:"ACCEPTED",quotedAmount:"1",adminNotes:"injecte"}));assert.equal(first.status,"success");assert.ok(first.order);const firstUser=await prisma.user.findUniqueOrThrow({where:{phone:phones[0]}});assert.equal(firstUser.role,"CLIENT");assert.equal(firstUser.email,null);assert.equal(await bcrypt.compare(baseInput.password,firstUser.passwordHash),true);const firstOrder=await prisma.order.findUniqueOrThrow({where:{orderNumber:first.order!.orderNumber}});assert.equal(firstOrder.clientId,firstUser.id);assert.equal(firstOrder.source,"WEBSITE");assert.equal(firstOrder.status,"NEW");assert.equal(firstOrder.quotedAmount,null);assert.equal(firstOrder.adminNotes,null);
  const oldHash=firstUser.passwordHash;const duplicate=await createWebsiteOrder(initialOrderActionState,form({...baseInput,phone:phones[0],password:"NouveauMotDePasse123!",passwordConfirmation:"NouveauMotDePasse123!",serviceId:active.id}));assert.equal(duplicate.existingAccount,true);assert.equal((await prisma.user.findUniqueOrThrow({where:{phone:phones[0]}})).passwordHash,oldHash);
  const refused=await createWebsiteOrder(initialOrderActionState,form({...baseInput,phone:phones[2],serviceId:inactive.id}));assert.equal(refused.status,"error");assert.equal(await prisma.user.count({where:{phone:phones[2]}}),0);
  const deleted=await prisma.service.create({data:{name:"Service supprimé test",slug:`order-missing-${suffix}`,shortDescription:"Test",description:"Service de test",category:"Test",priceType:"QUOTE"}});await prisma.service.delete({where:{id:deleted.id}});const missing=await createWebsiteOrder(initialOrderActionState,form({...baseInput,phone:phones[3],serviceId:deleted.id}));assert.equal(missing.status,"error");assert.equal(await prisma.user.count({where:{phone:phones[3]}}),0);
  const second=await createWebsiteOrder(initialOrderActionState,form({...baseInput,phone:phones[1],email:"client-test-2@example.com",serviceId:active.id,title:"Deuxième commande"}));assert.equal(second.status,"success");assert.notEqual(second.order?.orderNumber,first.order?.orderNumber);const secondUser=await prisma.user.findUniqueOrThrow({where:{phone:phones[1]}});assert.equal(await findClientOrder(secondUser.id,firstOrder.id),null);assert.ok(await findClientOrder(firstUser.id,firstOrder.id));
}finally{const users=await prisma.user.findMany({where:{phone:{in:phones}},select:{id:true}});await prisma.order.deleteMany({where:{clientId:{in:users.map(user=>user.id)}}});await prisma.user.deleteMany({where:{id:{in:users.map(user=>user.id)}}});await prisma.service.deleteMany({where:{id:{in:serviceIds}}});}});

test.after(async()=>{await prisma.$disconnect()});
