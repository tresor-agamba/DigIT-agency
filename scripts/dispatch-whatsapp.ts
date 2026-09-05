import"dotenv/config";import{dispatchPendingWhatsAppMessages}from"../src/lib/whatsapp/dispatcher";import{prisma}from"../src/lib/prisma";
dispatchPendingWhatsAppMessages().then(result=>console.info("WhatsApp dispatch",result)).finally(()=>prisma.$disconnect());
