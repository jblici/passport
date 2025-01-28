import { Inter, Roboto } from 'next/font/google'
import { cn } from '@/app/components/svg/svg';
import './globals.css'

const fontHeading = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '700'],
})

const fontBody = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700'],
})

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}