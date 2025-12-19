import {
  deletePhotoFromStorage,
  uploadPhotoToStorage,
} from "@/lib/file-storage";
import { prisma } from "@/lib/prisma";
import {
  answerCallbackQuery,
  createChatInviteLink,
  deleteMessage,
  downloadTelegramFile,
  getFileInfo,
  getHighestResolutionPhoto,
  sendChatAction,
  sendMessage,
  sendMessageWithButtons,
  sendPhoto,
  sendPhotoToChat,
  sendPhotoWithButtons,
  verifyTelegramRequest,
} from "@/lib/telegram";
import type { TelegramUpdate } from "@/types/telegram";
import { NextRequest, NextResponse } from "next/server";

const WEDDING_GROUP_CHAT_ID = process.env.WEDDING_GROUP_CHAT_ID
  ? parseInt(process.env.WEDDING_GROUP_CHAT_ID)
  : null;

const WEDDING_GROUP_INVITE_LINK = process.env.WEDDING_GROUP_INVITE_LINK || null;

// Track media groups to handle multiple photos sent together
const mediaGroups = new Map<
  string,
  { photos: any[]; timeout: NodeJS.Timeout }
>();

export async function POST(request: NextRequest) {
  try {
    // Verify the request comes from Telegram
    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    console.log("Received secret header:", secret);
    console.log("Expected secret:", process.env.TELEGRAM_WEBHOOK_SECRET);
    if (!secret || !verifyTelegramRequest(secret)) {
      console.error("Invalid or missing secret token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update: TelegramUpdate = await request.json();
    console.log("Received update:", JSON.stringify(update, null, 2));

    // Log group chat IDs for debugging (helps find the correct WEDDING_GROUP_CHAT_ID)
    if (
      update.message?.chat?.type === "group" ||
      update.message?.chat?.type === "supergroup"
    ) {
      console.log("📊 GROUP CHAT DETECTED:");
      console.log(`  Title: ${update.message.chat.title}`);
      console.log(`  Chat ID: ${update.message.chat.id}`);
      console.log(`  Type: ${update.message.chat.type}`);
      console.log(
        `  👉 Add this to your .env: WEDDING_GROUP_CHAT_ID=${update.message.chat.id}`
      );
    }

    // Handle callback queries (button presses)
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const user = message.from;
    if (!user || user.is_bot) {
      return NextResponse.json({ ok: true });
    }

    // Handle /start command for registration
    if (message.text?.startsWith("/start")) {
      await handleRegistration(user, message.chat.id, message.message_id);
      return NextResponse.json({ ok: true });
    }

    // Handle /help command
    if (message.text?.startsWith("/help")) {
      await handleHelp(message.chat.id, message.message_id);
      return NextResponse.json({ ok: true });
    }

    // Handle /myphotos command
    if (message.text?.startsWith("/myphotos")) {
      await handleMyPhotos(user, message.chat.id, message.message_id);
      return NextResponse.json({ ok: true });
    }

    // Handle /delete command
    if (message.text?.startsWith("/delete")) {
      await handleDeletePhoto(
        user,
        message.text,
        message.chat.id,
        message.message_id
      );
      return NextResponse.json({ ok: true });
    }

    // Handle /wish command for digital signature
    if (message.text?.startsWith("/wish")) {
      await handleWishCommand(
        user,
        message.text,
        message.chat.id,
        message.message_id
      );
      return NextResponse.json({ ok: true });
    }

    // Handle /joingroup command
    if (message.text?.startsWith("/joingroup")) {
      await handleJoinGroupCommand(user, message.chat.id, message.message_id);
      return NextResponse.json({ ok: true });
    }

    // Reject videos
    if (message.video) {
      await sendMessage(
        message.chat.id,
        "❌ Sorry, I only accept photos (images), not videos.",
        message.message_id
      );
      return NextResponse.json({ ok: true });
    }

    // Handle photo sent as document (file)
    if (message.document) {
      const mimeType = message.document.mime_type || "";
      // Check if document is an image
      if (mimeType.startsWith("image/")) {
        await handleDocumentPhoto(
          user,
          message.document,
          message.caption,
          message.chat.id,
          message.message_id
        );
        return NextResponse.json({ ok: true });
      } else {
        await sendMessage(
          message.chat.id,
          "❌ Sorry, I only accept image files. Please send photos.",
          message.message_id
        );
        return NextResponse.json({ ok: true });
      }
    }

    // Handle photo upload (including multiple photos)
    if (message.photo && message.photo.length > 0) {
      // Check if this is part of a media group (multiple photos sent together)
      if (message.media_group_id) {
        await handleMediaGroup(
          user,
          message.media_group_id,
          message.photo,
          message.caption,
          message.chat.id,
          message.message_id
        );
      } else {
        // Single photo
        await handlePhotoUpload(
          user,
          message.photo,
          message.caption,
          message.chat.id,
          message.message_id
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Handle other text messages
    if (message.text) {
      await sendMessage(
        message.chat.id,
        "📸 Send me photos to add them to the wedding gallery!\n\nCommands:\n/help - Show help\n/myphotos - View and manage your photos",
        message.message_id
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles guest registration
 */
async function handleRegistration(
  user: any,
  chatId: number,
  messageId: number
) {
  try {
    // Check if user already exists
    const existingGuest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
    });

    const galleryUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://your-wedding-site.com";

    if (existingGuest) {
      await sendMessageWithButtons(
        chatId,
        `Welcome back, ${user.first_name}! 👋\n\n📸 Send me photos to add them to the gallery!\n\n🌐 *View Gallery:*\n${galleryUrl}`,
        [
          [
            { text: "📸 My Photos", callback_data: "cmd_myphotos" },
            { text: "💝 Leave a Wish", callback_data: "cmd_wish" },
          ],
          [{ text: "👥 Join Wedding Group", callback_data: "cmd_joingroup" }],
        ],
        messageId
      );
      return;
    }

    // Register new guest
    try {
      await prisma.guest.create({
        data: {
          telegramUserId: BigInt(user.id),
          telegramUsername: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });

      await sendMessageWithButtons(
        chatId,
        `Hi ${user.first_name}! 🎉\n\n✅ *Registration Complete!*\n\n📸 You can now send photos and they'll be added to the wedding gallery!\n\n🌐 *View Gallery:*\n${galleryUrl}`,
        [
          [
            { text: "📸 My Photos", callback_data: "cmd_myphotos" },
            { text: "💝 Leave a Wish", callback_data: "cmd_wish" },
          ],
          [{ text: "👥 Join Wedding Group", callback_data: "cmd_joingroup" }],
        ],
        messageId
      );
    } catch (error) {
      console.error("Error registering guest:", error);
      await sendMessage(
        chatId,
        "Sorry, there was an error registering you. Please try again later.",
        messageId
      );
    }
  } catch (error) {
    console.error("Error in handleRegistration:", error);
  }
}

/**
 * Handles /help command
 */
async function handleHelp(chatId: number, messageId: number) {
  const helpText = `📸 *Wedding Photo Gallery Bot*\n\n*How to use:*\n• Send photos (as images or files) to add them to the gallery\n• Send multiple photos at once\n• Add captions to your photos\n\n*Commands:*\n/start - Register or get started\n/help - Show this help message\n/myphotos - View your uploaded photos with delete buttons\n/wish <message> - Leave a digital wish for the newlyweds\n/joingroup - Get invitation to join the wedding photo group\n\n*Note:* Only photos (images) are accepted. Videos and other file types will be rejected.`;

  await sendMessage(chatId, helpText, messageId);
}

/**
 * Handles /myphotos command
 */
async function handleMyPhotos(user: any, chatId: number, messageId: number) {
  try {
    const guest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
      include: {
        photos: {
          orderBy: { uploadedAt: "desc" },
        },
      },
    });

    if (!guest || guest.photos.length === 0) {
      await sendMessage(
        chatId,
        "You haven't uploaded any photos yet. Send me some photos to get started! 📸",
        messageId
      );
      return;
    }

    // Send each photo with a delete button
    await sendMessage(
      chatId,
      `You have uploaded ${guest.photos.length} photo(s). Tap the 🗑️ Delete button below any photo to remove it.`,
      messageId
    );

    for (let index = 0; index < guest.photos.length; index++) {
      const photo = guest.photos[index];
      const photoNumber = index + 1;
      const caption = photo.caption
        ? `Photo ${photoNumber}: ${photo.caption}`
        : `Photo ${photoNumber}`;

      // Send photo with delete button using Telegram file_id
      await sendPhotoWithButtons(chatId, photo.telegramFileId, caption, [
        [{ text: "🗑️ Delete", callback_data: `delete_${photo.id}` }],
      ]);
    }
  } catch (error) {
    console.error("Error in handleMyPhotos:", error);
    await sendMessage(
      chatId,
      "Sorry, there was an error retrieving your photos.",
      messageId
    );
  }
}

/**
 * Handles /delete command
 */
async function handleDeletePhoto(
  user: any,
  messageText: string,
  chatId: number,
  messageId: number
) {
  try {
    const parts = messageText.split(" ");
    if (parts.length < 2 || isNaN(parseInt(parts[1]))) {
      await sendMessage(
        chatId,
        "Please specify a photo number to delete. Use: /delete <number>\n\nTo see your photos, use: /myphotos",
        messageId
      );
      return;
    }

    const photoNumber = parseInt(parts[1]);

    const guest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
      include: {
        photos: {
          orderBy: { uploadedAt: "desc" },
        },
      },
    });

    if (!guest || guest.photos.length === 0) {
      await sendMessage(
        chatId,
        "You don't have any photos to delete.",
        messageId
      );
      return;
    }

    if (photoNumber < 1 || photoNumber > guest.photos.length) {
      await sendMessage(
        chatId,
        `Invalid photo number. You have ${guest.photos.length} photo(s). Use /myphotos to see them.`,
        messageId
      );
      return;
    }

    const photoToDelete = guest.photos[photoNumber - 1];

    // Delete from storage
    await deletePhotoFromStorage(photoToDelete.storagePath);

    // Delete from database
    await prisma.photo.delete({
      where: { id: photoToDelete.id },
    });

    await sendMessage(
      chatId,
      `✅ Photo ${photoNumber} has been deleted from the gallery.`,
      messageId
    );
  } catch (error) {
    console.error("Error in handleDeletePhoto:", error);
    await sendMessage(
      chatId,
      "Sorry, there was an error deleting the photo.",
      messageId
    );
  }
}

/**
 * Handles callback queries (inline button presses)
 */
async function handleCallbackQuery(callbackQuery: any) {
  try {
    const user = callbackQuery.from;
    const data = callbackQuery.data;
    const chatId = callbackQuery.message?.chat.id;
    const messageId = callbackQuery.message?.message_id;

    if (!chatId || !messageId) {
      await answerCallbackQuery(callbackQuery.id, "Error processing request");
      return;
    }

    // Handle delete button press
    if (data?.startsWith("delete_")) {
      const photoId = data.replace("delete_", "");

      // Find the photo and verify ownership
      const photo = await prisma.photo.findUnique({
        where: { id: photoId },
        include: { guest: true },
      });

      if (!photo) {
        await answerCallbackQuery(callbackQuery.id, "Photo not found", true);
        return;
      }

      // Verify the user owns this photo
      if (photo.guest.telegramUserId !== BigInt(user.id)) {
        await answerCallbackQuery(
          callbackQuery.id,
          "You can only delete your own photos",
          true
        );
        return;
      }

      // Delete from storage
      await deletePhotoFromStorage(photo.storagePath);

      // Delete from database
      await prisma.photo.delete({
        where: { id: photoId },
      });

      // Delete the message with the photo
      await deleteMessage(chatId, messageId);

      // Answer the callback query
      await answerCallbackQuery(
        callbackQuery.id,
        "Photo deleted successfully ✅"
      );

      // Send confirmation message
      await sendMessage(chatId, "✅ Photo has been deleted from the gallery.");
    }

    // Handle join group confirmation
    if (data?.startsWith("confirm_join_")) {
      const action = data.replace("confirm_join_", "");

      if (action === "yes") {
        await handleGroupJoinConfirmation(
          user,
          chatId,
          messageId,
          callbackQuery.id
        );
      } else {
        await answerCallbackQuery(
          callbackQuery.id,
          "No problem! You can join anytime with /joingroup"
        );
        await deleteMessage(chatId, messageId);
      }
      return;
    }

    // Handle command buttons
    if (data?.startsWith("cmd_")) {
      const command = data.replace("cmd_", "");

      switch (command) {
        case "myphotos":
          await answerCallbackQuery(callbackQuery.id);
          await handleMyPhotos(user, chatId, messageId);
          break;

        case "wish":
          await answerCallbackQuery(callbackQuery.id);
          await sendMessage(
            chatId,
            "💝 Please send your wish in the following format:\n\n`/wish Your heartfelt message here`\n\nExample:\n`/wish Wishing you a lifetime of love and happiness! 💕`",
            messageId
          );
          break;

        case "joingroup":
          await answerCallbackQuery(callbackQuery.id);
          await handleJoinGroupCommand(user, chatId, messageId);
          break;

        default:
          await answerCallbackQuery(callbackQuery.id, "Unknown command");
      }
      return;
    }
  } catch (error) {
    console.error("Error in handleCallbackQuery:", error);
    await answerCallbackQuery(
      callbackQuery.id,
      "Sorry, there was an error processing your request",
      true
    );
  }
}

/**
 * Handles /wish command for digital signatures
 */
async function handleWishCommand(
  user: any,
  messageText: string,
  chatId: number,
  messageId: number
) {
  try {
    // Extract wish message
    const wish = messageText.replace("/wish", "").trim();

    if (!wish) {
      await sendMessage(
        chatId,
        "💌 Please include your wish!\n\nExample: /wish Wishing you both a lifetime of love and happiness!",
        messageId
      );
      return;
    }

    // Ensure guest is registered
    const guest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
    });

    if (!guest) {
      // Auto-register if not already
      await prisma.guest.create({
        data: {
          telegramUserId: BigInt(user.id),
          telegramUsername: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    }

    // Save wish to database
    await prisma.wish.create({
      data: {
        guestId:
          guest?.id ||
          (await prisma.guest.findFirst({
            where: { telegramUserId: BigInt(user.id) },
          }))!.id,
        message: wish,
      },
    });

    await sendMessage(
      chatId,
      `💌 Thank you for your beautiful wish!\n\n"${wish}"\n\n✨ Your message will be displayed on the wedding gallery website.`,
      messageId
    );
  } catch (error) {
    console.error("Error in handleWishCommand:", error);
    await sendMessage(
      chatId,
      "Sorry, there was an error saving your wish. Please try again.",
      messageId
    );
  }
}

/**
 * Handles /joingroup command
 */
async function handleJoinGroupCommand(
  user: any,
  chatId: number,
  messageId: number
) {
  try {
    if (!WEDDING_GROUP_CHAT_ID) {
      await sendMessage(
        chatId,
        "The wedding group is not set up yet. Please contact the organizers.",
        messageId
      );
      return;
    }

    // Check if user is already in the group
    const guest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
    });

    if (guest?.inWeddingGroup) {
      await sendMessage(
        chatId,
        "You're already in the wedding group! 🎉",
        messageId
      );
      return;
    }

    // Send confirmation prompt
    await sendMessageWithButtons(
      chatId,
      `🎉 Would you like to join the wedding photo group?\n\nBy joining:\n✅ You'll see all wedding photos shared by guests\n✅ Your photos will be shared with everyone\n✅ You can chat with other guests`,
      [
        [
          { text: "✅ Yes, join group", callback_data: "confirm_join_yes" },
          { text: "❌ No thanks", callback_data: "confirm_join_no" },
        ],
      ],
      messageId
    );
  } catch (error) {
    console.error("Error in handleJoinGroupCommand:", error);
    await sendMessage(
      chatId,
      "Sorry, there was an error. Please try again later.",
      messageId
    );
  }
}

/**
 * Handles group join confirmation
 */
async function handleGroupJoinConfirmation(
  user: any,
  chatId: number,
  messageId: number,
  callbackQueryId: string
) {
  try {
    if (!WEDDING_GROUP_CHAT_ID) {
      await answerCallbackQuery(callbackQueryId, "Group not configured", true);
      return;
    }

    let inviteLink = WEDDING_GROUP_INVITE_LINK;

    // If no manual invite link, try to create one
    if (!inviteLink) {
      const inviteResult = await createChatInviteLink(WEDDING_GROUP_CHAT_ID);

      if (!inviteResult.success || !inviteResult.link) {
        console.error("Invite link creation failed:", inviteResult);

        // Provide helpful error message
        const errorMsg = inviteResult.error?.includes("not enough rights")
          ? "⚠️ Bot needs admin rights in the group to create invite links.\n\nPlease ask the group admin to:\n1. Make the bot an admin\n2. OR set WEDDING_GROUP_INVITE_LINK in environment variables"
          : "Failed to create invite link. Please contact the admin.";

        await answerCallbackQuery(
          callbackQueryId,
          "Cannot create invite link",
          true
        );
        await sendMessage(chatId, errorMsg, messageId);
        return;
      }

      inviteLink = inviteResult.link;
    }

    // Update guest status - find guest first, then update by ID
    const guestToUpdate = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
    });

    if (guestToUpdate) {
      await prisma.guest.update({
        where: { id: guestToUpdate.id },
        data: { inWeddingGroup: true },
      });
    }

    // Delete the confirmation message
    await deleteMessage(chatId, messageId);

    // Send invite link
    await sendMessage(
      chatId,
      `🎉 Great! Click the link below to join the wedding group:\n\n${inviteLink}\n\n✨ All your future photos will be automatically shared with the group!`
    );

    await answerCallbackQuery(callbackQueryId, "Invite sent! ✅");
  } catch (error) {
    console.error("Error in handleGroupJoinConfirmation:", error);
    await answerCallbackQuery(
      callbackQueryId,
      "Error creating invite. Please try again.",
      true
    );
  }
}

/**
 * Handles multiple photos sent together (media group)
 */
async function handleMediaGroup(
  user: any,
  mediaGroupId: string,
  photos: any[],
  caption: string | undefined,
  chatId: number,
  messageId: number
) {
  // If this is the first photo in the group, create a new entry
  if (!mediaGroups.has(mediaGroupId)) {
    // Send "uploading photo" action
    await sendChatAction(chatId, "upload_photo");

    // Create a timeout to process all photos after 1 second
    const timeout = setTimeout(async () => {
      const group = mediaGroups.get(mediaGroupId);
      if (group) {
        await processMediaGroupPhotos(user, group.photos, chatId);
        mediaGroups.delete(mediaGroupId);
      }
    }, 1000);

    mediaGroups.set(mediaGroupId, {
      photos: [{ photos, caption, messageId }],
      timeout,
    });
  } else {
    // Add this photo to the existing group
    const group = mediaGroups.get(mediaGroupId)!;
    group.photos.push({ photos, caption, messageId });
  }
}

/**
 * Process all photos in a media group
 */
async function processMediaGroupPhotos(
  user: any,
  photoMessages: any[],
  chatId: number
) {
  try {
    // Send "uploading photo" action
    await sendChatAction(chatId, "upload_photo");

    let guest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
    });

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          telegramUserId: BigInt(user.id),
          telegramUsername: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    }

    let successCount = 0;
    let failCount = 0;

    for (const photoMsg of photoMessages) {
      const result = await uploadSinglePhoto(
        user,
        guest,
        photoMsg.photos,
        photoMsg.caption
      );

      if (result.success) {
        successCount++;
        // Send photo to wedding group chat if user is in the group
        if (WEDDING_GROUP_CHAT_ID && guest?.inWeddingGroup) {
          const groupCaption = `📸 Photo from ${user.first_name}${
            photoMsg.caption ? `\n\n${photoMsg.caption}` : ""
          }`;
          const highestResPhoto = getHighestResolutionPhoto(photoMsg.photos);
          if (highestResPhoto) {
            await sendPhotoToChat(
              WEDDING_GROUP_CHAT_ID,
              highestResPhoto.file_id,
              groupCaption
            );
          }
        }
      } else {
        failCount++;
      }
    }

    // Send summary message
    let summaryMessage = "";
    if (successCount > 0) {
      summaryMessage += `✅ ${successCount} photo(s) added to the wedding gallery!\n`;
    }
    if (failCount > 0) {
      summaryMessage += `❌ ${failCount} photo(s) failed to upload.`;
    }

    await sendMessage(chatId, summaryMessage);
  } catch (error) {
    console.error("Error processing media group:", error);
    await sendMessage(
      chatId,
      "Sorry, there was an error uploading your photos."
    );
  }
}

