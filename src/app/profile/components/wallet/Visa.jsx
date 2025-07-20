"use client";
import { useState } from "react";
import { FaCcVisa, FaCcMastercard,FaCcDiscover , FaCcAmex, FaCreditCard } from "react-icons/fa";

export default function VisaForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");

  //   تحديد نوع البطاقة
const detectCardType = (number) => {
  const cleaned = number.replace(/\s+/g, "");

  if (/^4/.test(cleaned)) return "Visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "MasterCard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^6(?:011|5)/.test(cleaned)) return "Discover";
  if (/^507[5-9]|^5080/.test(cleaned)) return "Meeza"; //   ميزة
  return "غير معروف";
};


  const handleCardChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);

    if (value.length >= 4) {
      const type = detectCardType(value);
      setCardType(type);
    } else {
      setCardType("");
    }
  };

  //   أنواع البطاقات
    const cardIcons = {
        Visa: <FaCcVisa className="text-blue-600 text-3xl" />,
        MasterCard: <FaCcMastercard className="text-red-600 text-3xl" />,
        "American Express": <FaCcAmex className="text-indigo-600 text-3xl" />,
        Discover: <FaCcDiscover  className="text-yellow-500 text-3xl" />,
        Meeza: (
            <div className="flex items-center gap-2"><img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Meeza.svg" alt="Meeza" className="w-12 h-auto" /></div>
        ),    
        "غير معروف": <FaCreditCard className="text-gray-400 text-3xl" />,
    };

  return (
    <div className="space-y-4 border p-6 rounded shadow-md bg-white max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-2 text-gray-800">الدفع عبر البطاقة</h3>

      <div>
        <label className="block mb-1 font-medium">رقم البطاقة</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardChange}
          className="w-full border p-2 rounded text-right"
        />
        {cardType && (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            {cardIcons[cardType] || cardIcons["غير معروف"]}
            <span>
              تم التعرف على البطاقة:{" "}
              <span className="font-bold text-blue-600">{cardType}</span>
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">الاسم على البطاقة</label>
        <input type="text" placeholder="الاسم الكامل" className="w-full border p-2 rounded" />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 font-medium">تاريخ الانتهاء</label>
          <input type="text" placeholder="MM/YY" className="w-full border p-2 rounded" />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">CVV</label>
          <input type="text" placeholder="123" className="w-full border p-2 rounded" />
        </div>
      </div>

      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold">
        دفع
      </button>
    </div>
  );
}
