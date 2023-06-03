require("dotenv").config();
const { Resend} = require('resend');
const {convert} = require('html-to-text');

exports.handler = async (event) => {
  try {
    const {email, phone, company, position, profile, message, name} = JSON.parse(event.body).contact;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Message from ${name}</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5">
          <p style="font-weight: bold">Email:</p>
          <p>${email}</p>
          <p style="font-weight: bold">Telephone:</p>
          <p>${phone}</p>
          <p style="font-weight: bold">Company:</p>
          <p>${company}</p>
          <p style="font-weight: bold">Position:</p>
          <p>${position}</p>
          <p style="font-weight: bold">Profile:</p>
          <p>${profile}</p>
          <p style="font-weight: bold">Message:</p>
          <p>${message}</p>
        </div>
      </body>
    </html>
    `
    const htmltotext = convert(html)

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'Message from ' + name,
      html: html,
      text: htmltotext
    });

    return { statusCode: 200,  headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },  body: JSON.stringify({'message': 'Email sent!'})}
    
  } catch (error) {
    console.log(error)
    return {
        statusCode: 400,
      body: JSON.stringify({'error': 'Opsss... Something went wrong ' + error})
    }
  }
}