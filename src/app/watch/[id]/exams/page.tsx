'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// تعريف شكل بيانات الامتحان
interface Exam {
  _id: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export default function ExamPage() {
  const { id } = useParams(); // course ID
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const checkPurchaseAndFetchExams = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return router.push("/Login");

      const user = JSON.parse(userStr);
      setUserId(user._id);

      const purchaseCheck = await fetch("/api/purchases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, courseId: id })
      });

      const check = await purchaseCheck.json();
      if (!check.exists) return router.push("/not-found");

      const res = await fetch(`/api/exams?courseId=${id}`);
      const data = await res.json();
      setExams(data.exams || []);
    };

    checkPurchaseAndFetchExams();
  }, [id, router]);

  const checkIfSubmitted = async (exam: Exam) => {
    const res = await fetch(`/api/exam-results?userId=${userId}&courseId=${id}&examId=${exam._id}`);
    const data = await res.json();

    if (data.exists) {
      setHasSubmitted(true);
      setScore(data.result.score);
      setAnswers(data.result.answers || {});
    } else {
      setHasSubmitted(false);
      setScore(null);
      setAnswers({});
    }
    setSelectedExam(exam);
  };

  const handleAnswerChange = (qIndex: number, selected: string) => {
    if (hasSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: selected }));
  };

  const handleSubmit = async () => {
    if (!selectedExam) return;

    const unanswered = selectedExam.questions.some((_, i) => !answers[i]);
    if (unanswered) {
      setErrorMsg("❗Please answer all questions before submitting the exam.");
      return;
    }

    setErrorMsg("");

    let correctCount = 0;
    selectedExam.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correctCount++;
    });

    const scoreValue = `${correctCount} / ${selectedExam.questions.length}`;

    await fetch("/api/exam-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        courseId: id,
        examId: selectedExam._id,
        answers,
        score: scoreValue,
      })
    });

    setScore(scoreValue);
    setHasSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600 text-center">اختر امتحانًا</h1>

      {selectedExam && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
           Exam questions: {selectedExam.title}
          </h2>

          {hasSubmitted && (
            <p className="text-green-600 font-bold mb-4">
             You have already taken this exam. Your score: {score}
            </p>
          )}

          {errorMsg && (
            <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>
          )}

          {selectedExam.questions.map((q, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-medium mb-2">{i + 1}. {q.question}</h3>
              {q.options.map((opt, j) => (
                <label key={j} className="block mb-1">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    disabled={hasSubmitted}
                    checked={answers[i] === opt}
                    onChange={() => handleAnswerChange(i, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!hasSubmitted && (
            <button
              onClick={handleSubmit}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
            >
              Submit the exam
            </button>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {exams.map((exam, index) => (
          <button
            key={exam._id}
            onClick={() => checkIfSubmitted(exam)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg text-right"
          >
            exam {exam.title || `#${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
