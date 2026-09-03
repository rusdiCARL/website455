import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://cashify.my.id/api/generate";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.transactionId) {
      return NextResponse.json({ error: "transactionId wajib diisi." }, { status: 400 });
    }

    const licenseKey = process.env.LICENSE_KEY;
    if (!licenseKey) {
      return NextResponse.json({ error: "LICENSE_KEY belum diatur di environment." }, { status: 500 });
    }

    const res = await fetch(`${API_BASE}/cancel-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-license-key": licenseKey,
      },
      body: JSON.stringify({ transactionId: body.transactionId }),
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); }
    catch { data = { error: text || "Response API tidak valid." }; }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal membatalkan transaksi." }, { status: 500 });
  }
}
