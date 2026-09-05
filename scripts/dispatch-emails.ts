import"dotenv/config";import{dispatchPendingEmails}from"../src/lib/email/dispatcher";import{prisma}from"../src/lib/prisma";
async function main(){try{const result=await dispatchPendingEmails();console.log(result)}finally{await prisma.$disconnect()}}
main().catch(error=>{console.error(error);process.exitCode=1});
