import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'oatsakagusi@gmail.com', // Replace with your email
        pass: 'boqw bile lhxb xoeo', // Replace with your email password or app-specific password
    }
})

// html: `  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f6f6f6;">
// <h1 style="text-align: center;">${SiteName}</h1>
// <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px;">
// <h2 style="color: #333;">Dear ${username},</h2>
// <p>To reset your password go to this address in your browser:</p>
// <a href="${resetLink}" style="background-color: #ffba00; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">RESET LINK</a>
// <p style="margin-top: 20px;">Thank you.</p>
// <hr style="border: none; border-top: 1px solid #eee;">
// <p style="font-size: 12px;">*Note if you did not request to reset your password, please email Support: <br /> <a href="mailto:${adminMail}" style="color: #ffba00;">oattydev@oattydev.online</a>*</p>
// </div>

// <div style="text-align: center; margin: 24px 0; opacity: .7;">
//     <a href="${fbURL}" style="width: 36px; height: 36px; padding: 6px; border-radius: 12px; margin: 0 6px; background: rgba(0, 0, 0, .1); display: inline-block; vertical-align: top;"> <img src="${assetsURL}/facebook.png" alt="Oatty Dev" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer"></a>
//     <a href="${igURL}" style="width: 36px; height: 36px; padding: 6px; border-radius: 12px; margin: 0 6px; background: rgba(0, 0, 0, .1); display: inline-block; vertical-align: top;"> <img src="${assetsURL}/instrgram.png" alt="Oatty Dev" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer"></a>
//     <a href="${xURL}" style="width: 36px; height: 36px; padding: 6px; border-radius: 12px; margin: 0 6px; background: rgba(0, 0, 0, .1); display: inline-block; vertical-align: top;"> <img src="${assetsURL}/x.png" alt="Oatty Dev" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer"></a>
//     <a href="${ytURL}" style="width: 36px; height: 36px; padding: 6px; border-radius: 12px; margin: 0 6px; background: rgba(0, 0, 0, .1); display: inline-block; vertical-align: top;"> <img src="${assetsURL}/youtube.png" alt="Oatty Dev" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer"></a>
// </div>

// <div style="text-align: center; margin: 24px 0;">
//     <p>
//     <a href="https://google.com">
//         Terms of Use
//     </a>
//     " & "
//     <a href="https://google.com">
//         Privacy Policy
//     </a>
//     </p>
// </div>
// </div>`

export const sendPasswordResetEmail = (to,username, token) => {
    const domain = 'http://localhost:5173'
    const adminMail = 'oattydev@oattydev.online'
    const assetsURL = 'https://oattydev.online/assets/logo'
    const resetLink = `${domain}/reset-password?token=${token}`
    // const resetLink = `${domain}/reset-password`
    const fbURL = 'https://www.facebook.com/oattydev'
    const igURL = 'https://www.instagram.com/userjooooooo/'
    const xURL = 'https://www.facebook.com/oattydev'
    const ytURL = 'https://www.youtube.com/@kyoroz3416'
    const SiteName = 'OattyDev'
    const termURL = 'https://google.com'
    const privacyURL = 'https://google.com'

    console.log(`Sending email to:`, to);

    const mailOptions = {
        from: 'oatsakagusi@gmail.com',
        to,
        subject: 'Password Reset',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">${SiteName}</h2>
          <div style="background-color: #f6f6f6; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #333;">Dear ${username},</h3>
            <p>To reset your password go to this address in your browser:</p>
            <a href="${resetLink}" style="background-color: #ffba00; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px 0;">RESET LINK</a>
            <p>Thank you.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">*Note if you did not request to reset your password, please email Support: <br /> 
            <a href="mailto:${adminMail}" style="color: #ffba00;">${adminMail}</a>*</p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${fbURL}" style="display: inline-block; margin: 0 6px;"><img src="${assetsURL}/facebook.png" alt="Facebook" style="width: 36px; height: 36px;"></a>
            <a href="${igURL}" style="display: inline-block; margin: 0 6px;"><img src="${assetsURL}/instrgram.png" alt="Instagram" style="width: 36px; height: 36px;"></a>
            <a href="${xURL}" style="display: inline-block; margin: 0 6px;"><img src="${assetsURL}/x.png" alt="Twitter" style="width: 36px; height: 36px;"></a>
            <a href="${ytURL}" style="display: inline-block; margin: 0 6px;"><img src="${assetsURL}/youtube.png" alt="YouTube" style="width: 36px; height: 36px;"></a>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
            <a href="${termURL}" style="color: #666; text-decoration: none;">Terms of Use</a> & <a href="${privacyURL}" style="color: #666; text-decoration: none;">Privacy Policy</a>
          </div>
          <div style="text-align: center; opacity: .5;">
           <p> <span style="font-weight: bold;">OattyDev Co., Ltd. </span> (1234567-T) <br />
            123, Sukhumvit Road, Watthana District, 10110 Bangkok, Thailand.</p>
          </div>
        </div>
      `
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Error sending email:', err);
                reject(false);
            } else {
                console.log('Email sent:', info.response);
                resolve(true);
            }
        });
    });
}