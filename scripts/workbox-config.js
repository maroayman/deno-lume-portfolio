module.exports = {
    globDirectory: 'dist/',
    globPatterns: [
        '**/*.{html,css,js,pdf,png,jpg,jpeg,svg,webp,woff,woff2}'
    ],
    globIgnores: [
        'sw.js',
        'workbox-*.js'
    ],
    swSrc: 'dist/sw-src.js',
    swDest: 'dist/sw.js',
    // Don't cache files larger than 2MB
    maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
};
