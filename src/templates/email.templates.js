const baseUrl = process.env.FRONT_END_URL || 'http://localhost:3000';
const appName = process.env.APP_NAME || 'Quizento'

const layout = (content) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:8px; overflow:hidden; }
    .header  { background:#1a1a2e; padding:24px 32px; }
    .header h1 { color:#fff; margin:0; font-size:20px; font-weight:600; }
    .body    { padding:32px; color:#333; line-height:1.6; }
    .body h2 { font-size:18px; color:#1a1a2e; margin:0 0 16px; }
    .body p  { margin:0 0 14px; font-size:15px; }
    .btn     { display:inline-block; padding:12px 28px; background:#4f46e5; color:#fff !important;
               text-decoration:none; border-radius:6px; font-size:15px; font-weight:500; margin:8px 0 16px; }
    .info-box { background:#f8f8ff; border-left:3px solid #4f46e5; padding:14px 18px;
                border-radius:0 6px 6px 0; margin:16px 0; font-size:14px; }
    .info-box strong { color:#1a1a2e; }
    .footer  { background:#f5f5f5; padding:20px 32px; text-align:center;
               font-size:12px; color:#888; border-top:1px solid #eee; }
    .tag     { display:inline-block; padding:2px 10px; border-radius:20px;
               font-size:12px; font-weight:500; }
    .tag.green  { background:#e6f9f0; color:#0f6e56; }
    .tag.red    { background:#fef2f2; color:#a32d2d; }
    .tag.blue   { background:#eff6ff; color:#1d4ed8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>${appName}</h1></div>
    <div class="body">${content}</div>
    <div class="footer">
      ${new Date().getFullYear()} ${appName} · Bạn nhận email này vì đã đăng ký tài khoản.
    </div>
  </div>
</body>
</html>
`;

// Xác nhận đăng ký tài khoản
const verifyEmail = ({ name, token }) => ({
    subject: 'Xác nhận địa chỉ email của bạn',
    html: layout(`
        <h2>Xin chào ${name}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Nhấn nút bên dưới để xác nhận email:</p>
        <a href="${baseUrl}/verify-email?token=${token}" class="btn">Xác nhận email</a>
        <p style="font-size:13px; color:#888;">Link có hiệu lực trong <strong>24 giờ</strong>. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
    `),
});

//Đặt lại mật khẩu
const resetPassword = ({ name, token }) => ({
    subject: 'Đặt lại mật khẩu',
    html: layout(`
        <h2>Đặt lại mật khẩu</h2>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn nút bên dưới:</p>
        <a href="${baseUrl}/reset-password/${token}" class="btn">Đặt lại mật khẩu</a>
        <p style="font-size:13px; color:#888;">Link có hiệu lực trong <strong>15 phút</strong>. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `),
});

module.exports = {
    verifyEmail,
    resetPassword,
};