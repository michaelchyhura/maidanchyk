import { del } from "@vercel/blob";
import type { NextApiResponse, NextApiRequest } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const url = request.query.url as string;

  if (!url) {
    return response.status(400).json({ error: "Bad Request: url parameter is missing" });
  }

  try {
    await del(url);

    return response.status(200).end();
  } catch (error) {
    return response.status(400).json({ error: (error as Error).message });
  }
}
