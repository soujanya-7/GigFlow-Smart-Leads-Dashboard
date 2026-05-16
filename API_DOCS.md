# Smart Leads Dashboard – API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this format:
```json
{
  "success": true | false,
  "data": {...},
  "message": "...",
  "error": "...",
  "meta": { "total", "page", "limit", "totalPages", "hasNextPage", "hasPrevPage" }
}
```

---

## 🔐 Authentication

### POST `/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "sales"   // optional: "admin" | "sales" (default: "sales")
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales" }
  }
}
```

---

### POST `/auth/login`
Authenticate a user and receive JWT token.

**Body:**
```json
{
  "email": "admin@leads.com",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "_id": "...", "name": "Admin User", "email": "admin@leads.com", "role": "admin" }
  }
}
```

---

### GET `/auth/me`
Get current authenticated user. **Requires Bearer Token.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Admin User", "email": "admin@leads.com", "role": "admin", "createdAt": "..." }
}
```

---

### GET `/auth/users`
Get all users. **Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [{ "_id": "...", "name": "...", "email": "...", "role": "..." }]
}
```

---

## 📋 Leads

All lead endpoints require: `Authorization: Bearer <token>`

---

### GET `/leads`
Get paginated list of leads with optional filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | `New\|Contacted\|Qualified\|Lost` | Filter by status |
| `source` | `Website\|Instagram\|Referral` | Filter by source |
| `search` | `string` | Search name or email |
| `sort` | `latest\|oldest` | Sort order (default: `latest`) |
| `page` | `number` | Page number (default: `1`) |
| `limit` | `number` | Records per page (default: `10`, max: `100`) |

**Example:** `GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1&limit=10`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "...",
      "createdBy": { "_id": "...", "name": "Admin User", "email": "admin@leads.com" },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### POST `/leads`
Create a new lead.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in our services"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "_id": "...", "name": "Rahul Sharma", ... }
}
```

---

### GET `/leads/stats`
Get lead statistics (total, by status, by source).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 12,
    "byStatus": { "New": 3, "Contacted": 2, "Qualified": 5, "Lost": 2 },
    "bySource": { "Website": 4, "Instagram": 5, "Referral": 3 }
  }
}
```

---

### GET `/leads/export/csv`
Export filtered leads as CSV file.

**Query Parameters:** Same as `GET /leads` (except `page`, `limit`, `sort`)

**Response:** CSV file download.

---

### GET `/leads/:id`
Get a single lead by ID.

**Response (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "...", ... }
}
```

---

### PUT `/leads/:id`
Update a lead. Sales users can only update their own leads.

**Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "email": "new@email.com",
  "status": "Qualified",
  "source": "Website",
  "notes": "Updated notes"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { ... }
}
```

---

### DELETE `/leads/:id`
Delete a lead. Sales users can only delete their own leads. Admin can delete any.

**Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": null
}
```

---

## Error Responses

| Status | Description |
|--------|-------------|
| `400` | Bad Request / Validation failed |
| `401` | Unauthorized / Invalid/expired token |
| `403` | Forbidden / Insufficient permissions |
| `404` | Resource not found |
| `500` | Internal server error |

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Please enter a valid email" }
  ]
}
```
