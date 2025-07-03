// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// // This is your one and only Prisma client.
// // It should not use the Neon adapter directly if it's only for the Node.js runtime,
// // as the standard client is more performant here. Let Prisma handle it via the connection string.
// export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a connection pool to your Neon database
const neon = new Pool({ connectionString: process.env.DATABASE_URL });
// Create the Prisma adapter
const adapter = new PrismaNeon(neon);

// Initialize Prisma Client with the adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// import { neonConfig } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { PrismaClient } from "@prisma/client";
// import ws from "ws";

// // Sets up WebSocket connections, which enables Neon to use WebSocket communication.
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`;

// // Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
// const adapter = new PrismaNeon({ connectionString });

// // Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
// // const adapter = new PrismaNeon(pool);

// // Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
// export const prisma = new PrismaClient({ adapter }).$extends({
//   result: {
//     product: {
//       price: {
//         compute(product) {
//           return product.price.toString();
//         },
//       },
//       rating: {
//         compute(product) {
//           return product.rating.toString();
//         },
//       },
//     },
//   },
// });
