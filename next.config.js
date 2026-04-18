/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.ibb.co" },
      { hostname: "ibb.co" },
      { hostname: "www.figma.com" },
      { hostname: "plus.unsplash.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      // Facebook CDN (user uploaded images)
      { hostname: "*.fbcdn.net" },
      { hostname: "*.fna.fbcdn.net" },
      { hostname: "scontent*.fbcdn.net" },
      { hostname: "scontent*.fna.fbcdn.net" },
      // Common image hosts
      { hostname: "*.imgur.com" },
      { hostname: "i.imgur.com" },
      { hostname: "*.cloudinary.com" },
      { hostname: "*.amazonaws.com" },
      { hostname: "*.googleusercontent.com" },
      { hostname: "*.dropboxusercontent.com" },
      { hostname: "*.mediafire.com" },
      { hostname: "*.pinimg.com" },
      { hostname: "*.cdninstagram.com" },
      { hostname: "*.twimg.com" },
      { hostname: "*.tiktokcdn.com" },
      { hostname: "*.ytimg.com" },
      { hostname: "*.vimeocdn.com" },
      { hostname: "*.wixstatic.com" },
      { hostname: "*.squarespace.com" },
      { hostname: "*.shopify.com" },
      { hostname: "*.bigcartel.com" },
      { hostname: "*.etsy.com" },
      { hostname: "*.ebayimg.com" },
      { hostname: "*.alicdn.com" },
      { hostname: "*.aliexpress.com" },
    ],
  },
};

module.exports = nextConfig;
