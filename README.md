This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Custom Domain Setup

If you purchase a custom domain, you generally **do not** need to update hardcoded links in this codebase for features like social sharing. The WhatsApp sharing feature uses `window.location.href` to automatically adapt to whatever domain the user is currently on.

However, if you ever add advanced SEO features or sitemaps, here are the places you might need to specify your custom domain:
- **`src/app/layout.tsx`**: If you add a `metadataBase` to the `metadata` object, you should set it to `new URL('https://your-custom-domain.com')`. This helps Next.js resolve relative image paths for Opengraph/Twitter cards.
- **`next-sitemap.config.js`** (if added in the future): The `siteUrl` property will need to point to your new domain.
- **Analytics/External Services**: Be sure to update Google Analytics, Search Console, or any other external services to whitelist your new domain.
