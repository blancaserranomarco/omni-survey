import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: '400',
  style: ['normal', 'italic'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'OMNI — Cuestionario Pre-Workshop',
  description: 'Encuesta breve sobre expectativas con OMNI, el asistente fiscal de TaxDown.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
