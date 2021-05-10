import { NextApiRequest, NextApiResponse } from "next";
import { EpisodesService } from "../../../services/EpisodesService";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      query: { _limit, _sort, _order }
    } = req;

    switch (method) {
      case "GET":
        const data = EpisodesService.getEpisodesFromDB(_limit, _sort, _order);

        res.status(200).json(data);
        break;
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};
