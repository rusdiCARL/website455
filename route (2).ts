import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://cashify.my.id/api/generate";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const licenseKey = process.env.LICENSE_KEY;
    const qrId = process.env.ID_QRIS;

    if (!licenseKey) {
      return NextResponse.json(
        { error: "LICENSE_KEY belum diatur di environment." },
        { status: 500 }
      );
    }

    // API baru: POST /api/generate/v2/qris
    const payload = {
      qr_id: body.qr_id || qrId,
      amount: Number(body.amount),
      useUniqueCode: body.useUniqueCode ?? true,
      packageIds: Array.isArray(body.packageIds) ? body.packageIds : ["id.dana"],
      expiredInMinutes: body.expiredInMinutes ?? 15,
      qrType: body.qrType || "dynamic",
      paymentMethod: body.paymentMethod || "qris",
      useQris: body.useQris ?? true,
      ...(body.prefix ? { prefix: String(body.prefix).slice(0, 8) } : {}),
    };

    if (!payload.qr_id) {
      return NextResponse.json({ error: "ID_QRIS belum diatur." }, { status: 400 });
    }

    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      return NextResponse.json({ error: "amount harus lebih besar dari 0." }, { status: 400 });
    }

    const res = await fetch(`${API_BASE}/v2/qris`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-license-key": licenseKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || "Response API tidak valid." };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal membuat QRIS." },
      { status: 500 }
    );
  }
}
