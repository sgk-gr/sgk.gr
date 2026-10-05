export const INDEXNOW_KEY = 'a20be9a36f2b8a1d99b77e6695107894';
export const INDEXNOW_HOST = 'www.sgk.gr';
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

export interface IndexNowResponse {
  success: boolean;
  status: number;
  message: string;
  urls: string[];
}

export async function submitToIndexNow(urls: string[]): Promise<IndexNowResponse> {
  if (!urls || urls.length === 0) {
    return {
      success: false,
      status: 400,
      message: 'No URLs provided',
      urls: [],
    };
  }

  // Ensure all URLs are absolute and formatted correctly
  const formattedUrls = urls.map((url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${INDEXNOW_HOST}${url.startsWith('/') ? '' : '/'}${url}`;
  });

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: formattedUrls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const status = res.status;
    // IndexNow returns 200 (OK) or 202 (Accepted)
    const success = status === 200 || status === 202;

    return {
      success,
      status,
      message: success
        ? `Successfully submitted ${formattedUrls.length} URL(s) to IndexNow (Bing/Perplexity/Copilot)`
        : `IndexNow returned status ${status}`,
      urls: formattedUrls,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error instanceof Error ? error.message : 'Unknown error during IndexNow submission',
      urls: formattedUrls,
    };
  }
}
