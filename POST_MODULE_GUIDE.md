# Post Module Implementation - Complete API Reference

## Overview
The Post module has been fully implemented following the same patterns as the User module for consistency in error handling, data formatting, and code structure.

## Files Created/Updated

### 1. **post.interface.ts** - TypeScript Interfaces
- `IPost` - Main post interface with all fields
- `IAuthorSnapshot` - Snapshot of author data at post creation
- `IMedia` - Media file structure
- `IMediaMeta` - Media metadata

### 2. **post.model.ts** - Mongoose Schema & Model
- Schema with proper field types and validations
- Indexed fields for performance:
  - `authorId` + `createdAt` (for user timeline)
  - `visibility` + `createdAt` (for feed)
  - `isDeleted` + `createdAt` (for soft deletes)
  - `tags` (for tag filtering)
  - `pinned` + `createdAt` (for pinned posts)

### 3. **post.validation.ts** - Zod Validation Schemas
- `createPostZodSchema` - Validates text, media, visibility, tags
- `updatePostZodSchema` - Optional fields for updates

### 4. **post.service.ts** - Business Logic
Service methods:
- `createPost(payload, decodedToken)` - Creates post with author snapshot
- `getFeed(query)` - Returns public posts with pagination
- `getUserTimeline(userId, query, currentUserId)` - User posts (public or own)
- `getSinglePost(postId)` - Retrieves single post with comments placeholder
- `deletePost(postId, decodedToken)` - Soft delete with ownership validation
- `updatePost(postId, payload, decodedToken)` - Updates post with ownership check

### 5. **post.controller.ts** - Route Handlers
Implements all 5 endpoints with:
- Error handling via `catchAsync`
- Response formatting via `sendResponse`
- Token validation via `decodedToken`

### 6. **post.route.ts** - API Routes
All routes registered with proper middleware:
- `POST /api/v1/posts` - Create (auth + validation required)
- `GET /api/v1/posts/feed?page=1&limit=20` - Global feed
- `GET /api/v1/posts/user/:userId?page=1&limit=20` - User timeline
- `GET /api/v1/posts/:postId` - Single post
- `DELETE /api/v1/posts/:postId` - Soft delete (auth required)
- `PATCH /api/v1/posts/:postId` - Update (auth + validation required)

## API Endpoint Details

### 1. Create Post
```bash
POST /api/v1/posts
Authorization: Bearer <token>

Request Body:
{
  "text": "string (1-2000 chars)",
  "visibility": "public" | "private",
  "media": [
    {
      "url": "s3://...",
      "type": "image/jpeg",
      "meta": { ... }
    }
  ],
  "tags": ["string", "string"]
}

Response:
{
  "success": true,
  "statusCode": 201,
  "message": "Post Created Successfully",
  "data": { post object }
}
```

### 2. Get Feed (Global Public Posts)
```bash
GET /api/v1/posts/feed?page=1&limit=20

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Feed Retrieved Successfully",
  "data": [ array of posts ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPage": 5
  }
}
```

### 3. Get User Timeline
```bash
GET /api/v1/posts/user/:userId?page=1&limit=20

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "User Timeline Retrieved Successfully",
  "data": [ array of posts ],
  "meta": { pagination meta }
}
```

### 4. Get Single Post
```bash
GET /api/v1/posts/:postId

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Post Retrieved Successfully",
  "data": {
    ...post object,
    "topComments": []
  }
}
```

### 5. Delete Post (Soft Delete)
```bash
DELETE /api/v1/posts/:postId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Post Deleted Successfully",
  "data": { deleted post object with isDeleted: true }
}
```

### 6. Update Post
```bash
PATCH /api/v1/posts/:postId
Authorization: Bearer <token>

Request Body:
{
  "text": "updated text" (optional),
  "visibility": "public" | "private" (optional),
  "tags": ["string"] (optional)
}

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Post Updated Successfully",
  "data": { updated post object }
}
```

## Key Features

✅ **Author Snapshot** - Post captures author info at creation time
✅ **Soft Delete** - Posts marked as deleted, not removed from DB
✅ **Access Control** - Only post owner can delete/update
✅ **Visibility** - Public posts in feed, private only for user timeline
✅ **Media Support** - Multiple media files with metadata
✅ **Pagination** - QueryBuilder handles page/limit parameters
✅ **Tags** - Support for tagging system
✅ **Timestamps** - createdAt and updatedAt auto-tracked
✅ **Counters** - likesCount, commentsCount for future integrations

## Error Handling

Consistent with User module:
- Invalid ObjectId → 400 Bad Request
- Resource not found → 404 Not Found
- Unauthorized access → 403 Forbidden
- Validation errors → 400 Bad Request with field details
- Server errors → 500 Internal Server Error

## Integration Notes

- Routes mounted at `/api/v1/posts`
- All authenticated endpoints require JWT token
- Use `checkAuth()` middleware for protection
- Validation middleware handles Zod schema validation
- Error middleware catches and formats all errors
