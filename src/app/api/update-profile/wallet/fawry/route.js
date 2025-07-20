import crypto from "crypto";
import clientPromise from "../../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, userId, description = "شحن المحفظة" } = await req.json();
    console.log(" البيانات اللي وصلت:", { amount, userId, description });

    if (!userId) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return NextResponse.json({ message: "قيمة المبلغ غير صحيحة" }, { status: 400 });
    }

    const merchantCode = process.env.FAWRY_MERCHANT_CODE;
    const secureKey = process.env.FAWRY_SECURITY_KEY;
    const merchantRefNum = crypto.randomUUID();
    const paymentExpiry = Date.now() + 24 * 3600 * 1000;

    const signatureString = merchantCode + merchantRefNum + numericAmount.toFixed(2) + secureKey;
    const signature = crypto.createHash("sha256").update(signatureString).digest("hex");

    const fawryRes = await fetch(
      "https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/charge",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantCode,
          merchantRefNum,
          customerMobile: "01000000000",
          customerEmail: "user@example.com",
          amount: numericAmount.toFixed(2),
          description,
          paymentExpiry,
          language: "ar-eg",
          paymentMethod: "PayAtFawry",
          signature,
        }),
      }
    );

    const fawryRespText = await fawryRes.text();
    console.log(" رد فوري (كنص):", fawryRespText);

    let fawryData;
    try {
      fawryData = JSON.parse(fawryRespText);
    } catch (err) {
      console.error(" الرد مش JSON! ", err);
      return NextResponse.json({ message: "الرد من فوري غير صالح", raw: fawryRespText }, { status: 500 });
    }

    if (!fawryRes.ok) {
      throw new Error(fawryData.message || "فشل إنشاء كود فوري");
    }

    const client = await clientPromise;
    await client.db().collection("wallet_requests").insertOne({
      method: "fawry",
      userId,
      amount: numericAmount.toFixed(2),
      refNumber: fawryData.referenceNumber,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({
      referenceNumber: fawryData.referenceNumber,
      expiry: fawryData.paymentExpiry || paymentExpiry,
    });

  } catch (err) {
    console.error(" Fawry Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "userId مطلوب" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const requests = await db
      .collection("wallet_requests")
      .find({ userId, method: "fawry" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ requests });
  } catch (err) {
    console.error(" فشل في جلب الطلبات:", err);
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
