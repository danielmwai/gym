import axios from 'axios';

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc?: string;
}

interface STKPushResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

class MpesaService {
  private consumerKey: string;
  private consumerSecret: string;
  private businessShortCode: string;
  private passKey: string;
  private callbackUrl: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || '';
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
    this.businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE || '174379';
    this.passKey = process.env.MPESA_PASS_KEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    this.callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://example.com/api/mpesa/callback';
    this.environment = (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
  }

  private getBaseUrl(): string {
    return this.environment === 'sandbox' 
      ? 'https://sandbox.safaricom.co.ke' 
      : 'https://api.safaricom.co.ke';
  }

  private formatPhoneNumber(phoneNumber: string): string {
    let formatted = phoneNumber.replace(/\D/g, '');
    
    if (formatted.startsWith('0')) {
      formatted = `254${formatted.slice(1)}`;
    } else if (formatted.startsWith('254')) {
      // Already formatted
    } else if (formatted.startsWith('+254')) {
      formatted = formatted.slice(1);
    } else {
      formatted = `254${formatted}`;
    }
    
    return formatted;
  }

  private generateTimestamp(): string {
    return new Date().toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3);
  }

  private generatePassword(timestamp: string): string {
    return Buffer.from(
      `${this.businessShortCode}${this.passKey}${timestamp}`
    ).toString('base64');
  }

  async generateAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString('base64');

    const response = await axios.get(
      `${this.getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );

    return response.data.access_token;
  }

  async initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
    try {
      const accessToken = await this.generateAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const formattedPhone = this.formatPhoneNumber(request.phoneNumber);

      const stkPushData = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount),
        PartyA: formattedPhone,
        PartyB: this.businessShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDesc || 'Payment for FeminaFit services'
      };

      const response = await axios.post(
        `${this.getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
        stkPushData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: 'STK push sent successfully',
        data: response.data
      };

    } catch (error: any) {
      console.error('STK Push Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'STK push failed',
        error: error.response?.data || error.message
      };
    }
  }

  async queryTransactionStatus(checkoutRequestId: string): Promise<any> {
    try {
      const accessToken = await this.generateAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const queryData = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.getBaseUrl()}/mpesa/stkpushquery/v1/query`,
        queryData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Transaction Query Error:', error.response?.data || error.message);
      throw error;
    }
  }

  processCallback(callbackData: any) {
    const { Body } = callbackData;
    
    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const metadata = Body.stkCallback.CallbackMetadata.Item;
      return {
        success: true,
        transactionId: metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value,
        amount: metadata.find((item: any) => item.Name === 'Amount')?.Value,
        phoneNumber: metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value,
        transactionDate: metadata.find((item: any) => item.Name === 'TransactionDate')?.Value,
        checkoutRequestId: Body.stkCallback.CheckoutRequestID
      };
    } else {
      // Payment failed
      return {
        success: false,
        resultDesc: Body.stkCallback.ResultDesc,
        checkoutRequestId: Body.stkCallback.CheckoutRequestID
      };
    }
  }
}

export const mpesaService = new MpesaService();
