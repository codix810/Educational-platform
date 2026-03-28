// app/Signup/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {

  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [phone,setPhone]=useState('');
  const [role,setRole]=useState('');

  const [subject,setSubject]=useState('');
  const [experience,setExperience]=useState('');
  const [bio,setBio]=useState('');

  const [message,setMessage]=useState('');
  const [success,setSuccess]=useState(false);
  const [loading,setLoading]=useState(false);

  const [teacherImageUrl,setTeacherImageUrl]=useState('');
  const imageInputRef=useRef<HTMLInputElement|null>(null);

  useEffect(()=>{
    if(!localStorage.getItem('deviceId')){
      localStorage.setItem('deviceId',crypto.randomUUID());
    }
  },[]);


  const handleImageUpload = async () => {

    const imageFile=imageInputRef.current?.files?.[0];
    if(!imageFile) return null;

    const formData=new FormData();
    formData.append('file',imageFile);
    formData.append('upload_preset','unsigned_dashboard');
    formData.append('folder','teacher_images');

    const res=await fetch('https://api.cloudinary.com/v1_1/dfbadbos5/image/upload',{
      method:'POST',
      body:formData
    });

    const data=await res.json();

    if(res.ok && data.secure_url){
      setTeacherImageUrl(data.secure_url);
      return data.secure_url;
    }

    throw new Error('فشل رفع الصورة');
  };


  const handleSubmit=async(e:any)=>{
    e.preventDefault();
    setLoading(true);

    const deviceId=localStorage.getItem('deviceId');

    try{

      let imageUrl='';

      if(role==='teacher'){
        imageUrl=await handleImageUpload();
        if(!imageUrl) throw new Error('ارفع صورة');
      }

      const res=await fetch('/api/signup',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name,
          email,
          password,
          phone,
          role,
          subject,
          experience,
          bio,
          image:imageUrl
        })
      });

      const data=await res.json();

      setLoading(false);

      if(res.ok && data.user){

        setSuccess(true);
        setMessage(data.message);

        // تسجيل دخول تلقائي
        localStorage.setItem('user',JSON.stringify({
          _id:data.user._id,
          name:data.user.name,
          email:data.user.email,
          phone:data.user.phone,
          role:data.user.role,
          deviceId
        }));

        const redirectUrl=localStorage.getItem('redirect') || '/';

        setTimeout(()=>{
          window.location.href=redirectUrl;
        },300);

      }else{
        setSuccess(false);
        setMessage(data.message || 'فشل التسجيل');
      }

    }catch(err:any){
      setLoading(false);
      setSuccess(false);
      setMessage(err.message);
    }
  };


  return(

  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] via-[#e6f4ea] to-[#c9e6d4] px-4">

    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-[#cbe3d3]">

      <h2 className="text-3xl font-bold text-center text-[#2e7d4f] mb-6">
        إنشاء حساب
      </h2>

      {message && (
        <div className={`p-4 rounded mb-6 text-center ${success?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {loading ? (

        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-[#2e7d4f] rounded-full animate-spin"></div>
        </div>

      ) : (

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
        type="text"
        placeholder="الاسم الكامل"
        value={name}
        onChange={e=>setName(e.target.value)}
        required
        className="form-input"
        />

        <select
        value={role}
        onChange={e=>setRole(e.target.value)}
        required
        className="form-input"
        >
          <option value="">نوع الحساب</option>
          <option value="user">طالب</option>
          <option value="teacher">مدرس</option>
        </select>

        {/* EMAIL WITH SUGGESTIONS */}

        <input
        type="email"
        list="emails"
        placeholder="البريد الإلكتروني"
        autoComplete="email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        required
        className="form-input"
        />

        <datalist id="emails">
          <option value="@gmail.com"/>
          <option value="@outlook.com"/>
          <option value="@hotmail.com"/>
          <option value="@yahoo.com"/>
        </datalist>

        <input
        type="tel"
        placeholder="رقم الهاتف"
        value={phone}
        onChange={e=>setPhone(e.target.value)}
        required
        className="form-input"
        />

        {/* PASSWORD WITH EYE */}

        <div className="relative">

          <input
          type={showPassword?'text':'password'}
          placeholder="كلمة المرور"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="form-input pr-10"
          />

          <button
          type="button"
          onClick={()=>setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500"
          >
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>

        </div>


        {role==='teacher' && (

          <>

          <input
          type="text"
          placeholder="التخصص (رياضيات مثلا)"
          value={subject}
          onChange={e=>setSubject(e.target.value)}
          required
          className="form-input"
          />

          <input
          type="number"
          placeholder="سنوات الخبرة"
          value={experience}
          onChange={e=>setExperience(e.target.value)}
          required
          className="form-input"
          />

          <textarea
          placeholder="اكتب وصف بسيط عن نفسك كمدرس"
          value={bio}
          onChange={e=>setBio(e.target.value)}
          maxLength={300}
          className="form-input h-24 resize-none"
          />

          <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="form-input"
          required
          />

          </>

        )}

        <button
        type="submit"
        className="w-full py-2 rounded bg-[#2e7d4f] hover:opacity-90 text-white font-semibold"
        >
          إنشاء الحساب
        </button>

      </form>

      )}

    </div>


<style jsx>{`

.form-input{
width:100%;
padding:10px 14px;
border:1px solid #d1d5db;
border-radius:8px;
background:#f9fafb;
font-size:14px;
outline:none;
transition:.2s;
}

.form-input:focus{
border-color:#2e7d4f;
box-shadow:0 0 0 1px #2e7d4f;
background:white;
}

`}</style>

  </div>
  );
}