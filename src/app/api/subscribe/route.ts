import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SUBSCRIBE_RECEIVER || process.env.SMTP_USER, 
            subject: 'New Subscription Request',
            html: `<p>New user subscribed with email: <strong>${email}</strong></p>`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mail send error:", error);
        return NextResponse.json({ success: false, message: 'Failed to send email.' }, { status: 500 });
    }
}
