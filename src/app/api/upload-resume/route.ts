import {  NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();

  if (!file || !email || !name) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: email,
    to: process.env.CONTACT_RECEIVER_EMAIL,
    subject: "Resume Submission - General",
    text: `Resume submitted by ${name} (${email})`,
    attachments: [
      {
        filename: file.name,
        content: buffer,
      },
    ],
  });

  return NextResponse.json({ message: "Email sent!" }, { status: 200 });
}
