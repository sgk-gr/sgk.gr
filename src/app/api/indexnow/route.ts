import { NextResponse } from 'next/server';
import { submitToIndexNow, INDEXNOW_KEY, INDEXNOW_HOST } from '@/lib/indexnow';

export async function POST(request: Request) {
  try {
    let urls: string[] = [];
    try {
      const body = await request.json();
      if (body && Array.isArray(body.urls)) {
        urls = body.urls;
      }
    } catch {
      // Body may be empty
    }

    if (urls.length === 0) {
      urls = [
        'https://www.sgk.gr',
        'https://www.sgk.gr/blog',
        'https://www.sgk.gr/blog/pos-i-sgk-aftomatopoiise-tilepikoinonies-optikes-ines-ai-aftopsies',
        'https://www.sgk.gr/ai-agents',
        'https://www.sgk.gr/order-ai-agent',
        'https://www.sgk.gr/case-studies',
      ];
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'IndexNow ready',
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    endpoints: ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow'],
    instructions: 'Send a POST request with { urls: [...] } to submit new URLs for instant indexing.',
  });
}
