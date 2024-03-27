import type { NextApiResponse, NextApiRequest } from "next";
import { getSession } from "../../../shared/lib/session";
import { getAppUrl } from "../../../shared/lib/urls";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSession(request, response);

  session.destroy();

  response.redirect(302, getAppUrl("/"));
}
