import * as nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, code: string) {
        let transporter = nodemailer.createTransport({
            service: 'Mail.ru',
            auth: {
                user: "nikolaaj@mail.ru",
                pass: "XaehQyUMvQS2a70AZhUH" // Пароль приложения
            }
        })

        let mailOptions = await transporter.sendMail({
            from: '"Mikalai" <nikolaaj@gmail.ru>',
            to: email,
            subject: "Confirmation email.",
            html: ` <h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                    </p>`
        })
        return mailOptions.accepted.length > 0
    }
}