// Meta LivePost adapter for Facebook Page + Instagram Business.
//
// - Uses MetaConnectionRecord from KV (getMetaConnection).
// - For Facebook: posts images/videos to the connected Page.
// - For Instagram: creates a media container then publishes it via the
//   Instagram Graph API using instagramBusinessId.

import { getMetaConnection } from "./storage";
import type { MetaConnectionRecord } from "./types";

export type MetaPostPayload = {
  userId: string; // Same userId used for KV: postara:conn:{userId}:facebook
  pageId?: string; // Optional override; otherwise use primary page from MetaConnectionRecord
  caption: string; // Final caption to publish
  mediaUrl: string; // Public URL to image or video (e.g. Cloudinary)
  mediaType: "image" | "video";
  jobId: string; // Late job id for diagnostics
  scheduledAt?: string; // Optional ISO timestamp (for logs only)
};

type FacebookGraphError = {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  fbtrace_id?: string;
};

type FacebookGraphResponse = {
  id?: string;
  error?: FacebookGraphError;
};

async function parseFacebookResponse(
  res: Response
): Promise<{ ok: boolean; postId?: string; error?: string }> {
  let data: FacebookGraphResponse | null = null;
  try {
    data = (await res.json()) as FacebookGraphResponse;
  } catch {
    // If JSON parsing fails, fall back to status text.
  }

  if (!res.ok) {
    const e = data?.error;
    const msgParts: string[] = [];
    if (e?.message) msgParts.push(e.message);
    if (typeof e?.code === "number") msgParts.push(`code=${e.code}`);
    if (typeof e?.error_subcode === "number") {
      msgParts.push(`subcode=${e.error_subcode}`);
    }
    const msg =
      msgParts.length > 0
        ? msgParts.join(" ")
        : `Facebook API error (status ${res.status})`;
    return { ok: false, error: msg };
  }

  if (!data?.id) {
    return { ok: false, error: "Facebook API response missing post id" };
  }

  return { ok: true, postId: data.id };
}

// ------------------------
// Facebook Page publishing
// ------------------------

async function postImageToFacebookPage(args: {
  pageId: string;
  pageAccessToken: string;
  caption: string;
  mediaUrl: string;
}): Promise<{ ok: boolean; postId?: string; error?: string }> {
  const { pageId, pageAccessToken, caption, mediaUrl } = args;

  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
    pageId
  )}/photos`;

  const body = new URLSearchParams();
  body.set("caption", caption);
  body.set("url", mediaUrl);
  body.set("access_token", pageAccessToken);

  const res = await fetch(url, {
    method: "POST",
    body,
  });

  return parseFacebookResponse(res);
}

async function postVideoToFacebookPage(args: {
  pageId: string;
  pageAccessToken: string;
  caption: string;
  mediaUrl: string;
}): Promise<{ ok: boolean; postId?: string; error?: string }> {
  const { pageId, pageAccessToken, caption, mediaUrl } = args;

  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
    pageId
  )}/videos`;

  const body = new URLSearchParams();
  body.set("description", caption);
  body.set("file_url", mediaUrl);
  body.set("access_token", pageAccessToken);

  const res = await fetch(url, {
    method: "POST",
    body,
  });

  return parseFacebookResponse(res);
}

/**
 * publishToFacebookPage
 *
 * Server-side Meta adapter for LivePost (Facebook Page).
 * - Looks up MetaConnectionRecord in KV using userId.
 * - Uses primary page (or optional override) + pageAccessToken.
 * - Posts image or video with the provided caption + mediaUrl.
 * - Returns a simple result: { ok, postId?, error? }.
 *
 * No tokens are logged or returned.
 */
