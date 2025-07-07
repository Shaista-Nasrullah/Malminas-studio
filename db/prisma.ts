import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
      // --- ADDED FOR DATE SERIALIZATION ---
      createdAt: {
        compute(product) {
          // Always convert the createdAt Date object to an ISO string
          return product.createdAt.toISOString();
        },
      },
      discountEndDate: {
        compute(product) {
          // IMPORTANT: Check if the date exists before converting, as it's optional.
          // If it's null, return null. Otherwise, convert it to an ISO string.
          return product.discountEndDate
            ? product.discountEndDate.toISOString()
            : null;
        },
      },
      // --- END OF DATE SERIALIZATION ADDITION ---
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString();
        },
      },
      // You should also add date conversions here if you pass Order objects to the client
      createdAt: {
        compute(order) {
          return order.createdAt.toISOString();
        },
      },
      updatedAt: {
        compute(order) {
          return order.updatedAt.toISOString();
        },
      },
    },
    orderItem: {
      price: {
        compute(cart) {
          return cart.price.toString();
        },
      },
    },
  },
});

// import { PrismaClient } from "@prisma/client";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { Pool } from "@neondatabase/serverless";

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// // Create a connection pool to your Neon database
// const neon = new Pool({ connectionString: process.env.DATABASE_URL });
// // Create the Prisma adapter
// const adapter = new PrismaNeon(neon);

// // Initialize Prisma Client with the adapter
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }
