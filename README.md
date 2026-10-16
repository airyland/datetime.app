# Datetime.app

[datetime.app](https://datetime.app) is a clean and powerful time viewing and conversion tool designed for developers, remote teams, and anyone who needs to work with different time zones.

## Features

- Clean and intuitive interface
- Precise time display and conversion
- Support for multiple time formats
- Convenient timezone conversion
- Perfect for remote team collaboration
- Developer-friendly features

## Technology

datetime.app is developed by the [datetime.app](https://datetime.app) team, powered by [v0.dev](https://v0.dev) and Windsurf, dedicated to providing the best time management experience for our users.

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build
```

### Running with Docker

To run the application using Docker, first ensure you have Docker installed.
The Docker image is published to GitHub Container Registry (ghcr.io).

#### Docker run

```bash
# Pull the latest image from ghcr.io
docker pull ghcr.io/airyland/datetime.app:latest

# Run the Docker container
docker run -d -p 3000:3000 --name datetime-app ghcr.io/airyland/datetime.app:latest
```

Then, open your browser and navigate to `http://localhost:3000`.

#### Docker compose

See the `docker-compose.yaml` file in the repository for a complete setup.

## Other Products

Check out our other tools and services:

- [Query.Domains](https://query.domains) - Domain name search and availability checker
- [Favicon.im](https://favicon.im) - Website favicon generator and manager
- [Done.is](https://done.is) - Task management and productivity tool
- [Logo.surf](https://logo.surf) - Logo design and branding platform
- [Qrcode.fun](https://qrcode.fun) - Creative QR code generator

## License

MIT License

Copyright (c) 2025 datetime.app

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Zeabur deployment

The `codex/datetime-zeabur` branch preserves the Cloudflare production source deployed on 2026-10-11 (Worker version `23834b61-e20a-42db-802f-f5577960f034`, application base `105c9f2`), including the patched Next.js 15.5.27 / React 19.1.8 runtime and bundled blog data. It does not include the local redesign.

Deploy the repository Dockerfile on Zeabur with port 3000. Set `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`, `NEXT_PUBLIC_ANALYTICS_DOMAIN` and `NEXT_PUBLIC_ANALYTICS_SCRIPT` as build environment variables. The Dockerfile uses Next.js standalone output and an unprivileged runtime user.

This deployment has no Cloudflare bindings, OpenNext adapter or R2 credentials. Next.js uses its default memory/filesystem cache within a single service replica. Cache contents may be rebuilt after deployment or restart; no user data depends on this cache. Keep one replica unless a shared cache is explicitly introduced.

The previous Worker and R2 bucket are retained for rollback. The existing Cloudflare www-to-apex redirect should remain enabled.
