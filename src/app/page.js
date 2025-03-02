// src/app/page.js
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/stripe/products';
import { ProductCard } from '@/components/product/product-card';
import { Footer } from '@/components/layout/footer';

/**
 * Home page component
 */
export default async function Home() {
  // Get featured products
  const products = await getProducts({ limit: 4 });

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-background">
        <div className="container px-4 sm:px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Premium Digital Products <br className="hidden sm:inline" />
            for Modern Businesses
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">
            Discover our selection of high-quality digital products, services, and subscriptions
            designed to help your business grow in the digital age.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary opacity-5 blur-[80px]" />
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t py-24">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Explore our most popular digital offerings
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-muted py-24">
        <div className="container px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose Our Digital Store?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide a seamless experience with premium products and exceptional support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                All our digital products are thoroughly tested and meet the highest quality standards.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Delivery</h3>
              <p className="text-muted-foreground">
                Our products are delivered instantly with secure download links that protect your purchase.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our customer support team is available around the clock to help with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-24">
        <div className="container px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16">
            Trusted by Businesses Worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">CEO, TechStart</p>
                </div>
              </div>
              <p className="italic">
                "The digital products from this store have transformed our business operations. Highly recommended!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                <div>
                  <h4 className="font-medium">David Chen</h4>
                  <p className="text-sm text-muted-foreground">Marketing Director, GrowthPlus</p>
                </div>
              </div>
              <p className="italic">
                "Their subscription services are excellent value for money. We've been using them for years."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                <div>
                  <h4 className="font-medium">Maria Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Freelance Designer</p>
                </div>
              </div>
              <p className="italic">
                "The customer support is incredible. Any issues I've had were resolved quickly and professionally."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Elevate Your Business?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Start exploring our premium digital products today and transform your business operations.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">Get Started</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}