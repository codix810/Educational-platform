//  المسار: src/app/dashboard/courses/[id]/add-files/page.js  ده المساول عن  اضافة الملفات
// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAdminGuard } from '../../../../../../hooks/useAdminGuard';

export default function AddFilePage() {

    useAdminGuard(); //  حماية الأدمن فقط

  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data.courses || []);
    };
    fetchCourses();
  }, []);

  const getFileType = (file) => {
    const mime = file.type;
    if (mime.includes('pdf')) return 'pdf';
    if (mime.includes('word')) return 'docx';
    if (mime.includes('zip')) return 'zip';
    if (mime.includes('image')) return 'image';
    return 'other';
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccessMsg('');

  if (!file) {
    alert('اختر ملف');
    setLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_dashboard');
  formData.append('folder', 'dashboard_files');

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dfbadbos5/auto/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

if (!res.ok || !data.secure_url || !data.public_id) {
  throw new Error('فشل رفع الملف على Cloudinary');
} else {
  const backendPayload = {
    courseId: selectedCourse,
    title: fileTitle,
    url: data.secure_url,
    type: getFileType(file),
    sizeMB: (data.bytes / 1024 / 1024).toFixed(2),
    originalName: data.original_filename,
    public_id: data.public_id,
  };

  const dbRes = await fetch('/api/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendPayload),
  });

  const dbData = await dbRes.json();

  if (!dbRes.ok) {
    throw new Error(dbData.message);
  }

  //  عرض رسالة النجاح
  setSuccessMsg(' تم رفع الملف بنجاح! سيتم تحويلك الآن...');
  
  //  تحويل بعد مهلة بسيطة
  setTimeout(() => {
    router.push('/dashboard/files');
  }, 800);
}


  } catch (err) {
    console.error(' Upload or DB Error:', err);
    setError(' خطأ: ' + err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة ملف للكورس</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center bg-[white] hover:bg-[#f4f4f4] text-[#00695C] ">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 flex items-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">اختر الكورس</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">اختر كورس</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">عنوان الملف</label>
          <input
            type="text"
            value={fileTitle}
            onChange={(e) => setFileTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">اختيار الملف</label>
          <input
            type="file"
            onChange={(e) => {
              const selected = e.target.files[0];
              setFile(selected);
              setFileType(getFileType(selected));
            }}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {file && (
            <p className="text-sm text-gray-500 mt-1">الحجم: {(file.size / 1024 / 1024).toFixed(2)} ميجا</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition disabled:opacity-50"
        >
          {loading ? 'جارٍ الإضافة...' : 'إضافة الملف'}
        </button>
      </form>
    </div>
  );
}
