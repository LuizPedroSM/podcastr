import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      query: { slug }
    } = req;

    switch (method) {
      case "GET":
        if (slug) {
          const { db } = await connectToDatabase();
          const data = await db.collection("episodes").findOne({ id: slug });
          res.status(200).json(data);
        }
        break;
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};
