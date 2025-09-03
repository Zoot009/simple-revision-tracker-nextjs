import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect directly to dashboard since no auth needed
  redirect('/dashboard')
}