# Cashify Example Next.js — API v2

Project ini memakai UI/struktur dari contoh Cashify, tetapi integrasinya sudah disesuaikan dengan **dokumentasi API terbaru**, bukan endpoint dokumentasi lama.

## Environment

Salin `.env.example` menjadi `.env.local`:

```env
NEXT_PUBLIC_API_BASE=https://cashify.my.id/api/generate
LICENSE_KEY=cashify_xxxx
ID_QRIS=
```

Isi `ID_QRIS` dengan UUID QRIS merchant.

## Endpoint yang digunakan

Generate:
`POST /api/generate/v2/qris`

Check status:
`POST /api/generate/check-status`

Frontend memanggil route Next.js lokal (`/api/qris` dan `/api/check-status`), lalu server meneruskan request dengan `x-license-key`. License key tidak dikirim dari browser.

## Parameter Generate v2

Request memakai:
- `qr_id`
- `amount`
- `useUniqueCode`
- `packageIds`
- `expiredInMinutes`
- `qrType`
- `paymentMethod`
- `useQris`
- `prefix`

Nilai default di halaman:
- `qrType: "dynamic"`
- `paymentMethod: "qris"`
- `useQris: true`
- `useUniqueCode: true`
- `expiredInMinutes: 15`
- `packageIds: ["id.dana"]`
- `prefix: "CSK"`

Polling status berjalan setiap 5 detik.

## Jalankan

```bash
npm install
npm run dev
```



## Endpoint pembatalan transaksi
Fitur **Batalkan Pembayaran** menggunakan `POST /api/generate/cancel-status` melalui route internal `/api/cancel-status`. `LICENSE_KEY` tetap diproses di server sehingga tidak dikirim dari browser.