/**
 * Uploads a single photo and returns the result
 */
async function uploadSinglePhoto(
  user: any,
  guest: any,
  photos: any[],
  caption: string | undefined
): Promise<{ success: boolean; uploadResult?: any }> {
  try {
    const highestResPhoto = getHighestResolutionPhoto(photos);
    if (!highestResPhoto) {
      return { success: false };
    }

    const fileInfo = await getFileInfo(highestResPhoto.file_id);
    if (!fileInfo || !fileInfo.file_path) {
      return { success: false };
    }

    const fileBuffer = await downloadTelegramFile(fileInfo.file_path);
    if (!fileBuffer) {
      return { success: false };
    }

    const fileExtension = fileInfo.file_path.split(".").pop() || "jpg";
    const fileName = `photo-${user.id}-${Date.now()}.${fileExtension}`;
    const uploadResult = await uploadPhotoToStorage(fileBuffer, fileName);

    if (!uploadResult) {
      return { success: false };
    }

    await prisma.photo.create({
      data: {
        guestId: guest.id,
        storagePath: uploadResult.path,
        publicUrl: uploadResult.publicUrl,
        telegramFileId: highestResPhoto.file_id,
        caption: caption,
      },
    });

    return { success: true, uploadResult };
  } catch (error) {
    console.error("Error in uploadSinglePhoto:", error);
    return { success: false };
  }
}

