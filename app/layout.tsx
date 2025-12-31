import { Cinzel, Montserrat } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body className="bg-richBlack text-platinum antialiased selection:bg-gold-500 selection:text-richBlack">
        {children}
      </body>
    </html>
  )
}
