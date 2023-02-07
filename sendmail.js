const nodemailer=require('nodemailer');

const sendMail=async (email,msg)=>{
    let testAccount=await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'erik32@ethereal.email',
            pass: 'Xch7JmqH9s87jRyKBQ'
        }
    });

    let mailDetails = {
        from: 'supreet7111999@gmail.com',
        to: email,
        subject: 'Test mail',
        text: msg
    };

    let info=await transporter.sendMail(mailDetails);
    // res.json(info);
}

module.exports=sendMail;