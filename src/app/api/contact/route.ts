import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, category, message, receiveComm } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: `"UFIRM Website" <${process.env.EMAIL_USERNAME}>`,
            to: process.env.CONTACT_RECEIVER_EMAIL,
            subject: `New Contact Request - ${category || 'General'}`,
            html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <p><strong>Receive Communication:</strong> ${receiveComm ? 'Yes' : 'No'}</p>
      `,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json({ success: false, message: 'Email failed to send' }, { status: 500 });
    }
}
