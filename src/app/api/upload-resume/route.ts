// app/api/upload-resume/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const mobile = formData.get("mobile")?.toString() || "";

    if (!file || !name || !email || !mobile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Collect extra job info (if any)
    const jobInfo: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (!["file", "name", "email", "mobile"].includes(key)) {
        jobInfo[key] = value.toString();
      }
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Optional: verify transporter connection
    await transporter.verify();

    // Build email body
    const emailText = `
      New resume submission:

      Name: ${name}
      Email: ${email}
      Mobile: ${mobile}

      ${Object.keys(jobInfo).length > 0 ? "Job Info:\n" : ""}
      ${Object.entries(jobInfo)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME, // safer than spoofing applicant email
      replyTo: email, // this way you can reply directly to applicant
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: "Resume Submission - UFirm Careers",
      text: emailText,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    });

    return NextResponse.json({ message: "Email sent!" }, { status: 200 });
  } catch (err) {
    console.error("Error sending resume:", err);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
