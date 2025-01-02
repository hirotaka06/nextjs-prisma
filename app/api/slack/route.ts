import { NextApiRequest, NextApiResponse } from "next";
import { WebClient } from "@slack/web-api";

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;

const web = new WebClient(slackToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { text } = req.body;

    try {
      await web.chat.postMessage({
        channel: channelId as string,
        text,
      });
      res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
