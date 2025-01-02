import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WebClient } from "@slack/web-api";

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;

if (!channelId) {
  throw new Error(
    "SLACK_CHANNEL_ID is not defined in the environment variables."
  );
}

const web = new WebClient(slackToken);

export async function sendSlackMessage(text: string) {
  try {
    await web.chat.postMessage({
      channel: channelId as string,
      text: text,
    });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
