// app/checkout/layout.tsx

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is intentionally minimal. It does not include the
  // main site Header or Footer to provide a focused checkout experience.
  return <div className="bg-white">{children}</div>;
}
