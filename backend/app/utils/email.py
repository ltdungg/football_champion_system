import resend
from app.core.config import settings


def send_reset_password_email(email_to: str, token: str):
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    subject = "Password Reset - Football Championship System"
    body = f"""
    <p>We received a request to reset your password.</p>
    <p>Please click the link below to reset your password:</p>
    <p><a href="{reset_link}">{reset_link}</a></p>
    <p>This link will expire in 15 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    """

    # Fallback: print to console if Resend API key not configured
    if not settings.RESEND_API_KEY:
        print("\n" + "=" * 50)
        print(f"[DEV] DUMMY EMAIL SENT TO: {email_to}")
        print(f"[DEV] SUBJECT: {subject}")
        print(f"[DEV] RESET LINK: {reset_link}")
        print("=" * 50 + "\n")
        return True

    try:
        resend.api_key = settings.RESEND_API_KEY

        params: resend.Emails.SendParams = {
            "from": f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>",
            "to": [email_to],
            "subject": subject,
            "html": body,
        }

        email = resend.Emails.send(params)
        print(f"Email sent successfully. ID: {email['id']}")
        return True

    except Exception as e:
        print(f"Failed to send email via Resend: {e}")
        return False
