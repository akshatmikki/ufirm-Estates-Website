import formidable from "formidable";
import nodemailer from "nodemailer";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const form = new formidable.IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ message: "Form parsing failed." });
        }

        const { name, email } = fields;
        const file = files.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.CONTACT_RECEIVER_EMAIL,
            subject: "Resume Submission - General",
            text: `Resume submitted by ${name} (${email})`,
            attachments: [
                {
                    filename: file.originalFilename,
                    path: file.filepath,
                },
            ],
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Email sent!" });
        } catch (error) {
            console.error("Error sending mail:", error);
            return res.status(500).json({ message: "Failed to send email." });
        }
    });
}
