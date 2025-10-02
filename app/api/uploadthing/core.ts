// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB" },
  })
    .middleware(async () => {
      // Add 'req' to access request details
      console.log("UploadThing Middleware: Request received."); // Log start of middleware

      const session = await auth();
      if (!session) {
        console.error("UploadThing Middleware: Unauthorized access attempt."); // Log unauthorized
        throw new UploadThingError("Unauthorized");
      }
      console.log(
        `UploadThing Middleware: User ${session.user?.id} authorized.`
      ); // Log successful authorization
      return { userId: session?.user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Add 'file' to access file details
      console.log("UploadThing onUploadComplete: Callback received."); // Log start of onUploadComplete
      console.log("File details:", file); // Log details of the uploaded file
      console.log("Metadata:", metadata); // Log the metadata passed from middleware

      // You can add logic here to store file information in your database
      // For example: await db.image.create({ data: { url: file.url, userId: metadata.userId } });

      console.log(
        `UploadThing onUploadComplete: Upload complete for user ${metadata.userId}.`
      ); // Log successful completion
      return { uploadedBy: metadata.userId, fileUrl: file.url }; // Return file.url if you need it on the client
    }),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;

// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
// import { auth } from "@/auth";

// const f = createUploadthing();

// export const ourFileRouter = {
//   imageUploader: f({
//     image: { maxFileSize: "4MB" },
//   })
//     .middleware(async () => {
//       const session = await auth();
//       if (!session) throw new UploadThingError("Unauthorized");
//       return { userId: session?.user?.id };
//     })
//     .onUploadComplete(async ({ metadata }) => {
//       return { uploadedBy: metadata.userId };
//     }),
// } satisfies FileRouter;
// export type OurFileRouter = typeof ourFileRouter;
