// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import "dotenv/config";
import jwt from "jsonwebtoken";

// I M P O R T:  E N V  O P T I O N S
import { JWT_KEY, JWT_EXPIRATION, BE_HOST } from "../../config/config.js";

//========================

// C R E A T E   J W T   V E R I F Y   T O K E N

export const createVerifyToken = (newUser, createdUser) => {
  const jwtToken = jwt.sign(
    { email: newUser.email, _id: createdUser._id },
    JWT_KEY,
    { expiresIn: JWT_EXPIRATION }
  );
  return jwtToken;
};

// C O N T E N T
export const MAIL_SUBJECT = `Bitte bestätigen Sie Ihre E-Mail-Adresse | Please verify your email address`;

export const generateMailHtml = (newUser, verifyToken) => `
<!DOCTYPE html>
<html>
<head>
    <title>Account Verifizierung / Account Verification</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #333;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #007BFF;
            font-size: 24px;
        }
        .content {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
        }
        .content p {
            margin-bottom: 10px;
        }
        .content a {
            color: #007BFF;
            text-decoration: none;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
          <h1>Account Verifizierung / Account Verification</h1>
        </div>
        <div class="content">
          <p>Hallo ${newUser.firstName} ${newUser.lastName},</p>
          <p>Vielen Dank, dass Sie sich für unseren Service registriert haben. Um Ihren Account zu verifizieren, klicken Sie bitte auf den Link am Ende dieser E-Mail.</p>
          <p>Wenn Sie diesen E-Mail-Link nicht angefordert haben, ignorieren Sie bitte diese E-Mail.</p>
          <p>Vielen Dank und herzlich willkommen bei uns!</p>
          <p>Mit freundlichen Grüßen,</p>
          <p>Ihr Team</p>
        </div>

        <hr>

        <div class="content">
          <p>Hello ${newUser.firstName} ${newUser.lastName},</p>
          <p>Thank you for registering with our service. To verify your account, please click on the link at the bottom of this email.</p>
          <p>If you did not request this email link, please ignore this email.</p>
          <p>Thank you and welcome to us!</p>
          <p>Best regards,</p>
          <p>Your Team</p>
        </div>

        <hr>

        <div class="content">
          <p><a href="${BE_HOST}users/verify/${verifyToken}">Klicken Sie hier, um Ihren Account zu verifizieren | Click here to verify your account</a></p>
        </div>
    </div>
</body>
</html>
`;