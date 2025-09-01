interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@feminafit.com';
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // In a real implementation, you would use a service like SendGrid, Mailgun, or similar
      // For now, we'll log the email content
      console.log('Email would be sent:', {
        from: this.fromEmail,
        to: data.to,
        subject: data.subject,
        html: data.html
      });
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Welcome to FeminaFit!</h1>
        <p>Hi ${userName},</p>
        <p>Welcome to our sisterhood! We're excited to have you join our community of strong, confident women.</p>
        <p>Your fitness journey starts now. We can't wait to see you at the gym!</p>
        <p>Best regards,<br>The FeminaFit Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: 'Welcome to FeminaFit!',
      html,
      text: `Welcome to FeminaFit! Hi ${userName}, we're excited to have you join our community.`
    });
  }

  async sendOrderConfirmation(userEmail: string, orderDetails: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Order Confirmation</h1>
        <p>Thank you for your order! Your order #${orderDetails.id} has been confirmed.</p>
        <p>Total: KES ${orderDetails.total}</p>
        <p>We'll notify you when your order ships.</p>
        <p>Best regards,<br>The FeminaFit Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: `Order Confirmation #${orderDetails.id}`,
      html
    });
  }

  async sendPaymentConfirmation(userEmail: string, paymentDetails: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Payment Confirmed</h1>
        <p>Your payment of KES ${paymentDetails.amount} has been successfully processed.</p>
        <p>Transaction ID: ${paymentDetails.transactionId}</p>
        <p>Thank you for choosing FeminaFit!</p>
        <p>Best regards,<br>The FeminaFit Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: 'Payment Confirmation - FeminaFit',
      html
    });
  }
}

export const emailService = new EmailService();
