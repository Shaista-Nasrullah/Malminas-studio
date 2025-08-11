// components/orders/OrderMap.tsx

"use client";

// This component now only needs the address as a string.
interface OrderMapProps {
  address: string;
}

const OrderMap = ({ address }: OrderMapProps) => {
  // We get the API key from our environment variables.
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // If for some reason the key is missing, show a message.
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center rounded-lg border bg-gray-100">
        <p className="text-center text-sm text-gray-500">
          Map is unavailable. API key is missing.
        </p>
      </div>
    );
  }

  // We must encode the address to make it safe to use in a URL.
  // This turns "123 Main St, Quetta" into "123%20Main%20St%2C%20Quetta"
  const encodedAddress = encodeURIComponent(address);

  // This is the special URL for embedding a map.
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;

  return (
    // The iframe is the "window" that displays the map from the URL.
    <div className="overflow-hidden rounded-lg border">
      <iframe
        width="100%"
        height="250"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
      ></iframe>
      {/* You can add your confirmation message below the iframe if you want */}
      <div className="rounded-b-lg border-t bg-white p-4 text-center">
        <h2 className="font-semibold">Your order is confirmed</h2>
        <p className="mt-1 text-sm text-gray-600">
          You will receive a confirmation email shortly.
        </p>
      </div>
    </div>
  );
};

export default OrderMap;
