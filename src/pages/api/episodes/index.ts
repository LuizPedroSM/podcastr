import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      query: { _limit, _sort, _order }
    } = req;

    const order = _order == "desc" ? -1 : 1;
    const sort = _sort ? { [_sort as string]: order } : { published_at: order };

    switch (method) {
      case "GET":
        const { db } = await connectToDatabase();
        const data = await db
          .collection("episodes")
          .find()
          .limit(+_limit)
          .sort(sort)
          .toArray();

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
