module.exports = {
    globDirectory: 'dist/',
    globPatterns: [
        '**/*.{html,css,js,pdf,png,jpg,jpeg,svg,webp,woff,woff2}'
    ],
    globIgnores: [
        'sw.js',
        'sw-src.js',
        'workbox-*.js'
    ],
    swDest: 'dist/sw.js',
    // Don't cache files larger than 2MB
    maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
    // Runtime caching rules
    runtimeCaching: [
        {
            // HTML pages - Network First
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
                cacheName: 'pages-cache',
                expiration: {
                    maxEntries: 50,
                },
            },
        },
        {
            // CSS and JS - Cache First
            urlPattern: ({ request }) =>
                request.destination === 'style' || request.destination === 'script',
            handler: 'CacheFirst',
            options: {
                cacheName: 'static-resources',
                expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
            },
        },
        {
            // Images - Cache First
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
                cacheName: 'images-cache',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
                },
            },
        },
        {
            // Fonts - Cache First
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
                cacheName: 'fonts-cache',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                },
            },
        },
        {
            // PDFs - Stale While Revalidate
            urlPattern: ({ url }) => url.pathname.endsWith('.pdf'),
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'pdf-cache',
            },
        },
    ],
    skipWaiting: true,
    clientsClaim: true,
};
