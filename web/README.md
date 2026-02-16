This is the ResumeTailor web app built with [Next.js](https://nextjs.org).

## Development

Run the development server:

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

## Build

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

## Testing and Checks

Run unit tests:

```bash
npm run test
```

Run typecheck, lint, and tests together:

```bash
npm run check
```

Run CI-ready pipeline (typecheck + lint + tests + build):

```bash
npm run ci
```

Test files are discovered with Vitest using `src/**/*.test.ts` and `src/**/*.test.tsx`.

## Notes

- API base URL is controlled by `NEXT_PUBLIC_API_BASE_URL`.
- Production deployment should run `npm run ci` before publishing.
