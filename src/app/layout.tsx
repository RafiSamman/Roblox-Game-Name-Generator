import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BloxIdea Studio — Turn names into games",
  description: "Generate catchy Roblox game titles and turn the best ones into practical game blueprints.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}