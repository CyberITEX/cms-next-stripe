@echo off
echo Creating project folder structure...

:: Create the base structure
mkdir public\images
mkdir src\app

:: Create dashboard pages
mkdir "src\app\(dashboard)"
mkdir "src\app\(dashboard)\customers"
mkdir "src\app\(dashboard)\customers\add"
mkdir "src\app\(dashboard)\customers\[id]"
mkdir "src\app\(dashboard)\customers\[id]\edit"
mkdir "src\app\(dashboard)\products"
mkdir "src\app\(dashboard)\products\add"
mkdir "src\app\(dashboard)\products\[id]"
mkdir "src\app\(dashboard)\products\[id]\edit"
mkdir "src\app\(dashboard)\orders"
mkdir "src\app\(dashboard)\orders\[id]"
mkdir "src\app\(dashboard)\subscriptions"
mkdir "src\app\(dashboard)\subscriptions\[id]"
mkdir "src\app\(dashboard)\analytics"

:: Create checkout and cart pages
mkdir src\app\cart
mkdir src\app\checkout
mkdir src\app\checkout\success
mkdir src\app\checkout\cancel

:: Create API routes
mkdir src\app\api
mkdir src\app\api\webhooks
mkdir src\app\api\webhooks\stripe

:: Create component folders
mkdir src\components
mkdir src\components\ui
mkdir src\components\forms
mkdir src\components\customer
mkdir src\components\product
mkdir src\components\order
mkdir src\components\subscription
mkdir src\components\analytics
mkdir src\components\cart
mkdir src\components\layout

:: Create lib folders
mkdir src\lib
mkdir src\lib\stripe
mkdir src\hooks
mkdir src\context

:: Create layout files
type nul > src\app\layout.js
type nul > src\app\page.js
type nul > src\app\globals.css
type nul > "src\app\(dashboard)\layout.js"

:: Create dashboard pages
type nul > "src\app\(dashboard)\customers\page.js"
type nul > "src\app\(dashboard)\customers\add\page.js"
type nul > "src\app\(dashboard)\customers\[id]\page.js"
type nul > "src\app\(dashboard)\customers\[id]\edit\page.js"

type nul > "src\app\(dashboard)\products\page.js"
type nul > "src\app\(dashboard)\products\add\page.js"
type nul > "src\app\(dashboard)\products\[id]\page.js"
type nul > "src\app\(dashboard)\products\[id]\edit\page.js"

type nul > "src\app\(dashboard)\orders\page.js"
type nul > "src\app\(dashboard)\orders\[id]\page.js"

type nul > "src\app\(dashboard)\subscriptions\page.js"
type nul > "src\app\(dashboard)\subscriptions\[id]\page.js"

type nul > "src\app\(dashboard)\analytics\page.js"

:: Create checkout and cart pages
type nul > src\app\cart\page.js
type nul > src\app\checkout\page.js
type nul > src\app\checkout\success\page.js
type nul > src\app\checkout\cancel\page.js

:: Create API routes
type nul > src\app\api\webhooks\stripe\route.js

:: Create UI components
type nul > src\components\ui\button.js
type nul > src\components\ui\card.js
type nul > src\components\ui\dialog.js
type nul > src\components\ui\theme-toggle.js

:: Create form components
type nul > src\components\forms\customer-form.js
type nul > src\components\forms\product-form.js

:: Create customer components
type nul > src\components\customer\customer-card.js
type nul > src\components\customer\customer-list.js

:: Create product components
type nul > src\components\product\product-card.js
type nul > src\components\product\product-list.js

:: Create order components
type nul > src\components\order\order-card.js
type nul > src\components\order\order-list.js

:: Create subscription components
type nul > src\components\subscription\subscription-card.js
type nul > src\components\subscription\subscription-list.js

:: Create analytics components
type nul > src\components\analytics\sales-chart.js
type nul > src\components\analytics\revenue-summary.js
type nul > src\components\analytics\customer-growth.js

:: Create cart components
type nul > src\components\cart\cart-item.js
type nul > src\components\cart\cart-summary.js

:: Create layout components
type nul > src\components\layout\header.js
type nul > src\components\layout\sidebar.js
type nul > src\components\layout\footer.js

:: Create lib files
type nul > src\lib\stripe\customers.js
type nul > src\lib\stripe\products.js
type nul > src\lib\stripe\subscriptions.js
type nul > src\lib\stripe\orders.js
type nul > src\lib\stripe\checkout.js
type nul > src\lib\stripe\transaction-fee.js
type nul > src\lib\stripe\webhooks.js
type nul > src\lib\db.js
type nul > src\lib\utils.js

:: Create hooks
type nul > src\hooks\use-cart.js
type nul > src\hooks\use-theme.js
type nul > src\hooks\use-transaction-fee.js

:: Create context
type nul > src\context\cart-context.js
type nul > src\context\theme-context.js

echo Project structure created successfully



@radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-switch class-variance-authority lucide-react clsx next-themes stripe tailwind-merge