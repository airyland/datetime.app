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
