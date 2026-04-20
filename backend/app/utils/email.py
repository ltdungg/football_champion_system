import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_reset_password_email(email_to: str, token: str):
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    subject = "Password Reset - Football Championship System"
    body = f"""
    <p>We received a request to reset your password.</p>
    <p>Please click the link below to reset your password:</p>
    <p><a href="{reset_link}">{reset_link}</a></p>
    <p>If you did not request this, please ignore this email.</p>
    """
    
    if not settings.SMTP_HOST or not settings.SMTP_PORT:
        # Fallback to local console log if SMTP is not configured
        print("\n" + "="*50)
        print(f"DUMMY EMAIL SENT TO: {email_to}")
        print(f"SUBJECT: {subject}")
        print(f"RESET LINK: {reset_link}")
        print("="*50 + "\n")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        msg['To'] = email_to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        if settings.SMTP_TLS:
            server.starttls()
        
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
