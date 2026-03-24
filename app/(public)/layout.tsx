export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* SiteHeader will be built by Stream B */}
      <main className="min-h-screen">{children}</main>
      {/* Footer will be built by Stream B */}
    </>
  );
}
