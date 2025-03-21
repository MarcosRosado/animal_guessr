import '@/styles/globals.css';
import Providers from "@components/providers";
import {NavItem} from "@components/nav-item";
import {MapPin} from "lucide-react";

export const metadata = {
  title: 'AnimalGuessr',
  description:
    'A simple game to test your knowledge about animals',
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
  return (
    <html lang="en">
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
    </head>
    <body className="flex min-h-screen w-full flex-col">
    <Providers>
      <main className="flex flex-col">
          <main className="">
            {children}
          </main>
      </main>
    </Providers>
    </body>
    </html>
  );
}