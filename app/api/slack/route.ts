import { NextRequest, NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;

const web = new WebClient(slackToken);

export const POST = async (req: NextRequest) => {
  const { text } = await req.json();

  try {
    await web.chat.postMessage({
      channel: channelId as string,
      text,
    });
    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
};