/**
 * Handles photo upload from guest (single photo)
 */
async function handlePhotoUpload(
  user: any,
  photos: any[],
  caption: string | undefined,
  chatId: number,
  messageId: number
) {
  try {
    // Send "uploading photo" action
    await sendChatAction(chatId, "upload_photo");

    // Get or create guest
    let guest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
    });

    if (!guest) {
      try {
        guest = await prisma.guest.create({
          data: {
            telegramUserId: BigInt(user.id),
            telegramUsername: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
          },
        });
      } catch (error) {
        console.error("Error auto-registering guest:", error);
        await sendMessage(
          chatId,
          "Please send /start first to register!",
          messageId
        );
        return;
      }
    }

    const result = await uploadSinglePhoto(user, guest, photos, caption);

    if (result.success && result.uploadResult) {
      await sendMessage(
        chatId,
        "✅ Your photo has been added to the wedding gallery!",
        messageId
      );

      // Always send photo to wedding group chat if configured
      if (WEDDING_GROUP_CHAT_ID) {
        try {
          const groupCaption = `📸 Photo from ${user.first_name}${
            caption ? `\n\n${caption}` : ""
          }`;
          // Use telegram file_id for faster forwarding
          const highestResPhoto = getHighestResolutionPhoto(photos);
          if (highestResPhoto) {
            await sendPhotoToChat(
              WEDDING_GROUP_CHAT_ID,
              highestResPhoto.file_id,
              groupCaption
            );
          }
        } catch (error) {
          console.error("Error sending photo to group:", error);
          // Don't fail the upload if group send fails
        }
      }
    } else {
      await sendMessage(
        chatId,
        "Sorry, there was an error uploading your photo.",
        messageId
      );
    }
  } catch (error) {
    console.error("Error in handlePhotoUpload:", error);
    await sendMessage(
      chatId,
      "Sorry, there was an error uploading your photo.",
      messageId
    );
  }
}

