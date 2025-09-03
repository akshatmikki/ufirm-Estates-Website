// app/api/upload-image/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: Request) => {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save to /public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filePath = path.join(uploadsDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Return public URL
    const url = `/uploads/${file.name}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
};
