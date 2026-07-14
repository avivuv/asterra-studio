import type { Metadata } from "next";
import { Fraunces, Nunito, Geist_Mono } from "next/font/google";
import "./globals.css";

// Skrip anti-FOUC: set data-theme & data-skin SEBELUM paint. Default = light (pilihan user tersimpan
// menimpa). Ditaruh sebagai string agar dieksekusi browser (React tak menjalankan <script> hasil render).
const themeInitScript = `(function(){try{document.documentElement.setAttribute("data-theme",localStorage.getItem("asterra-theme")||"light");document.documentElement.setAttribute("data-skin",localStorage.getItem("asterra-skin")||"pink");}catch(e){}})();`;

// Display: Fraunces (soft-serif berkarakter). Body: Nunito (rounded, ramah).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asterra Studio",
  description: "Katalog aksesoris HP & gantungan (kunci/tas).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      // suppressHydrationWarning: skrip di bawah menyetel data-theme/data-skin sebelum React hydrate.
      suppressHydrationWarning
      className={`${fraunces.variable} ${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
