const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || process.env.VERCEL_BRANCH_URL;

export const getAppUrl = (path = "") => {
  if (typeof window !== "undefined") {
    return path;
  }

  if (process.env.VERCEL_ENV === "production") {
    return "https://www.maidanchyk.com" + path;
  }

  if (typeof VERCEL_URL !== "undefined") {
    return `https://${VERCEL_URL}` + path;
  }

  return `http://localhost:${process.env.PORT ?? 3000}` + path;
};
