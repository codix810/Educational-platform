// ✅ مسار: src/app/dashboard/courses/[id]/add-exam/page.js
// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminGuard } from '../../../../../../hooks/useAdminGuard';

export default function AddExamPage({ params }) {

    useAdminGuard(); // ✅ حماية الأدمن فقط
  
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  const handleGenerate = () => {
    const generated = Array.from({ length: questionCount }, (_, index) => ({
      question: '',
      options: ['', '', '', ''],
      answer: '',
    }));
    setQuestions(generated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'question' || field === 'answer') {
      updated[index][field] = value;
    } else {
      updated[index].options[field] = value;
    }
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    const res = await fetch(`/api/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: params.id,
        questions,
      }),
    });

    if (res.ok) {
      router.push(`/dashboard/exams`);
    } else {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-xl font-bold text-center mb-4 text-[#344955]">
        📄 إضافة امتحان للكورس
      </h1>

      {questions.length === 0 && (
        <div className="flex flex-col items-center gap-3">
          <input
            type="number"
            placeholder="كم عدد الأسئلة؟"
            min={1}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="border p-2 rounded w-64 text-center"
          />
          <button
            onClick={handleGenerate}
            className="bg-[#00A676] hover:bg-[#008C64] text-white px-4 py-2 rounded shadow"
          >
            توليد الأسئلة
          </button>
        </div>
      )}

      {questions.length > 0 && (
        <>
          <div className="space-y-8">
            {questions.map((q, i) => (
              <div
                key={i}
                className="border p-4 rounded shadow-md bg-white"
              >
                <h2 className="text-md font-bold mb-2 text-[#344955]">
                  سؤال {i + 1}:
                </h2>
                <input
                  type="text"
                  placeholder="نص السؤال"
                  value={q.question}
                  onChange={(e) => handleChange(i, 'question', e.target.value)}
                  className="border p-2 rounded w-full mb-3"
                />
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      placeholder={`اختيار ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleChange(i, optIndex, e.target.value)}
                      className="border p-2 rounded"
                    />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="الإجابة الصحيحة (انسخها من أحد الاختيارات)"
                  value={q.answer}
                  onChange={(e) => handleChange(i, 'answer', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-[#344955] hover:bg-[#263445] text-white px-6 py-2 rounded shadow block mx-auto"
          >
            حفظ الامتحان
          </button>
        </>
      )}
    </div>
  );
}
