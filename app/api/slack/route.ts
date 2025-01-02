import { NextRequest, NextResponse } from "next/server";

// 環境変数からSlackのトークンとチャンネルIDを取得
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

// Slackにメッセージを送信する関数
async function sendSlackMessage(message: string) {
  console.log("Sending message to Slack:", message);
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SLACK_TOKEN}`, // Bearerトークンを使用
    },
    body: JSON.stringify({
      channel: SLACK_CHANNEL_ID, // チャンネルIDを使用
      text: message,
    }),
  });

  const data = await response.json();
  console.log("Slack API response:", data);
  if (!data.ok) {
    console.error("Slack API error:", data.error);
    throw new Error(`Slack API error: ${data.error}`);
  }
}

// APIエンドポイントのハンドラー
export async function POST(request: NextRequest) {
  try {
    console.log("Received request to send message");
    const { message } = await request.json(); // リクエストからメッセージを取得
    console.log("Message extracted from request:", message);
    await sendSlackMessage(message); // メッセージをSlackに送信
    console.log("Message sent successfully");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending message:", error.message);
      return NextResponse.json({ success: false, error: error.message });
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json({
        success: false,
        error: "Unknown error occurred",
      });
    }
  }
}