export async function publishToFacebookPage(
  payload: MetaPostPayload
): Promise<{
  ok: boolean;
  postId?: string;
  error?: string;
}> {
  const { userId, pageId, caption, mediaUrl, mediaType } = payload;

  // 1) Load Meta connection from KV
  const conn: MetaConnectionRecord | null = await getMetaConnection(userId);

  if (!conn) {
    return { ok: false, error: "No Meta connection found for this user" };
  }

  if (conn.status !== "active") {
    return {
      ok: false,
      error: `Meta connection is not active (status=${conn.status})`,
    };
  }

  const effectivePageId = pageId ?? conn.pageId;
  const pageAccessToken = conn.pageAccessToken;

  if (!effectivePageId || !pageAccessToken) {
    return {
      ok: false,
      error: "Meta connection missing page id or page access token",
    };
  }

  if (!mediaUrl) {
    return { ok: false, error: "Missing mediaUrl for Facebook post" };
  }

  if (!caption) {
    // We still allow empty caption; Facebook supports that.
  }

  // 2) Dispatch based on media type
  if (mediaType === "image") {
    return postImageToFacebookPage({
      pageId: effectivePageId,
      pageAccessToken,
      caption,
      mediaUrl,
    });
  }

  if (mediaType === "video") {
    return postVideoToFacebookPage({
      pageId: effectivePageId,
      pageAccessToken,
      caption,
      mediaUrl,
    });
  }

  return {
    ok: false,
    error: `Unsupported mediaType: ${mediaType}`,
  };
}

// ------------------------------
// Instagram Business publishing
// ------------------------------

async function createInstagramMediaContainer(args: {
  instagramBusinessId: string;
  pageAccessToken: string;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}): Promise<{ ok: boolean; creationId?: string; error?: string }> {
  const { instagramBusinessId, pageAccessToken, caption, mediaUrl, mediaType } =
    args;

  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
    instagramBusinessId
  )}/media`;

  const body = new URLSearchParams();
  body.set("caption", caption);
  body.set("access_token", pageAccessToken);

  if (mediaType === "video") {
    body.set("video_url", mediaUrl);
  } else {
    body.set("image_url", mediaUrl);
  }

  const res = await fetch(url, {
    method: "POST",
    body,
  });

  const parsed = await parseFacebookResponse(res);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  return { ok: true, creationId: parsed.postId };
}

async function publishInstagramMedia(args: {
  instagramBusinessId: string;
  pageAccessToken: string;
  creationId: string;
}): Promise<{ ok: boolean; postId?: string; error?: string }> {
  const { instagramBusinessId, pageAccessToken, creationId } = args;

  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
    instagramBusinessId
  )}/media_publish`;

  const body = new URLSearchParams();
  body.set("creation_id", creationId);
  body.set("access_token", pageAccessToken);

  const res = await fetch(url, {
    method: "POST",
    body,
  });

  return parseFacebookResponse(res);
}

/**
 * publishToInstagramAccount
 *
 * Server-side Meta adapter for LivePost (Instagram Business/Creator).
 * - Loads MetaConnectionRecord (same KV record as Facebook).
 * - Uses instagramBusinessId + pageAccessToken.
 * - Creates a media container, then publishes it.
 */
export async function publishToInstagramAccount(
  payload: MetaPostPayload
): Promise<{
  ok: boolean;
  postId?: string;
  error?: string;
}> {
  const { userId, caption, mediaUrl, mediaType } = payload;

  const conn: MetaConnectionRecord | null = await getMetaConnection(userId);

  if (!conn) {
    return { ok: false, error: "No Meta connection found for this user" };
  }

  if (conn.status !== "active") {
    return {
      ok: false,
      error: `Meta connection is not active (status=${conn.status})`,
    };
  }

  const instagramBusinessId = conn.instagramBusinessId;
  const pageAccessToken = conn.pageAccessToken;

  if (!instagramBusinessId) {
    return {
      ok: false,
      error: "No Instagram business account connected for this user",
    };
  }

  if (!pageAccessToken) {
    return {
      ok: false,
      error: "Meta connection missing page access token for Instagram",
    };
  }

  if (!mediaUrl) {
    return { ok: false, error: "Missing mediaUrl for Instagram post" };
  }

  if (mediaType !== "image" && mediaType !== "video") {
    return {
      ok: false,
      error: `Unsupported mediaType for Instagram: ${mediaType}`,
    };
  }

  const container = await createInstagramMediaContainer({
    instagramBusinessId,
    pageAccessToken,
    caption,
    mediaUrl,
    mediaType,
  });

  if (!container.ok || !container.creationId) {
    return {
      ok: false,
      error: container.error ?? "Failed to create Instagram media container",
    };
  }

  const publish = await publishInstagramMedia({
    instagramBusinessId,
    pageAccessToken,
    creationId: container.creationId,
  });

  if (!publish.ok) {
    return {
      ok: false,
      error: publish.error ?? "Failed to publish Instagram media",
    };
  }

  return {
    ok: true,
    postId: publish.postId,
  };
}
