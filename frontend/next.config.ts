/** @type {import('next').NextConfig} */

const fs = require("fs");
const path = require("path");

const nextConfig = {
    images: { unoptimized: true },
    output: 'export',
    distDir: './build',
    env: {
        APP_VERSION: JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'))).version,
    },
}

export default nextConfig