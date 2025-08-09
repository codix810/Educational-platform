'use client';

import { useState, useEffect } from "react";
import VodafoneCash from "./wallet/VodafoneCash";
// import PayPal from "./wallet/PayPal";
import Visa from "./wallet/Visa";
import Fawry from "./wallet/Fawry";

/**
 * @param {{ paymentOption: string | null, setPaymentOption: (value: string | null) => void }} props
 */
export default function WalletSection({ paymentOption, setPaymentOption }) {
  const handleSelect = (method) => {
    // لو ضغط على نفس الزر يقفل
    setPaymentOption((prev) => (prev === method ? null : method));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">اختر وسيلة الدفع</h2>

      {/* الأزرار */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => handleSelect("vodafone")}
          className={`px-4 py-2 rounded ${
            paymentOption === "vodafone" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          فودافون كاش
        </button>

        <button
          onClick={() => handleSelect("paypal")}
          className={`px-4 py-2 rounded ${
            paymentOption === "paypal" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          PayPal
        </button>

        <button
          onClick={() => handleSelect("visa")}
          className={`px-4 py-2 rounded ${
            paymentOption === "visa" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Visa / MasterCard
        </button>

        <button
          onClick={() => handleSelect("fawry")}
          className={`px-4 py-2 rounded ${
            paymentOption === "fawry" ? "bg-yellow-600 text-white" : "bg-gray-200"
          }`}
        >
          فوري
        </button>
      </div>

      {/* عرض الكومبوننت حسب الاختيار */}
      <div className="mt-4">
        {paymentOption === "vodafone" && <VodafoneCash />}
        {paymentOption === "paypal" && <div>PayPal not implemented</div>}
        {paymentOption === "visa" && <Visa />}
        {paymentOption === "fawry" && <Fawry />}
      </div>
    </div>
  );
}
