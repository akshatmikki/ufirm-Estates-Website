import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { ImageUrl } = req.body;
    if (!ImageUrl) return res.status(400).json({ error: "Missing image" });

    // Simply return the base64 string as-is
    res.status(200).json({ base64: ImageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process image" });
  }
}
