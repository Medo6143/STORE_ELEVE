"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setShippingInfo } from "@/store/slices/cartSlice";
import { RootState } from "@/store";
import OrderSummary from "@/components/checkout/OrderSummary";

const governorates = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Qalyubia",
  "Port Said",
  "Suez",
  "Luxor",
  "Aswan",
  "Red Sea",
  "Beheira",
  "Dakahlia",
  "Faiyum",
  "Gharbia",
  "Ismailia",
  "Kafr El Sheikh",
  "Matrouh",
  "Minya",
  "Monufia",
  "New Valley",
  "North Sinai",
  "Qena",
  "Sharqia",
  "Sohag",
  "South Sinai",
  "Damietta",
  "Asyut",
  "Beni Suef",
];

export default function ShippingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector((state: RootState) => state.cart);

  const [formData, setFormData] = useState({
    fullName: shippingInfo?.fullName || "",
    email: shippingInfo?.email || "",
    phone: shippingInfo?.phone || "",
    street: shippingInfo?.street || "",
    city: shippingInfo?.city || "",
    governorate: shippingInfo?.governorate || "",
    postalCode: shippingInfo?.postalCode || "",
    notes: shippingInfo?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setShippingInfo(formData));
    router.push("/checkout/review");
  };

  const inputClass =
    "w-full bg-transparent border-b border-[#d0c5b5]/30 py-3 text-[#1a1c1b] font-body tracking-wide placeholder:text-[#1a1c1b]/20 focus:outline-none focus:border-[#c9a96e] transition-colors";
  const labelClass =
    "block font-sans uppercase tracking-[0.1em] text-[10px] text-[#1a1c1b]/50 mb-1";

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
      {/* Left: Shipping Form */}
      <div className="flex-1">
        <header className="mb-12">
          <span className="font-sans uppercase tracking-[0.2em] text-[#c9a96e] text-sm">Step 01</span>
          <h2 className="text-4xl font-serif mt-2 text-[#1a1c1b]">Shipping Information</h2>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={inputClass}
              placeholder="ALEXANDER VOGUE"
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
              placeholder="CURATOR@ELEVE.COM"
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number (+20)</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={inputClass}
              placeholder="+20 1XX XXX XXXX"
            />
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className={inputClass}
              placeholder="12 EL ZAMALEK BOULEVARD"
            />
          </div>

          {/* City */}
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={inputClass}
              placeholder="CAIRO"
            />
          </div>

          {/* Governorate */}
          <div>
            <label className={labelClass}>Governorate</label>
            <select
              required
              value={formData.governorate}
              onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="">SELECT GOVERNORATE</option>
              {governorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* Postal Code */}
          <div>
            <label className={labelClass}>Postal Code</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className={inputClass}
              placeholder="11211"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className={labelClass}>Order Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={`${inputClass} resize-none`}
              placeholder="SPECIAL DELIVERY INSTRUCTIONS..."
              rows={2}
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-8">
            <button
              type="submit"
              className="w-full md:w-auto px-16 py-5 bg-[#1a1c1b] text-[#f9f9f7] uppercase font-sans tracking-[0.2em] text-sm hover:bg-[#c9a96e] transition-colors duration-500"
            >
              Continue to Review
            </button>
          </div>
        </form>
      </div>

      {/* Right: Order Summary */}
      <aside className="w-full lg:w-[400px]">
        <OrderSummary />
      </aside>
    </div>
  );
}
