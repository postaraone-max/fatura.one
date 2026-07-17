// lib/facebook/pages.ts
//
// Helpers for fetching Facebook Pages for a user, given a user access token.
// We need this for LivePost to obtain a Page access token and basic page info,
// and (optionally) the linked Instagram Business Account ID.

export interface FacebookPageSummary {
  id: string;
  name: string;
  accessToken: string;
  instagramBusinessId: string | null;
}

type RawInstagramBusinessAccount = {
  id?: string;
};

type RawFacebookPage = {
  id?: string;
  name?: string;
  access_token?: string;
  instagram_business_account?: RawInstagramBusinessAccount;
};

type FacebookPagesResponse = {
  data?: RawFacebookPage[];
};

const FB_GRAPH_BASE = "https://graph.facebook.com/v21.0";

/**
 * Fetches the list of Pages (with page access tokens) for a given user access token.
 *
 * NOTE:
 * - The caller must ensure the user access token has the right scopes:
 *   pages_show_list, pages_manage_posts, etc.
 * - We only return pages where id, name, and access_token are present.
 * - instagramBusinessId will be null if the Page is not linked to an Instagram
 *   Business/Creator account, or if the field is missing in the response.
 */
export async function fetchFacebookPagesForUser(
  userAccessToken: string
): Promise<FacebookPageSummary[]> {
  if (!userAccessToken) {
    throw new Error("fetchFacebookPagesForUser: userAccessToken is required");
  }

  const url = new URL("/me/accounts", FB_GRAPH_BASE);
  url.searchParams.set(
    "fields",
    "id,name,access_token,instagram_business_account"
  );
  url.searchParams.set("access_token", userAccessToken);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    // For now, just treat any error as "no pages".
    // The caller can decide how to handle "no pages" vs "actual failure".
    return [];
  }

  let json: FacebookPagesResponse;
  try {
    json = (await res.json()) as FacebookPagesResponse;
  } catch {
    return [];
  }

  const rawPages = Array.isArray(json.data) ? json.data : [];

  const pages: FacebookPageSummary[] = rawPages
    .map((p) => {
      const id = typeof p.id === "string" ? p.id : undefined;
      const name = typeof p.name === "string" ? p.name : undefined;
      const accessToken =
        typeof p.access_token === "string" ? p.access_token : undefined;

      if (!id || !name || !accessToken) {
        return null;
      }

      const instagramBusinessId =
        p.instagram_business_account &&
        typeof p.instagram_business_account.id === "string"
          ? p.instagram_business_account.id
          : null;

      return {
        id,
        name,
        accessToken,
        instagramBusinessId,
      };
    })
    .filter((p): p is FacebookPageSummary => p !== null);

  return pages;
}
