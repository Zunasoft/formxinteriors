import "./globals.css";

export const metadata = {
  title: "form X Interiors — Design, build, deliver · Hyderabad",
  description:
    "form X Interiors — Hyderabad design-and-build studio. We design the room, then we build it. One team, one bill. Get a price on your own floor plan.",
  metadataBase: new URL("https://formxinteriors.com"),
  openGraph: {
    title: "form X Interiors — Design, build, deliver",
    description: "One team, one bill. Hyderabad, since 2019.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0C0D0F",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
