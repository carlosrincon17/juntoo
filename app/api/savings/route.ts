import { db } from "@/utils/storage/db";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
export async function GET(request: Request) {
    const savingsAccount =  await db.query.SavingsTable.findMany();
    console.log(request.headers)
    savingsAccount.forEach(saving => {
        console.error("saving to process:", saving);
    });
    return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}