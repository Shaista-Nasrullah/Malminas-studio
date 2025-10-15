// lib/postex.ts
import "server-only"; // Ensure this runs only on the server

const POSTEX_API_TOKEN = process.env.POSTEX_API_TOKEN;
const POSTEX_BASE_URL = process.env.POSTEX_BASE_URL;

if (!POSTEX_API_TOKEN || !POSTEX_BASE_URL) {
  throw new Error(
    "POSTEX_API_TOKEN and POSTEX_BASE_URL must be defined in your environment variables."
  );
}

const postexHeaders = {
  token: POSTEX_API_TOKEN,
  "Content-Type": "application/json",
};

export async function postexFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${POSTEX_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...postexHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.statusMessage ||
        `PostEx API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Example function to get operational cities
export async function getOperationalCities(
  operationalCityType: "Pickup" | "Delivery" | null = null
) {
  const query = operationalCityType
    ? `?operationalCityType=${operationalCityType}`
    : "";
  return postexFetch<{
    statusCode: string;
    statusMessage: string;
    dist: Array<{
      operationalCityName: string;
      countryName: string;
      isPickupCity: "true" | "false"; // Note: documentation says string boolean
      isDeliveryCity: "true" | "false"; // Note: documentation says string boolean
    }>;
  }>(`/v2/get-operational-city${query}`);
}

// You can add more specific API functions here as needed
