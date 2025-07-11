// @ts-ignore
"use client";

import { Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCardIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

// ✅ تعريف Props
type WalletSectionProps = {
  paymentOption: string | null;
  setPaymentOption: Dispatch<SetStateAction<string | null>>;
};

// ✅ خيارات الدفع
const paymentOptions = [
  {
    label: "فودافون كاش",
    color: "red",
    icon: PhoneIcon,
    fields: (
      <>
        <input type="text" placeholder="رقم الهاتف" className="w-full border p-2 rounded mb-2" required />
        <input type="file" className="w-full border p-2 rounded" required />
      </>
    ),
  },
  {
    label: "فيزا",
    color: "blue",
    icon: CreditCardIcon,
    fields: (
      <>
        <input type="text" placeholder="رقم البطاقة" className="w-full border p-2 rounded mb-2" required />
        <input type="text" placeholder="تاريخ الإنتهاء" className="w-full border p-2 rounded mb-2" required />
        <input type="text" placeholder="CVV" className="w-full border p-2 rounded" required />
      </>
    ),
  },
  {
    label: "فوري",
    color: "yellow",
    icon: BuildingLibraryIcon,
    fields: (
      <>
        <input type="text" placeholder="كود العملية" className="w-full border p-2 rounded" required />
      </>
    ),
  },
  {
    label: "PayPal",
    color: "indigo",
    icon: GlobeAltIcon,
    fields: (
      <>
        <input type="email" placeholder="البريد الإلكتروني" className="w-full border p-2 rounded" required />
      </>
    ),
  },
  {
    label: "حساب بنكي",
    color: "green",
    icon: BanknotesIcon,
    fields: (
      <>
        <input type="text" placeholder="اسم البنك" className="w-full border p-2 rounded mb-2" required />
        <input type="text" placeholder="رقم الحساب" className="w-full border p-2 rounded" required />
      </>
    ),
  },
];

// ✅ المكون الرئيسي
export default function WalletSection({ paymentOption, setPaymentOption }: WalletSectionProps) {
  const active = paymentOption;
  const setActive = setPaymentOption;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-2xl font-bold mb-4">شحن المحفظة</h3>

      <div className="flex flex-wrap gap-4">
        {paymentOptions.map(({ label, color, icon: Icon }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(label === active ? null : label)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow transition-all font-semibold text-${color}-800 bg-${color}-100 hover:bg-${color}-200`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {paymentOptions.map(
            ({ label, fields, color }) =>
              active === label && (
                <motion.form
                  key={label}
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(`تم إرسال بيانات ${label}`);
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-4 border-2 border-${color}-300 rounded bg-white space-y-4 shadow`}
                >
                  <h4 className={`text-lg font-bold text-${color}-700 mb-2`}>{label}</h4>
                  {fields}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className={`w-full bg-${color}-600 hover:bg-${color}-700 text-white py-2 rounded font-semibold`}
                  >
                    إرسال البيانات
                  </motion.button>
                </motion.form>
              )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
