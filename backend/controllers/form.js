import sgMail from '@sendgrid/mail'; // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const contactForm = (req, res) => {
    const {email, name, message} = req.body;
    // console.log(req.body) // test

    const emailData = {
        to: `${email}`,
        from: `${process.env.EMAIL_FROM}`,
        subject: `Contact form - ${process.env.APP_NAME}`,
        text: `
            Email received from contact form \n
            Receiver name: ${name} \n
            Receiver email: ${email} \n
            Sender name: ${process.env.APP_NAME} \n
            Sender email: ${process.env.EMAIL_FROM} \n
            Sender message: ${message}
        `,
        html: `
            <h4>Email received from contact form: </h4>
            <p>Receiver name: ${name}</p>
            <p>Receiver email: ${email}</p>
            <p>Sender name: ${process.env.APP_NAME}</p>
            <p>Sender email: ${process.env.EMAIL_FROM}</p>
            <p>Sender message: ${message}</p>
            <hr/>
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
    };

    sgMail.send(emailData).then(sent => {
        return res.json({
            success: true
        });
    });
};
