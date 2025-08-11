// lib/geocoding.ts

import NodeGeocoder from "node-geocoder";

// The only change is adding the 'fetch' property to the options.
const options: NodeGeocoder.Options = {
  provider: "google",
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  fetch: fetch, // <-- THIS IS THE FIX
  formatter: null,
};

const geocoder = NodeGeocoder(options);

export const getCoordinates = async (address: string) => {
  try {
    const res = await geocoder.geocode(address);
    if (res.length > 0) {
      const { latitude, longitude } = res[0];
      return { lat: latitude, lng: longitude };
    }
    return null;
  } catch (error) {
    // This will now log more helpful errors if something else goes wrong.
    console.error("Geocoding failed:", error);
    return null;
  }
};
