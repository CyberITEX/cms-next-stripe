## Project Structure for Digital Products

```
.
├── src
│   ├── app
│   │   ├── (dashboard)
│   │   │   ├── customers
│   │   │   │   ├── [id]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.js
│   │   │   │   │   └── page.js
│   │   │   │   ├── add
│   │   │   │   │   └── page.js
│   │   │   │   └── page.js
│   │   │   ├── products
│   │   │   │   ├── [id]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.js
│   │   │   │   │   └── page.js
│   │   │   │   ├── add
│   │   │   │   │   └── page.js
│   │   │   │   └── page.js
│   │   │   ├── orders
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.js
│   │   │   │   └── page.js
│   │   │   ├── subscriptions
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.js
│   │   │   │   └── page.js
│   │   │   ├── analytics
│   │   │   │   └── page.js
│   │   │   └── layout.js
│   │   ├── api
│   │   │   └── webhooks
│   │   │       └── stripe
│   │   │           └── route.js
│   │   ├── cart
│   │   │   └── page.js
│   │   ├── checkout
│   │   │   ├── success
│   │   │   │   └── page.js
│   │   │   ├── cancel
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components
│   │   ├── ui
│   │   │   ├── button.js
│   │   │   ├── card.js
│   │   │   ├── dialog.js
│   │   │   ├── theme-toggle.js
│   │   │   └── ...
│   │   ├── forms
│   │   │   ├── customer-form.js
│   │   │   ├── product-form.js
│   │   │   └── ...
│   │   ├── customer
│   │   │   ├── customer-card.js
│   │   │   └── customer-list.js
│   │   ├── product
│   │   │   ├── product-card.js
│   │   │   └── product-list.js
│   │   ├── order
│   │   │   ├── order-card.js
│   │   │   └── order-list.js
│   │   ├── subscription
│   │   │   ├── subscription-card.js
│   │   │   └── subscription-list.js
│   │   ├── analytics
│   │   │   ├── sales-chart.js
│   │   │   ├── revenue-summary.js
│   │   │   └── customer-growth.js
│   │   ├── cart
│   │   │   ├── cart-item.js
│   │   │   └── cart-summary.js
│   │   └── layout
│   │       ├── header.js
│   │       ├── sidebar.js
│   │       └── footer.js
│   ├── lib
│   │   ├── stripe
│   │   │   ├── customers.js
│   │   │   ├── products.js
│   │   │   ├── subscriptions.js
│   │   │   ├── orders.js
│   │   │   ├── checkout.js
│   │   │   ├── transaction-fee.js
│   │   │   └── webhooks.js
│   │   ├── db.js
│   │   └── utils.js
│   ├── hooks
│   │   ├── use-cart.js
│   │   ├── use-theme.js
│   │   └── use-transaction-fee.js
│   └── context
│       ├── cart-context.js
│       └── theme-context.js
├── public
│   ├── images
│   └── ...
```

## Updated Implementation Plan

### Phase 1: Foundation Setup
- Set up project structure
- Configure Stripe connection
- Implement theme system with dark/light mode
- Create base UI components

### Phase 2: Product Management
- Create product listing views
- Implement product creation/editing
- Add product categorization
- Set up one-off vs. recurring product types

### Phase 3: Customer Management
- Build customer listing
- Implement customer addition/editing
- Add customer detail views

### Phase 4: Cart & Transaction Fee
- Implement cart functionality
- Add 5% transaction fee calculation
- Create cart persistence

### Phase 5: Checkout Flow
- Build checkout process
- Implement Stripe payment integration
- Handle successful/failed payments
- Add order confirmation

### Phase 6: Order & Subscription Management
- Implement order history
- Create order detail views
- Add subscription management
- Handle subscription cancellations

### Phase 7: Analytics & Reporting
- Create sales dashboards
- Implement revenue reporting
- Add customer insights

### Phase 8: User Experience Enhancements
- Add email notifications
- Implement discount/promotion system
- Optimize responsive design

### Phase 9: Performance Optimization
- Add caching strategies
- Optimize image and asset loading
- Implement performance monitoring

## Command Script to Create the Folder Structure

## Key Features for Digital Products

1. **Digital Product Delivery**
   - Secure download links
   - Access key generation
   - Automatic delivery via email

2. **Transaction Fee Implementation**
   - 5% fee automatically added at checkout
   - Clear fee display during checkout
   - Fee reporting in analytics

3. **Subscription Management**
   - Recurring billing
   - Subscription cancellation
   - Upgrade/downgrade options

4. **Order Management for Digital Products**
   - Access key/license management
   - Download tracking
   - Re-download capabilities

5. **Analytics Focused on Digital Products**
   - Popular downloads
   - Subscription retention rates
   - Revenue per product

6. **Email Notifications**
   - Purchase confirmations with download links
   - Subscription renewal reminders
   - Account updates

The script I've provided will create all the necessary folders and files for your project structure. You can run it in your project directory to set up the entire file structure at once. It creates empty files that you can then populate with your code.

This structure is optimized for a digital products store with the 5% transaction fee instead of tax calculations, and without the need for inventory or shipping management. The hooks and server actions are organized to support this business model.
