import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripePaymentRequestButtonElement } from '@stripe/stripe-js';

export interface PaymentIntent {
  client_secret: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentIntentId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentRequestButton: StripePaymentRequestButtonElement | null = null;

  // You'll need to replace this with your actual Stripe publishable key
  private readonly stripePublishableKey = 'pk_test_your_stripe_publishable_key_here';

  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe(): Promise<void> {
    this.stripe = await loadStripe(this.stripePublishableKey);
    
    if (this.stripe) {
      this.initializeApplePay();
    }
  }

  /**
   * Initialize Apple Pay if available
   */
  private initializeApplePay(): void {
    if (!this.stripe) return;

    // Create payment request for Apple Pay
    const paymentRequest = this.stripe.paymentRequest({
      country: 'IL',
      currency: 'ils',
      total: {
        label: 'שיעור ניסיון - סטודיו יערה',
        amount: 5000, // Amount in agorot (50 ILS = 5000 agorot)
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if Apple Pay is available
    paymentRequest.canMakePayment().then((result) => {
      if (result && result['applePay']) {
        // Apple Pay is available
        console.log('Apple Pay is available');
      }
    });

    // Handle payment method change
    paymentRequest.on('paymentmethod', async (event) => {
      // Confirm the payment with Stripe
      const { error } = await this.stripe!.confirmCardPayment(
        '', // You'll need to get this from your backend
        {
          payment_method: event.paymentMethod.id,
        }
      );

      if (error) {
        // Show error to customer
        event.complete('fail');
        console.error('Payment failed:', error);
      } else {
        // Payment succeeded
        event.complete('success');
        console.log('Payment succeeded');
      }
    });

    // Create the payment request button
    this.paymentRequestButton = this.stripe.elements().create('paymentRequestButton', {
      paymentRequest,
      style: {
        paymentRequestButton: {
          type: 'default',
          theme: 'dark',
          height: '48px',
        },
      },
    });
  }

  /**
   * Check if Apple Pay is available
   */
  async isApplePayAvailable(): Promise<boolean> {
    if (!this.stripe) return false;

    const paymentRequest = this.stripe.paymentRequest({
      country: 'IL',
      currency: 'ils',
      total: {
        label: 'Test',
        amount: 100,
      },
    });

    const result = await paymentRequest.canMakePayment();
    return !!(result && result['applePay']);
  }

  /**
   * Mount Apple Pay button to a container element
   */
  async mountApplePayButton(containerElement: HTMLElement): Promise<void> {
    if (!this.paymentRequestButton) {
      console.error('Apple Pay button not initialized');
      return;
    }

    this.paymentRequestButton.mount(containerElement);
  }

  /**
   * Create payment intent for credit card payment
   * In a real implementation, this would call your backend
   */
  async createPaymentIntent(amount: number, currency: string = 'ils'): Promise<PaymentIntent> {
    // This is a mock implementation
    // In reality, you'd call your backend API here
    const mockPaymentIntent: PaymentIntent = {
      client_secret: 'pi_test_mock_client_secret',
      amount: amount,
      currency: currency
    };

    return mockPaymentIntent;
  }

  /**
   * Confirm payment with credit card
   */
  async confirmCardPayment(
    clientSecret: string,
    cardElement: any,
    billingDetails?: any
  ): Promise<PaymentResult> {
    if (!this.stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails || {},
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: paymentIntent?.status === 'succeeded',
        paymentIntentId: paymentIntent?.id,
      };
    } catch (error) {
      return { success: false, error: 'Payment confirmation failed' };
    }
  }

  /**
   * Get Stripe instance
   */
  getStripe(): Stripe | null {
    return this.stripe;
  }

  /**
   * Create elements for credit card form
   */
  createElements(): StripeElements | null {
    if (!this.stripe) return null;
    
    this.elements = this.stripe.elements({
      locale: 'he', // Hebrew locale
    });

    return this.elements;
  }

  /**
   * Get elements instance
   */
  getElements(): StripeElements | null {
    return this.elements;
  }
}
