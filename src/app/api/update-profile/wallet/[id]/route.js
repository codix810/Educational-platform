import clientPromise from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ message: "بيانات ناقصة" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const walletRequests = db.collection("wallet_requests");
    const users = db.collection("users");

    const request = await walletRequests.findOne({ _id: new ObjectId(id) });

    if (!request) {
      return NextResponse.json({ message: "الطلب غير موجود" }, { status: 404 });
    }

    const previousStatus = request.status;

    const result = await walletRequests.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          reviewedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "لم يتم التحديث" }, { status: 400 });
    }

    // ✅ لو اتحولت لـ approved نضيف الرصيد
    if (status === "approved" && previousStatus !== "approved") {
      await users.updateOne(
        { _id: new ObjectId(request.userId) },
        { $inc: { balance: parseFloat(request.amount) } }
      );
    }

    // ✅ لو كان approved واتحول لـ rejected نخصم الرصيد
    if (previousStatus === "approved" && status === "rejected") {
      await users.updateOne(
        { _id: new ObjectId(request.userId) },
        { $inc: { balance: -parseFloat(request.amount) } }
      );
    }

    return NextResponse.json({ message: "تم تحديث الحالة بنجاح" });
  } catch (err) {
    console.error("❌ خطأ في تحديث الحالة:", err);
    return NextResponse.json({ message: "خطأ في السيرفر" }, { status: 500 });
  }
}
