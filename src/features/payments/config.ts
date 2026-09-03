import type{PaymentMethod}from"@prisma/client";
export type PaymentMethodDto={method:PaymentMethod;label:string;beneficiary:string;account:string;instructions:string};
const definitions:[PaymentMethod,string,string,string,string][]=[
  ["MPESA","M-Pesa","PAYMENT_MPESA_ENABLED","PAYMENT_MPESA_NUMBER","PAYMENT_MPESA_NAME"],
  ["AIRTEL_MONEY","Airtel Money","PAYMENT_AIRTEL_ENABLED","PAYMENT_AIRTEL_NUMBER","PAYMENT_AIRTEL_NAME"],
  ["ORANGE_MONEY","Orange Money","PAYMENT_ORANGE_ENABLED","PAYMENT_ORANGE_NUMBER","PAYMENT_ORANGE_NAME"],
  ["BANK_TRANSFER","Virement bancaire","PAYMENT_BANK_ENABLED","PAYMENT_BANK_NUMBER","PAYMENT_BANK_NAME"],
];
export function getAvailablePaymentMethods():PaymentMethodDto[]{return definitions.flatMap(([method,label,enabledKey,accountKey,nameKey])=>{const account=process.env[accountKey]?.trim();const beneficiary=process.env[nameKey]?.trim();if(process.env[enabledKey]!=="true"||!account||!beneficiary)return[];return[{method,label,account,beneficiary,instructions:"Effectuez le paiement du montant exact, puis soumettez votre référence de transaction."}]})}
export function isPaymentMethodEnabled(method:PaymentMethod){return getAvailablePaymentMethods().some(item=>item.method===method)}
