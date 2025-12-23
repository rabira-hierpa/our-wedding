import type { TelegramFile, TelegramPhotoSize } from "@/types/telegram";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Verifies the Telegram webhook secret token
 */
export function verifyTelegramRequest(token: string): boolean {
  const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  console.log("DEBUG: Received token:", token);
  console.log("DEBUG: Expected token:", expectedToken);
  if (!expectedToken) {
    console.error("TELEGRAM_WEBHOOK_SECRET is not set");
    return false;
  }
  return token === expectedToken;
}

/**
 * Gets the highest resolution photo from an array of photo sizes
 */
export function getHighestResolutionPhoto(
  photos: TelegramPhotoSize[]
): TelegramPhotoSize | null {
  if (!photos || photos.length === 0) return null;

  return photos.reduce((largest, current) => {
    const largestSize = largest.width * largest.height;
    const currentSize = current.width * current.height;
    return currentSize > largestSize ? current : largest;
  }, photos[0]);
}

/**
 * Gets file information from Telegram
 */
export async function getFileInfo(
  fileId: string
): Promise<TelegramFile | null> {
  try {
    const response = await fetch(
      `${TELEGRAM_API_BASE}/getFile?file_id=${fileId}`
    );
    const data = await response.json();

    if (!data.ok) {
      console.error("Failed to get file info:", data);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error("Error getting file info:", error);
    return null;
  }
}

/**
 * Downloads a file from Telegram
 */
export async function downloadTelegramFile(
  filePath: string
): Promise<Buffer | null> {
  try {
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    const response = await fetch(fileUrl);

    if (!response.ok) {
      console.error("Failed to download file:", response.statusText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
}

/**
 * Sends a message to a Telegram chat
 */
export async function sendMessage(
  chatId: number,
  text: string,
  replyToMessageId?: number
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_to_message_id: replyToMessageId,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
}

/**
 * Sends a photo to a Telegram chat
 */
export async function sendPhoto(
  chatId: number,
  photoUrl: string,
  caption?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error sending photo:", error);
    return false;
  }
}

/**
 * Sends a chat action (like "typing" or "upload_photo")
 */
export async function sendChatAction(
  chatId: number,
  action: "typing" | "upload_photo" | "upload_video" | "upload_document"
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        action,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error sending chat action:", error);
    return false;
  }
}

/**
 * Sends a photo with inline keyboard buttons
 */
export async function sendPhotoWithButtons(
  chatId: number,
  photoUrl: string,
  caption: string,
  buttons: { text: string; callback_data: string }[][]
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption,
        reply_markup: {
          inline_keyboard: buttons,
        },
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error sending photo with buttons:", error);
    return false;
  }
}

/**
 * Answers a callback query (from inline button press)
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert?: boolean
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error answering callback query:", error);
    return false;
  }
}

/**
 * Deletes a message
 */
export async function deleteMessage(
  chatId: number,
  messageId: number
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/deleteMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
}

/**
 * Sends a message with inline keyboard buttons
 */
export async function sendMessageWithButtons(
  chatId: number,
  text: string,
  buttons: { text: string; callback_data?: string; url?: string }[][],
  replyToMessageId?: number
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          inline_keyboard: buttons,
        },
        reply_to_message_id: replyToMessageId,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error sending message with buttons:", error);
    return false;
  }
}

/**
 * Adds a user to a chat/group
 */
export async function addChatMember(
  chatId: number,
  userId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${TELEGRAM_API_BASE}/approveChatJoinRequest`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: userId,
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return {
        success: false,
        error: data.description || "Failed to add user",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding chat member:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Creates a chat invite link
 */
export async function createChatInviteLink(
  chatId: number,
  memberLimit?: number
): Promise<{ success: boolean; link?: string; error?: string }> {
  try {
    const body: any = { chat_id: chatId };

    // Only add member_limit if explicitly provided
    if (memberLimit !== undefined) {
      body.member_limit = memberLimit;
    }

    const response = await fetch(`${TELEGRAM_API_BASE}/createChatInviteLink`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram API error:", {
        error_code: data.error_code,
        description: data.description,
        chatId,
      });
      return {
        success: false,
        error: data.description || "Failed to create invite link",
      };
    }

    return { success: true, link: data.result.invite_link };
  } catch (error) {
    console.error("Error creating invite link:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Forwards a message to another chat
 */
export async function forwardMessage(
  chatId: number,
  fromChatId: number,
  messageId: number
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/forwardMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        from_chat_id: fromChatId,
        message_id: messageId,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error forwarding message:", error);
    return false;
  }
}

/**
 * Sends a photo to a chat using file_id or URL
 */
export async function sendPhotoToChat(
  chatId: number,
  photoFileIdOrUrl: string,
  caption?: string
): Promise<{ ok: boolean; message_id?: number }> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoFileIdOrUrl,
        caption,
      }),
    });

    const data = await response.json();
    return { ok: data.ok, message_id: data.result?.message_id };
  } catch (error) {
    console.error("Error sending photo to chat:", error);
    return { ok: false };
  }
}
