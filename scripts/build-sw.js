// Simple service worker generator
// Copies/sw.js template to _site folder during build

const SW_SOURCE = `const CACHE_VERSION = 'v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/resume.pdf',
  '/404.html',
];

const CACHE_STRATEGIES = {
  pages: {
    cacheName: \`pages-\${CACHE_VERSION}\`,
    maxEntries: 50,
  },
  static: {
    cacheName: \`static-\${CACHE_VERSION}\`,
    maxEntries: 60,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  images: {
    cacheName: \`images-\${CACHE_VERSION}\`,
    maxEntries: 100,
    maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
  },
  fonts: {
    cacheName: \`fonts-\${CACHE_VERSION}\`,
    maxEntries: 20,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
  pdfs: {
    cacheName: \`pdfs-\${CACHE_VERSION}\`,
  },
};

// Install: Precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(\`precache-\${CACHE_VERSION}\`).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !name.includes(CACHE_VERSION) && !name.startsWith(\`precache-\${CACHE_VERSION}\`))
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Helper: Get cache strategy based on request
function getStrategy(request) {
  const url = new URL(request.url);
  
  if (request.mode === 'navigate') {
    return { type: 'network-first', ...CACHE_STRATEGIES.pages };
  }
  if (request.destination === 'image') {
    return { type: 'cache-first', ...CACHE_STRATEGIES.images };
  }
  if (request.destination === 'font') {
    return { type: 'cache-first', ...CACHE_STRATEGIES.fonts };
  }
  if (url.pathname.endsWith('.pdf')) {
    return { type: 'stale-while-revalidate', ...CACHE_STRATEGIES.pdfs };
  }
  if (request.destination === 'style' || request.destination === 'script') {
    return { type: 'cache-first', ...CACHE_STRATEGIES.static };
  }
  
  return null;
}

// Helper: Network First strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper: Cache First strategy
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is still fresh
    if (!maxAge) return cachedResponse;
    
    const dateHeader = cachedResponse.headers.get('date');
    if (dateHeader) {
      const age = Date.now() - new Date(dateHeader).getTime();
      if (age < maxAge) {
        return cachedResponse;
      }
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper: Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || networkPromise;
}

// Fetch: Handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const strategy = getStrategy(event.request);
  
  if (!strategy) return;
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy.type) {
          case 'network-first':
            return await networkFirst(event.request, strategy.cacheName);
          case 'cache-first':
            return await cacheFirst(event.request, strategy.cacheName, strategy.maxAge);
          case 'stale-while-revalidate':
            return await staleWhileRevalidate(event.request, strategy.cacheName);
          default:
            return fetch(event.request);
        }
      } catch (error) {
        // Return offline fallback if available
        if (event.request.mode === 'navigate') {
          return caches.match('/404.html');
        }
        throw error;
      }
    })()
  );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
`;

const destPath = "./_site/sw.js";

try {
  await Deno.mkdir("./_site", { recursive: true });
  await Deno.writeTextFile(destPath, SW_SOURCE);
  console.log("Service worker generated successfully at", destPath);
} catch (error) {
  console.error("Failed to generate service worker:", error);
  Deno.exit(1);
}
