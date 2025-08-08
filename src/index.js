export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // For root path, serve index.html
    if (url.pathname === '/') {
      url.pathname = '/index.html';
    }
    
    // Get the asset
    const asset = await env.ASSETS.fetch(url);
    
    // Add security headers
    const response = new Response(asset.body, {
      status: asset.status,
      statusText: asset.statusText,
      headers: {
        ...asset.headers,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });
    
    return response;
  }
};