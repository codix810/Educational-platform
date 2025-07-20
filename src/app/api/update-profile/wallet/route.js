// ✅ المسار: src/app/api/update-profile/wallet/route.js

import clientPromise from "../../../../../lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      method,
      amount,
      fromPhone,
      url, // الصورة المرفوعة مسبقاً على Cloudinary
      public_id,
      userId, // ⬅️ أضفنا userId هنا
    } = body;

    if (!method || !amount || !fromPhone || !url || !public_id || !userId) {
      return NextResponse.json({ message: "البيانات ناقصة" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const walletRequests = db.collection("wallet_requests");

    const newRequest = {
      method,
      amount,
      fromPhone,
      url,
      public_id,
      userId, // ⬅️ أضفناه هنا
      status: "pending",
      createdAt: new Date(),
      reviewedAt: null,
    };

    const result = await walletRequests.insertOne(newRequest);

    return NextResponse.json({
      message: "تم حفظ بيانات الشحن بنجاح",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("❌ خطأ في رفع بيانات الشحن:", err);
    return NextResponse.json({ message: "خطأ في السيرفر" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    const client = await clientPromise;
    const db = client.db();
    const walletRequests = db.collection("wallet_requests");

    let query = {};
    if (userId) query.userId = userId;

    const requests = await walletRequests
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // هنا نجيب بيانات المستخدمين عشان نظهر الإيميل
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();
    const usersMap = {};
    users.forEach((u) => {
      usersMap[u._id?.toString()] = u.email || "غير متوفر";
    });

    const enhancedRequests = requests.map((req) => ({
      ...req,
      userEmail: usersMap[req.userId] || "غير متوفر",
    }));

    return NextResponse.json({ requests: enhancedRequests });
  } catch (err) {
    console.error("❌ فشل في جلب الطلبات:", err);
    return NextResponse.json({ message: "خطأ في السيرفر" }, { status: 500 });
  }
}


