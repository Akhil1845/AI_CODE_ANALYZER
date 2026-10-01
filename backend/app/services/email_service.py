import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.request
import json
import logging
from app.config import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
    RESEND_API_KEY
)

logger = logging.getLogger(__name__)

def send_verification_email(to_email: str, code: str) -> dict:
    """
    Dispatches a cryptographically secure 6-digit OTP verification code
    directly to the user's real email address.
    """
    subject = "CodeLens AI - Identity Verification Code"
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Security Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="520px" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 36px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          <tr>
            <td>
              <!-- Brand Header -->
              <div style="font-size: 22px; font-weight: 900; letter-spacing: -0.02em; color: #ec4899; margin-bottom: 24px;">
                CodeLens<span style="color: #6366f1;">.AI</span>
              </div>
              
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 800; color: #ffffff;">Password Reset Verification</h2>
              <p style="margin: 0 0 24px; font-size: 14.5px; line-height: 1.6; color: #94a3b8;">
                We received a request to reset the password for your CodeLens AI account (<strong style="color: #f1f5f9;">{to_email}</strong>). 
                Enter the following single-use verification code to authorize this action:
              </p>
              
              <!-- 6-Digit OTP Box -->
              <div style="background-color: #04060f; border: 1px solid #334155; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #38bdf8;">
                  {code}
                </span>
              </div>
              
              <p style="margin: 0 0 20px; font-size: 13px; color: #64748b; line-height: 1.5;">
                This code is valid for <strong>10 minutes</strong> and can only be used once. Never share this code with anyone.
              </p>
              
              <hr style="border: none; border-top: 1px solid #1f2937; margin: 24px 0;" />
              
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                <strong>Did not request this?</strong> If you did not initiate this password reset, please ignore this email. Your password remains unchanged and secure.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    text_content = f"""CodeLens AI - Password Reset Verification Code

We received a request to reset the password for your account: {to_email}

Your 6-Digit Security Verification Code is:
{code}

This code will expire in 10 minutes and can only be used once.

If you did not request a password reset, please ignore this email. Your account remains secure.
"""

    # 1. Attempt sending via Resend API if API Key is configured
    if RESEND_API_KEY:
        try:
            req_data = json.dumps({
                "from": SMTP_FROM or "CodeLens AI <security@codelens.ai>",
                "to": [to_email],
                "subject": subject,
                "html": html_content,
                "text": text_content
            }).encode("utf-8")
            
            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                    "User-Agent": "CodeLens-AI/1.0"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in (200, 201):
                    print(f"[EMAIL_SERVICE] Dispatched real verification email to {to_email} via Resend API.")
                    return {"sent": True, "provider": "resend"}
        except Exception as e:
            print(f"[EMAIL_SERVICE WARNING] Resend API delivery failed: {e}. Falling back to SMTP...")

    # 2. Attempt sending via Real SMTP (e.g. Gmail / Outlook / Custom SMTP)
    if SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SMTP_FROM or f"CodeLens AI <{SMTP_USER}>"
            msg["To"] = to_email

            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)

            print(f"[EMAIL_SERVICE] Dispatched real verification email to {to_email} via SMTP ({SMTP_HOST}).")
            return {"sent": True, "provider": "smtp"}
        except Exception as e:
            print(f"[EMAIL_SERVICE ERROR] SMTP delivery failed to {to_email}: {e}")
            return {"sent": False, "error": str(e)}

    # 3. Neither SMTP nor Resend credentials are configured in backend/.env yet
    print(f"[EMAIL_SERVICE NOTICE] Real email could not be delivered to {to_email} because SMTP_USER/SMTP_PASSWORD or RESEND_API_KEY is not configured in backend/.env.")
    return {
        "sent": False,
        "error": "Email dispatch service credentials not configured in backend/.env. Please configure SMTP_USER/SMTP_PASSWORD or RESEND_API_KEY."
    }
