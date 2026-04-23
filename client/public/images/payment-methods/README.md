# Payment Method Images

Add your payment method images to this folder. The Payments component expects the following files:

## Required Images

1. **credit-card.png** - Credit Card payment method
   - Recommended size: 128x128 or 256x256 pixels
   - Will display at 64x64 pixels
   - Format: PNG with transparent background

2. **debit-card.png** - Debit Card payment method
   - Recommended size: 128x128 or 256x256 pixels
   - Will display at 64x64 pixels
   - Format: PNG with transparent background

3. **esewa.png** - eSewa wallet payment method
   - Recommended size: 128x128 or 256x256 pixels
   - Will display at 64x64 pixels
   - Format: PNG with transparent background

4. **khalti.png** - Khalti wallet payment method
   - Recommended size: 128x128 or 256x256 pixels
   - Will display at 64x64 pixels
   - Format: PNG with transparent background

## Image Guidelines

- **Dimensions**: 64x64 pixels minimum (will be scaled to fit)
- **Format**: PNG, SVG, or JPG
- **Background**: Transparent background recommended for PNG
- **Style**: Clear, professional icons or logos representing each payment method
- **Quality**: High resolution for crisp appearance

## Fallback

If any image fails to load, a generic payment card placeholder will display automatically.

## How It Works

The images are referenced in the Payment component with the following paths:

- `/images/payment-methods/credit-card.png`
- `/images/payment-methods/debit-card.png`
- `/images/payment-methods/esewa.png`
- `/images/payment-methods/khalti.png`

Simply add your images to this folder with these exact filenames.
