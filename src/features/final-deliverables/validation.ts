import path from "node:path";
import type { DeliverableType } from "@prisma/client";

const policies:Record<DeliverableType,Map<string,string>>={
  VIDEO:new Map([["video/mp4",".mp4"],["video/webm",".webm"],["video/quicktime",".mov"]]),
  WEBSITE:new Map(),
  MOBILE_APP:new Map([["application/vnd.android.package-archive",".apk"],["application/octet-stream",".aab"],["application/zip",".zip"],["application/x-zip-compressed",".zip"]]),
  DOCUMENT:new Map([["application/pdf",".pdf"],["application/zip",".zip"],["application/x-zip-compressed",".zip"]]),
  ARCHIVE:new Map([["application/zip",".zip"],["application/x-zip-compressed",".zip"]]),
  OTHER:new Map([["application/pdf",".pdf"],["application/zip",".zip"],["application/x-zip-compressed",".zip"],["video/mp4",".mp4"],["video/webm",".webm"]]),
};
export function maxFinalBytes(){const mb=Number.parseInt(process.env.MAX_FINAL_UPLOAD_MB??"100",10);return(Number.isFinite(mb)&&mb>0?mb:100)*1024*1024}
export function sanitizeFinalFileName(value:string){return path.basename(value).replace(/[\r\n"\\/\x00-\x1f\x7f]/g,"_").slice(0,180)||"livrable-final"}
export function validateFinalFile(type:DeliverableType,file:File){if(file.size<=0)throw new Error("Le fichier final est vide.");if(file.size>maxFinalBytes())throw new Error("Le fichier final dépasse la taille maximale.");const extension=path.extname(file.name).toLowerCase();const expected=policies[type].get(file.type);if(!expected)throw new Error("Format de fichier final non autorisé pour ce livrable.");if(extension!==expected)throw new Error("L’extension ne correspond pas au type du fichier final.");return{extension,mimeType:file.type,fileName:sanitizeFinalFileName(file.name),size:file.size}}
export function validateFinalUrl(raw:string){let url:URL;try{url=new URL(raw.trim())}catch{throw new Error("URL finale invalide.")}if(!["http:","https:"].includes(url.protocol))throw new Error("Protocole d’URL finale interdit.");const local=["localhost","127.0.0.1","::1"].includes(url.hostname);if(process.env.NODE_ENV==="production"&&url.protocol!=="https:"&&!local)throw new Error("HTTPS est obligatoire en production.");return url.toString()}
