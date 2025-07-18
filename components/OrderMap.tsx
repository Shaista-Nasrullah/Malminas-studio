// components/orders/OrderMap.tsx

"use client";

interface OrderMapProps {
  address: string;
}

const OrderMap = ({ address }: OrderMapProps) => {
  // IMPORTANT: Store your API key in your .env.local file
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center rounded-lg bg-gray-200">
        <p className="text-gray-600">
          Map cannot be displayed. API key missing.
        </p>
      </div>
    );
  }

  // Encodes the address to be safely used in a URL
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <iframe
          width="100%"
          height="250"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapSrc}
        ></iframe>
        {/* Confirmation Message */}
        <div className="rounded-lg border bg-white p-6 text-center">
          <h2 className="text-lg font-semibold">Your order is confirmed</h2>
          <p className="mt-2 text-sm text-gray-600">
            You will receive a confirmation email with your order number
            shortly.
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderMap;
