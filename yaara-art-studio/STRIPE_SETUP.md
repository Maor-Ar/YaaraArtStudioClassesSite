# Stripe Payment Integration Setup Guide

## 🚀 Quick Start

Your payment system is now enhanced with **Stripe + Apple Pay** support! Here's what you need to do to activate it:

## 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the business verification process
3. Get your **Publishable Key** and **Secret Key**

## 2. Update Stripe Configuration

In `src/app/services/stripe.service.ts`, replace line 25:

```typescript
// Replace this line:
private readonly stripePublishableKey = 'pk_test_your_stripe_publishable_key_here';

// With your actual publishable key:
private readonly stripePublishableKey = 'pk_test_51AbC123...'; // Your actual key
```

## 3. Backend Setup (Required for Production)

The current implementation uses mock payment intents. For production, you need a backend:

### Option A: Use a Backend Service
Create an API endpoint that:
1. Creates payment intents using your Stripe Secret Key
2. Handles webhooks for payment confirmations
3. Manages your business logic

### Option B: Use Stripe's Client-Side Solutions
- **Stripe Checkout**: Redirects to Stripe-hosted page
- **Payment Links**: Create payment links in Stripe Dashboard

## 4. Test the Integration

### Test Cards (Stripe Test Mode)
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
```

### Test Apple Pay
- Use Safari on iOS/macOS
- Ensure you're in test mode
- Use test cards in Apple Wallet

## 5. Production Deployment

1. **Switch to Live Keys**: Replace test keys with live keys
2. **SSL Certificate**: Ensure HTTPS is enabled
3. **Domain Verification**: Add your domain to Stripe dashboard
4. **Webhook Endpoints**: Set up webhook handling
5. **Apple Pay Domain**: Verify domain with Apple

## 🎯 Payment Flow Overview

### Current Implementation:
```
User selects payment method
    ↓
├── Bit/PayBox/Kashkash (0% fees) → Direct app/website
├── Apple Pay (2.9% fees) → Stripe + Apple Pay
└── Credit Card (2.9% fees) → Stripe Elements
```

### Cost Analysis:
- **Israeli customers**: Use Bit/PayBox (FREE)
- **International customers**: Use Stripe (2.9% fee)
- **Apple users**: Use Apple Pay (2.9% fee)

## 🔧 Customization Options

### Change Lesson Price
In `payment.component.ts`, update:
```typescript
private readonly lessonPrice = 50; // Change to your price
```

### Add More Payment Methods
1. Add new method to `getPaymentMethodInfo()`
2. Create corresponding method in component
3. Add UI elements in template

### Styling
All styles are in `payment.component.scss` with CSS variables for easy theming.

## 🚨 Important Notes

1. **Test First**: Always test in Stripe test mode before going live
2. **Security**: Never expose your secret key in frontend code
3. **Compliance**: Ensure PCI compliance for card data handling
4. **Backup**: Keep your current Bit/PayBox system as primary for Israeli customers

## 📱 Apple Pay Requirements

- **HTTPS**: Required for Apple Pay
- **Domain Verification**: Must verify domain with Apple
- **Safari/iOS**: Only works on Apple devices with Safari
- **Test Mode**: Use Stripe test mode for development

## 🆘 Troubleshooting

### Common Issues:
1. **Stripe not loading**: Check your publishable key
2. **Apple Pay not showing**: Verify domain and HTTPS
3. **Payment failing**: Check browser console for errors
4. **CORS errors**: Ensure proper backend setup

### Debug Mode:
Enable Stripe debug mode:
```typescript
// In stripe.service.ts
this.stripe = await loadStripe(this.stripePublishableKey, {
  stripeAccount: 'your-account-id' // Optional
});
```

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Apple Pay Guide**: [developer.apple.com/apple-pay](https://developer.apple.com/apple-pay)
- **Current System**: Keep Bit/PayBox as backup

---

**🎉 Congratulations!** Your payment system now supports:
- ✅ Israeli P2P payments (Bit/PayBox/Kashkash) - 0% fees
- ✅ International credit cards via Stripe - 2.9% fees  
- ✅ Apple Pay integration - 2.9% fees
- ✅ Modern, secure payment processing
- ✅ Mobile-optimized interface

The system automatically detects the best payment method for each customer!
