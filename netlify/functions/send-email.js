require("dotenv").config();
const { Resend } = require("resend");
const { convert } = require("html-to-text");

exports.handler = async (event) => {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    };

    switch (event.httpMethod) {
      case "POST":
        const { email, phone, company, position, profile, message, name } =
          JSON.parse(event.body).contact;

        const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Message from ${name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.2;
              }
              
              p {
                margin-bottom: 5px;
              }
              
              .content {
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="content">
              <p>Email:</p>
              <p>${email}</p>
            </div>
            <div class="content">
              <p>Telephone:</p>
              <p>${phone}</p>
            </div>
            <div class="content">
              <p>Company:</p>
              <p>${company}</p>
            </div>
            <div class="content">
              <p>Position:</p>
              <p>${position}</p>
            </div>
            <div class="content">
              <p>Profile:</p>
              <p>${profile}</p>
            </div>
            <div class="content">
              <p>Message:</p>
              <p>${message}</p>
            </div>
          </body>
        </html>                
    `;
        const htmltotext = convert(html);

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: process.env.EMAIL_TO,
          subject: "Message from " + name,
          html: html,
          text: htmltotext,
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: "Email sent!",
          }),
        };

      case "OPTIONS":
        return {
          statusCode: 200,
          headers,
          body: "This was a preflight call!",
        };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Opsss... Something went wrong " + error,
      }),
    };
  }
};
