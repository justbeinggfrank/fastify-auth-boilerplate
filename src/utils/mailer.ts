import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, 
    },
});

export async function sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) {
    return transporter.sendMail({
        from: process.env.GMAIL_USER,
        ...options,
    });
}