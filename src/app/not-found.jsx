import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
      <h2 className="text-4xl font-bold">404 - Page Not Found</h2>
      <p className="text-lg">The page you are looking for does not exist or has been moved.</p>
      <Link 
        href="/"
        className="btn-primary inline-block"
      >
        Return to Home
      </Link>
    </div>
  )
}