# GitHub README Designer

GitHub README Designer is a free, frontend-only app for browsing every `.md` file in a public GitHub repository, previewing it with one of five designs, and exporting a standalone HTML file.

## Features

- Discover `.md` files at any depth in a repository, including `README.md` and other Markdown documents.
- Read original Markdown with GitHub Flavored Markdown, syntax-highlighted code, tables, task lists, images, and links.
- Resolve relative image and document links using the selected file's repository path.
- Switch between Modern, Minimal, Developer, Documentation, and Premium templates.
- Preview light and dark modes, choose from five gradient themes for the Premium, Developer, Documentation, and Modern styles, and compare the original with the selected design.
- Maximize the preview to full screen and minimize it again with the toolbar or `Escape`.
- Download a standalone HTML file or copy its HTML to the clipboard.
- Remember template, preview mode, and gradient theme preferences in browser storage. Typography stays system sans-serif.
- Use public GitHub repositories without a sign-in, backend, database, or API token.

## Technology

- React and Vite
- JavaScript and Tailwind CSS
- React Router
- GitHub REST API
- React Markdown, remark-gfm, rehype-highlight, and rehype-sanitize
- Lucide React

## Run locally

Install Node.js, then run:

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run lint
npm run build
```

The production files are generated in `dist/`.

## Deploy to Cloudflare Pages

1. Connect the GitHub repository to Cloudflare Pages.
2. Select the Vite preset, or enter build command `npm run build`.
3. Set the build output directory to `dist`.
4. No environment variables or secrets are required.

For manual deployment, build the app and upload the contents of `dist/` to a Cloudflare Pages project.
