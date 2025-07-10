// ✅ المسار: src/app/dashboard/exams/edit/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';

export default function EditExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/not-found.js');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') return router.push('/not-found.js');

    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/exams/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setExam(data.exam);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index][field] = value;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      answer: '',
    };
    setExam({ ...exam, questions: [...exam.questions, newQuestion] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: exam.questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg('تم تعديل الامتحان بنجاح');
      setTimeout(() => router.push('/dashboard/exams'), 1500);
    } catch (err) {
      setError('حدث خطأ أثناء التعديل: ' + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex gap-2">
          <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
          <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">تعديل الامتحان</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> رجوع
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 flex items-center">
          <XCircle className="w-5 h-5 mr-2" /> {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        {exam.questions.map((q, i) => (
          <div key={i} className="border p-4 rounded-xl shadow-md bg-gray-50 relative">
            <span className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-bl-lg font-semibold">
              سؤال {i + 1}
            </span>
            <label className="block text-sm text-gray-600 mb-1">نص السؤال</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={q.question}
              onChange={(e) => handleChange(i, 'question', e.target.value)}
              required
            />
            {q.options.map((opt, idx) => (
              <div key={idx} className="mb-2">
                <label className="block text-sm text-gray-500 mb-1">الاختيار {idx + 1}</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, idx, e.target.value)}
                  required
                />
              </div>
            ))}
            <label className="block text-sm text-gray-600 mb-1">الإجابة الصحيحة</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={q.answer}
              onChange={(e) => handleChange(i, 'answer', e.target.value)}
              required
            />
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <PlusCircle className="w-5 h-5" /> إضافة سؤال جديد
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-transform hover:scale-105"
          >
            <CheckCircle className="inline-block mr-2 w-5 h-5" /> حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
