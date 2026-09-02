import { Suspense } from "react";
import { OrdersShell } from "./orders-shell";
export default function OrdersLayout({children}:{children:React.ReactNode}){return <Suspense fallback={children}><OrdersShell>{children}</OrdersShell></Suspense>}