/**
 * Handles photo sent as document (file)
 */
async function handleDocumentPhoto(
  user: any,
  document: any,
  caption: string | undefined,
  chatId: number,
  messageId: number
) {
  try {
    // Send "uploading photo" action
    await sendChatAction(chatId, "upload_photo");

    let guest = await prisma.guest.findFirst({
      where: { telegramUserId: BigInt(user.id) },
    });

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          telegramUserId: BigInt(user.id),
          telegramUsername: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    }

    const fileInfo = await getFileInfo(document.file_id);
    if (!fileInfo || !fileInfo.file_path) {
      await sendMessage(
        chatId,
        "Could not download the photo from Telegram.",
        messageId
      );
      return;
    }

    const fileBuffer = await downloadTelegramFile(fileInfo.file_path);
    if (!fileBuffer) {
      await sendMessage(chatId, "Could not download the photo.", messageId);
      return;
    }

    const fileExtension =
      (document.file_name || fileInfo.file_path).split(".").pop() || "jpg";
    const fileName = `photo-${user.id}-${Date.now()}.${fileExtension}`;
    const uploadResult = await uploadPhotoToStorage(fileBuffer, fileName);

    if (!uploadResult) {
      await sendMessage(chatId, "Could not upload the photo.", messageId);
      return;
    }

    await prisma.photo.create({
      data: {
        guestId: guest.id,
        storagePath: uploadResult.path,
        publicUrl: uploadResult.publicUrl,
        telegramFileId: document.file_id,
        caption: caption,
      },
    });

    await sendMessage(
      chatId,
      "✅ Your photo has been added to the wedding gallery!",
      messageId
    );

    // Send photo to wedding group chat if configured
    if (WEDDING_GROUP_CHAT_ID) {
      const groupCaption = `📸 Photo from ${user.first_name}${
        caption ? `\n\n${caption}` : ""
      }`;
      await sendPhoto(
        WEDDING_GROUP_CHAT_ID,
        uploadResult.publicUrl,
        groupCaption
      );
    }
  } catch (error) {
    console.error("Error in handleDocumentPhoto:", error);
    await sendMessage(
      chatId,
      "Sorry, there was an error uploading your photo.",
      messageId
    );
  }
}
