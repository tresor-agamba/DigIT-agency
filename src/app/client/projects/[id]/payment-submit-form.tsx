"use client";
import { useActionState, useState } from "react";
import type { PaymentMethod } from "@prisma/client";
import { submitPaymentAction } from "@/features/payments/actions";
import { initialPaymentActionState } from "@/features/payments/types";
import type { PaymentMethodDto } from "@/features/payments/config";
export function PaymentSubmitForm({paymentId,amount,currency,methods}:{paymentId:string;amount:string;currency:string;methods:PaymentMethodDto[]}) {
  const [state,action,pending]=useActionState(submitPaymentAction,initialPaymentActionState);
  const [selected,setSelected]=useState<PaymentMethod|"">(methods[0]?.method??"");
  const detail=methods.find((method)=>method.method===selected);
  if(!methods.length)return <p className="mt-4 text-sm text-amber-800">Aucune méthode de paiement n’est actuellement configurée. Contactez DigIT Agency.</p>;
  const field="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
  return <form action={action} encType="multipart/form-data" className="mt-5 grid gap-4 text-sm text-slate-700"><input type="hidden" name="paymentId" value={paymentId}/><label>Méthode<select required name="method" value={selected} onChange={(event)=>setSelected(event.target.value as PaymentMethod)} className={field}>{methods.map((method)=><option key={method.method} value={method.method}>{method.label}</option>)}</select></label>{detail&&<div className="rounded-xl border border-teal-200 bg-teal-50 p-4"><p>Montant exact : <strong>{amount} {currency}</strong></p><p>Bénéficiaire : {detail.beneficiary}</p><p>Numéro / compte : {detail.account}</p><p className="mt-2 text-slate-600">{detail.instructions}</p></div>}<label>Référence de transaction *<input required name="reference" maxLength={160} className={field}/></label><label>Preuve facultative<input name="proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf" className={field}/></label>{state.status!=="idle"&&<p role="status" className={state.status==="success"?"text-teal-700":"text-red-700"}>{state.message}</p>}<button disabled={pending} className="w-fit rounded-lg bg-electric-mint px-4 py-2 font-bold text-slate-950 disabled:opacity-60">{pending?"Soumission…":"Soumettre mon paiement"}</button></form>;
}
