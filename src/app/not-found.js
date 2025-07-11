// ✅ المسار: src/app/not-found.js
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">الصفحة غير موجودة</h1>
      <p className="text-gray-700 mb-6">عذرًا، لا يمكننا العثور على الصفحة التي تبحث عنها.</p>
      <a
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
      >
        العودة إلى الرايسيه
      </a>
    </div>
  );
}
