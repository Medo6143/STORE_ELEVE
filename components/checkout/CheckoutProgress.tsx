"use client";

import { usePathname } from "next/navigation";
import { Truck, ClipboardCheck, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  { id: "shipping", label: "Shipping", icon: Truck, path: "/checkout/shipping" },
  { id: "review", label: "Review", icon: ClipboardCheck, path: "/checkout/review" },
  { id: "payment", label: "Payment", icon: CreditCard, path: "/checkout/payment" },
  { id: "confirmation", label: "Confirmation", icon: CheckCircle, path: "/checkout/confirmation", hideForComplete: true },
];

export default function CheckoutProgress() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => pathname.includes(step.id));

  return (
    <ul className="space-y-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        
        // Hide confirmation step if not on confirmation page
        if (step.id === "confirmation" && currentStepIndex < 3) {
          return null;
        }

        return (
          <li
            key={step.id}
            className={`flex items-center gap-4 transition-all duration-300 ${
              isActive
                ? "text-[#c9a96e] font-bold border-r-2 border-[#c9a96e] pr-4"
                : isCompleted
                ? "text-[#1a1c1b]/60"
                : "text-[#1a1c1b]/40"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="font-serif tracking-tight text-lg">{step.label}</span>
            {isCompleted && (
              <CheckCircle className="w-4 h-4 ml-auto text-[#745a27]" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
