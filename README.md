<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Prism LLM — Frontend

A pure UI client for the Prism LLM platform. The frontend contains **no AI logic and no authentication secrets** — it is simply a beautiful interface that talks to the backend gateway.

## Architecture

```
Browser (Next.js frontend)
       │  POST /v1/chat
       │  POST /v1/chat/stream  (SSE)
       ▼
Backend Gateway  ←→  AI Providers (Gemini, Qwen, Claude …)
```

All processing (AI inference, authentication, database) lives on the backend. The frontend only needs one environment variable: the backend URL.

---

## Run Locally

**Prerequisites:** Node.js 18+

1. Clone the repo:
   ```bash
   git clone https://github.com/mxl4r/Prism-LLM-frontend.git
   cd Prism-LLM-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` and set the backend URL:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://system.prism-llm.tech:8080
   ```
   Replace with `http://localhost:<port>` if running the backend locally.

5. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. **Import** your GitHub repo into [Vercel](https://vercel.com/new).

2. **Set the environment variable** in the Vercel dashboard:
   - Go to **Project → Settings → Environment Variables**
   - Add:
     | Name | Value |
     |------|-------|
     | `NEXT_PUBLIC_API_BASE_URL` | `http://system.prism-llm.tech:8080` |
   - Apply to: **Production**, **Preview**, **Development**

3. **Deploy.** Vercel will detect Next.js automatically and run `next build`.

> **Note on CORS:** Since the frontend is served from `*.vercel.app` (HTTPS) and calls the backend over HTTP, the backend must respond with appropriate CORS headers:
> ```
> Access-Control-Allow-Origin: https://your-app.vercel.app
> Access-Control-Allow-Methods: POST, OPTIONS
> Access-Control-Allow-Headers: Content-Type
> ```

---

## API Contract

The frontend calls these two endpoints:

### `POST /v1/chat`
Non-streaming. Returns the full response at once.

**Request:**
```json
{
  "model": "gemini-2.5-flash-latest",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

**Response:**
```json
{ "content": "Hello! How can I help you?" }
```

---

### `POST /v1/chat/stream`
Streaming via Server-Sent Events (SSE).

**Request:** Same as above.

**Response stream:**
```
data: {"delta":"Hello"}
data: {"delta":"! How can"}
data: {"delta":" I help you?"}
data: [DONE]
```

> If the stream endpoint returns `404`, the frontend automatically falls back to `/v1/chat`.
