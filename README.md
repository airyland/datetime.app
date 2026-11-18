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


## Production deployment

Zeabur builds the `deploy` branch using the repository Dockerfile on port 3000.
Set `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`, `NEXT_PUBLIC_ANALYTICS_DOMAIN` and
`NEXT_PUBLIC_ANALYTICS_SCRIPT` before building; Next.js embeds these values at build time.
The container runs `pnpm start` as an unprivileged user and uses the local Next.js cache;
Cloudflare Workers bindings and R2 are not required. Keep one replica unless shared
caching is introduced. Synchronize Zeabur's Dockerfile override with this file when
changing the Dockerfile. The previous `codex/datetime-zeabur` deployment can be used
for rollback. Publishing a GHCR image alone does not update this source deployment.

### Changelog

- 2026-10-22: Use `deploy` as the production source, preserve public build variables,
  exclude local files from the Docker context, and align the Zeabur build override.

### Holiday calculation isolation

All holiday API and server-rendered country/region pages share strict query validation:
`year` must contain exactly four digits and be within **1900–2100**. Malformed,
duplicate and unexpected API parameters return 400 before calendar calculation.

Calendar calculations run outside the HTTP event loop in a bounded Worker runner:
maximum two concurrent tasks, two-second deadline, explicit termination, 96 MiB
old-generation limit, and bounded validated results. Identical requests coalesce;
a 128-entry LRU cache expires after one hour. Worker failure/overload returns 503
with `Retry-After: 1`, rather than sample holiday data. There are no automatic retries.

Regression checks (Node 22.19+):

```sh
node --experimental-strip-types --test lib/server/holidays.test.mjs
# With a local production server on port 43174:
node --test scripts/test-holiday-api.mjs
```

Changelog: 2026-11-18 — reject unbounded holiday years and isolate all server-side
calendar calculations after profiling a non-converging astronomical calculation
that blocked the entire HTTP event loop.

Changelog: 2026-11-18 — share the calendar calculator across Next's API/SSR module
graphs so the two-worker limit, cache and in-flight coalescing apply to the whole
process; recognize typed failures across those module boundaries.
