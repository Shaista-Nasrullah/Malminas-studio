// In types/global.d.ts

// This declares a global PageProps type that all pages can use.
// This will override the incorrect one that is causing the build to fail.
type PageProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
