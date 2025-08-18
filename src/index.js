export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Enhanced routing for multi-page site
    const routes = {
      '/': '/index.html',
      '/services': '/services.html',
      '/about': '/about.html',
      '/audit': '/audit.html',
      '/free-audit': '/audit.html', // Alias for marketing campaigns
      '/security-audit': '/audit.html', // SEO-friendly alias
    };
    
    // Handle route mapping
    if (routes[url.pathname]) {
      url.pathname = routes[url.pathname];
    }
    
    // Handle clean URLs (without .html extension)
    if (!url.pathname.includes('.') && url.pathname !== '/') {
      const cleanPath = url.pathname + '.html';
      url.pathname = cleanPath;
    }
    
    // Get the asset
    const asset = await env.ASSETS.fetch(url);
    
    // Enhanced security headers
    const response = new Response(asset.body, {
      status: asset.status,
      statusText: asset.statusText,
      headers: {
        ...asset.headers,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        // Cache control for better performance
        'Cache-Control': url.pathname.includes('.css') || url.pathname.includes('.js') 
          ? 'public, max-age=31536000, immutable' 
          : 'public, max-age=3600'
      }
    });
    
    return response;
  }
};