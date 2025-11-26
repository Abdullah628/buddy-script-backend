
## Buddy Script - Backend

This repository contains the backend API for Buddy Script (Node.js, Express, TypeScript, MongoDB).

**Contents**
- `src/modules/post` - Post module (create, feed, timeline, single post, soft delete, update)
- `src/modules/comment` - Comment module (create, list, replies, update, delete)
- `src/modules/like` - Like module (like/unlike posts & comments, list likers)
- `src/modules/upload` - Upload module (Cloudinary image upload)

**Tech stack**: Node.js, TypeScript, Express, Mongoose, Zod, Cloudinary

---

**Quick start (local)**

1. Install dependencies

```bash
npm install
```

2. Provide environment variables

Create a `.env` file based on the repo `.env` and set required keys (see Environment Variables section).

3. Development (hot reload)

```bash
npm run dev
```

4. Build & run (production)

```bash
npm run build
npm start
```

---

**Environment Variables** (required)

- `PORT` - server port
- `DB_URL` - MongoDB connection string
- `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES` - JWT config
- `EXPRESS_SESSION_SECRET` - session secret
- `FRONTEND_URL` - frontend origin
- `BACKEND_URL` - backend base URL
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

Optional security and other keys are already present in the example `.env`.

---

**NPM scripts**

- `npm run dev` - start dev server with ts-node-dev
- `npm run build` - compile TypeScript to `./dist`
- `npm start` - run compiled server from `./dist`

---

**API Overview**

Base path: `/api/v1`

Authentication: endpoints that modify data require authentication via `checkAuth()` middleware (JWT).

All responses follow the `sendResponse` format: `{ success, statusCode, message, data, meta? }`.

-- Posts

- `POST /api/v1/posts` — create post
  - Body: `{ text?: string, media?: [{ url, type, meta }], visibility?: 'public'|'private', tags?: string[] }`
  - Auth required

- `GET /api/v1/posts/feed?page=1&limit=20` — global public feed

- `GET /api/v1/posts/user/:userId?page=1&limit=20` — user timeline (if requesting user != owner, only public posts returned)

- `GET /api/v1/posts/:postId` — get single post (includes topComments placeholder)

- `PATCH /api/v1/posts/:postId` — update post (auth + owner)

- `DELETE /api/v1/posts/:postId` — soft delete (auth + owner)

-- Comments

- `POST /api/v1/posts/:postId/comments` — add comment to a post
  - Body: `{ text: string, parentCommentId?: ObjectId }`
  - Auth required

- `GET /api/v1/posts/:postId/comments?page=1&limit=20` — list top-level comments (paginated)

- `GET /api/v1/posts/:postId/comments/:commentId/replies?page=1&limit=20` — list replies to a comment

- `PATCH /api/v1/comments/:commentId` — update comment (auth + owner)

- `DELETE /api/v1/comments/:commentId` — soft delete comment (auth + owner)

-- Likes

- `POST /api/v1/posts/:postId/like` — like a post (auth required)
- `DELETE /api/v1/posts/:postId/like` — unlike a post (auth required)
- `GET /api/v1/posts/:postId/likes?page=1&limit=50` — list likers for a post

- `POST /api/v1/comments/:commentId/like` — like a comment (auth required)
- `DELETE /api/v1/comments/:commentId/like` — unlike a comment (auth required)
- `GET /api/v1/comments/:commentId/likes?page=1&limit=50` — list likers for a comment

-- Uploads (Cloudinary)

- `POST /api/v1/uploads` — upload an image and return hosted URL
  - Body (JSON): `{ file: '<data-uri or remote url>', folder?: 'folder-name' }` OR send multipart with `req.file` (if you add multer)
  - Auth required
  - Response: `{ data: { url, publicId, width, height, format } }`

Example upload request (base64 data URI):

```http
POST /api/v1/uploads
Authorization: Bearer <token>
Content-Type: application/json

{
  "file": "data:image/png;base64,iVBORw0K...",
  "folder": "buddy-script/posts"
}
```

---

**Database modeling notes**

- Post document includes: authorSnapshot, media[], visibility, likesCount, commentsCount, isDeleted, tags, pinned
- Comment document includes: postId, authorSnapshot, text, likesCount, parentCommentId|null, isDeleted
- Like document includes: targetType ('post'|'comment'), targetId, userId, timestamps

Indexes are added on common query fields (authorId, createdAt, visibility, postId, parentCommentId, etc.) to support efficient feeds and timelines.

---

**Deployment tips (Vercel)**

- Ensure all required environment variables (esp. Cloudinary and DB) are set in the Vercel project settings — missing env vars can cause serverless functions to fail on import. The upload module is now lazy-configured but still requires Cloudinary vars when actually used.
- Use `npm run build` and `npm start` for production builds; Vercel will run the appropriate build step configured in the project settings.

---

If you want, I can:
- Add `multer` integration for multipart file uploads.
- Integrate automatic Cloudinary upload inside `PostServices.createPost` to accept media data URIs with the post creation request.
- Add example Postman collection or curl scripts for all endpoints.

If you'd like any of those, tell me which and I'll implement it.
# buddy-script-backend
