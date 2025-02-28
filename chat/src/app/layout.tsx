export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className="bg-gray-100 text-gray-900">
          <main className="min-h-screen flex flex-col">{children}</main>
        </body>
      </html>
    );
  }
  