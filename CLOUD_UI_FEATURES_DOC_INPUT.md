# RESTHeart Cloud UI — Feature Documentation Input

> **Purpose:** This document describes every feature implemented in the RESTHeart Cloud management UI as of February 2025. It is intended as structured input for the RESTHeart website documentation team to review, update, and publish user-facing documentation.

---

## Overview

The RESTHeart Cloud UI is a web-based management console that lets developers manage their RESTHeart service instances without writing a single API call. Every feature maps directly to an underlying RESTHeart REST API capability. The UI supports two service tiers:

- **Free / Shared** — single-database services; the UI operates directly on the default database.
- **Dedicated** — multi-database services; the UI exposes a database selector before any collection-level operation.

The eight feature areas shipped in February are listed below.

---

## 1. Collection Browser

**Navigation path:** Service → Collections

### What it does
The Collection Browser is the entry point for inspecting and managing MongoDB data inside a RESTHeart service. It lists all collections in the service (or in the selected database for dedicated services) and allows navigation into individual collections to browse documents.

### Capabilities
- **List collections** — fetches all collections via `GET /<db>` and displays them in a searchable, paginated table.
- **Create collection** — `PUT /<db>/<collection>` with an optional JSON Schema validator assigned at creation time.
- **Delete collection** — `DELETE /<db>/<collection>` with a confirmation dialog.
- **View collection metadata** — opens a dialog showing the collection's current metadata (JSON Schema binding, `aggrs`, `streams`, etc.) via `GET /<db>/<collection>/_meta`.
- **Assign JSON Schema** — from the metadata dialog the user can bind one of the schemas stored in `/_schemas` to the collection as a document validator.
- **Navigate to documents** — clicking a collection row navigates to the Documents view for that collection.
- **GridFS / file bucket detection** — collections whose name ends with `.files` are automatically identified as GridFS buckets and presented with file-oriented labels and a link to the binary download endpoint.
- **Database selector (dedicated only)** — a dropdown lets users switch between databases; the collection list refreshes automatically.

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| List collections | `GET /<db>?rep=STANDARD` |
| Create collection | `PUT /<db>/<collection>` |
| Delete collection | `DELETE /<db>/<collection>` |
| Read metadata | `GET /<db>/<collection>/_meta` |
| Patch metadata | `PATCH /<db>/<collection>` |

### Documentation notes for the website
- Explain the difference between a regular collection and a GridFS bucket and how the UI detects it.
- Mention that the JSON Schema assigned here is the same schema stored and managed in the Schemas section.
- Note the database selector is only shown for dedicated service plans.

---

## 2. Documents Browser

**Navigation path:** Service → Collections → *select a collection*

### What it does
The Documents Browser allows reading and writing individual MongoDB documents inside a selected collection.

### Capabilities
- **List documents** — paginated fetch via `GET /<db>/<collection>` with configurable page size.
- **Filter documents** — MongoDB query filter typed as raw JSON (maps to the `filter` query parameter).
- **Sort documents** — sort expression typed as raw JSON (maps to the `sort` query parameter).
- **Create document** — inline JSON editor; submitted via `POST /<db>/<collection>`.
- **Edit document** — per-row inline editor pre-populated with the existing document JSON; submitted via `PATCH /<db>/<collection>/<id>`.
- **Delete document** — `DELETE /<db>/<collection>/<id>` with a confirmation dialog.
- **JSON formatting** — "Format" button pretty-prints the JSON in the editor.
- **_id type awareness** — the UI correctly handles `ObjectId`, `string`, `number`, and date `_id` types when constructing URLs.
- **GridFS files** — when the parent collection is a file bucket, the UI shows file metadata rows with a "Download" action that links to `GET /<collection>/<id>/binary`.
- **Back navigation** — breadcrumb button returns to the Collection Browser.

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| List / filter / sort | `GET /<db>/<collection>?filter=...&sort=...&page=...&pagesize=...` |
| Create document | `POST /<db>/<collection>` |
| Update document | `PATCH /<db>/<collection>/<id>` |
| Delete document | `DELETE /<db>/<collection>/<id>` |
| Download file | `GET /<collection>/<id>/binary` |

### Documentation notes for the website
- The `filter` parameter accepts any MongoDB query expression — document this clearly with examples.
- Mention pagination: the UI uses `page` and `pagesize` query parameters.
- Clarify that editing a document sends only a PATCH (partial update), preserving fields not shown in the editor.

---

## 3. User Management

**Navigation path:** Service → Users

### What it does
Manages the users stored in the RESTHeart `users` collection (`/users` for free/shared, `/restheart/users` for dedicated). These are the users that authenticate against the service via Basic Auth or Token Auth.

### Capabilities
- **List users** — paginated, searchable list fetched from the users collection.
- **Filter & sort** — MongoDB filter and sort expressions applied to the users collection query.
- **Create user** — form with `_id` (username), `password` (hashed server-side by RESTHeart via bcrypt), and one or more `roles`. Submitted as `POST /users`.
- **Edit user** — inline accordion form; updates `roles` and optionally sets a new password. Password field is masked and optional on edit (leave blank to keep existing). Submitted as `PATCH /users/<id>`.
- **Delete user** — `DELETE /users/<id>` with confirmation.
- **Show/hide password** — toggle to reveal the password field value during input.
- **Pagination** — configurable page size; previous/next navigation.

### Data model
```json
{
  "_id": "alice",
  "password": "plaintextOnWrite_hashedByServer",
  "roles": ["user", "admin"]
}
```

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| List users | `GET /users?page=...&pagesize=...&filter=...&sort=...` |
| Create user | `POST /users` |
| Update user | `PATCH /users/<id>` |
| Delete user | `DELETE /users/<id>` |

### Documentation notes for the website
- Emphasize that passwords are **automatically hashed by RESTHeart** (bcrypt) — the client sends the plaintext and RESTHeart stores the hash.
- Clarify the difference between the `users` collection path on free/shared vs. dedicated plans.
- Note that roles assigned here are the same roles referenced in ACL permission rules.
- Recommend documenting the built-in roles (`admin`, `user`, etc.) and the freedom to define custom roles.

---

## 4. Permissions Management (ACL)

**Navigation path:** Service → Permissions

### What it does
Manages the Access Control List stored in the `acl` collection (`/acl` for free/shared, `/restheart/acl` for dedicated). ACL entries define what HTTP operations specific roles can perform on specific resources.

### Capabilities
- **List permissions** — paginated, searchable list of ACL documents.
- **Filter & sort** — MongoDB filter and sort expressions applied to the ACL query.
- **Create permission** — form with the following fields:
  - `_id` — unique permission identifier.
  - `roles` — array of roles this rule applies to.
  - `predicate` — Undertow predicate expression (e.g. `path-prefix('/orders') and method('GET')`).
  - `priority` — integer; lower numbers are evaluated first.
  - `mongo.readFilter` — optional MongoDB filter applied transparently on reads.
  - `mongo.writeFilter` — optional MongoDB filter applied transparently on writes.
  - `mongo.mergeRequest` — optional document merged into write requests.
  - `mongo.projectResponse` — optional projection applied to responses.
- **Edit permission** — pre-populated inline form; all fields except `_id` are editable.
- **Delete permission** — with confirmation.
- **Predicate helper** — inline tooltip with common predicate examples.
- **Pagination** — configurable page size.

### Data model
```json
{
  "_id": "usersCanReadOrders",
  "roles": ["user"],
  "predicate": "path-prefix('/orders') and method('GET')",
  "priority": 100,
  "mongo": {
    "readFilter": { "owner": "@user._id" },
    "writeFilter": null,
    "mergeRequest": null,
    "projectResponse": null
  }
}
```

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| List permissions | `GET /acl?page=...&pagesize=...&filter=...&sort=...` |
| Create permission | `POST /acl` |
| Update permission | `PATCH /acl/<id>` |
| Delete permission | `DELETE /acl/<id>` |

### Documentation notes for the website
- Document the Undertow predicate language with examples — it is the core of permission definition and likely the hardest part for new users.
- Explain the `mongo.*` fields with concrete use-cases (row-level security with `readFilter`, field masking with `projectResponse`).
- Clarify the `priority` field and evaluation order.
- Note the path difference between free/shared (`/acl`) and dedicated (`/restheart/acl`).

---

## 5. Aggregations

**Navigation path:** Service → Aggregations

### What it does
Defines and manages server-side MongoDB aggregation pipelines bound to specific collections. Aggregations are stored as collection metadata (`aggrs` field) and exposed as REST endpoints clients can call.

### Why server-side aggregations
Aggregations are defined server-side so clients cannot execute arbitrary pipelines — they can only invoke pre-approved, tested pipelines by URI. This is a security best practice compared to exposing the `filter` query parameter.

### Capabilities
- **List collections with their aggregation count** — loads all collections and fetches each collection's `/_meta` to discover the `aggrs` array.
- **Add aggregation** — form with:
  - `uri` — the path segment used to call the aggregation.
  - `stages` — the MongoDB aggregation pipeline as a JSON array.
  - `allowDiskUse` — boolean toggle for pipelines exceeding 100 MB memory.
- **Edit aggregation** — pre-populated form; `uri` is read-only after creation.
- **Delete aggregation** — removes the entry from the `aggrs` array in collection metadata.
- **Execute aggregation** — inline test runner:
  - `avars` — optional JSON object of variables injected via the `$var` operator.
  - `page` / `pagesize` — pagination parameters.
  - Result displayed as formatted JSON.
  - "Copy Pagination Stages" — copies `$skip` / `$limit` stage templates to clipboard.
- **Copy endpoint URL** — copies the full REST endpoint to clipboard.
- **JSON formatting** — "Format" button pretty-prints the pipeline JSON.
- **Search collections** — debounced search over collection names.
- **Pagination** — page through collections when there are many.
- **Database selector (dedicated only)**.

### Aggregation endpoint format
```
GET /<db>/<collection>/_aggrs/<uri>?avars={"key":"value"}&page=1&pagesize=20
```

### Data model (stored in collection metadata)
```json
{
  "aggrs": [
    {
      "uri": "sales-by-region",
      "stages": [
        { "$match": { "status": "completed" } },
        { "$group": { "_id": "$region", "total": { "$sum": "$amount" } } },
        { "$sort": { "total": -1 } }
      ],
      "allowDiskUse": false
    }
  ]
}
```

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| Read collection metadata | `GET /<db>/<collection>/_meta` |
| Save aggregations | `PATCH /<db>/<collection>` with `{ "aggrs": [...] }` |
| Execute aggregation | `GET /<db>/<collection>/_aggrs/<uri>` |

### Documentation notes for the website
- Explain the `$var` operator and the `avars` query parameter with examples.
- Document the `allowDiskUse` flag and when it is needed.
- Show a complete worked example: define → save → call from curl or JavaScript fetch.
- Mention that modifying collection metadata (adding/removing aggregations) does not require a service restart.

---

## 6. Webhooks

**Navigation path:** Service → Webhooks

### What it does
Manages the RESTHeart webhooks plugin, which fires HTTP callbacks or sends emails in response to API events. The UI also handles enabling/disabling the plugin itself.

### Plugin lifecycle
- If the webhooks plugin is not enabled, the page shows an "Enable Webhooks" CTA that activates it via the plugins API.
- If enabled, the full webhook management UI is shown.
- A badge displays whether the plugin is **ENABLED** or **DISABLED**.

### Webhook types

#### HTTP Webhooks
Trigger an outbound HTTP request when a condition is met.

Fields:
- `name` — human-readable identifier.
- `condition` — Undertow predicate expression (same syntax as ACL predicates).
- `url` — destination URL.
- `timeout_ms` — request timeout in milliseconds.
- `headers` — custom headers sent with the outbound request (JSON object).
- `transform.enabled` — whether to apply a response transformation template.
- `transform.template` — Mustache/JSON template shaping the outbound body.

#### Email Webhooks
Send an email when a condition is met.

Fields:
- `name` — human-readable identifier.
- `condition` — Undertow predicate expression.
- `email.to` — array of recipient addresses.
- `email.cc` — optional array of CC addresses.
- `email.subject` — subject line.
- `email.bodyType` — `json` (raw JSON payload) or `html` (HTML template).
- `email.bodyTemplate` — template string for the email body.

### Capabilities
- **List webhooks** — paginated, searchable list.
- **Create webhook** — tabbed form (HTTP / Email) with full field set.
- **Edit webhook** — pre-populated accordion form.
- **Delete webhook** — with confirmation.
- **Enable/disable individual webhook** — toggle switch per row.
- **View webhook logs** — opens a dialog showing the execution history for a specific webhook (timestamp, status code, response body).
- **Refresh logs** — reload the log list inside the dialog.
- **Pagination** — for both the webhook list and logs dialog.

### Documentation notes for the website
- Document the `condition` predicate syntax with webhook-specific examples (e.g. "fire when a POST is made to `/orders`").
- Explain the difference between HTTP and email webhook types.
- Show the transformation template syntax and a worked example.
- Document the log retention policy if applicable.
- Note that the webhooks plugin must be enabled before webhooks can be created.

---

## 7. GraphQL

**Navigation path:** Service → GraphQL

### What it does
Manages GraphQL application definitions stored in the `gql-apps` collection. Each GraphQL app maps MongoDB collections to a GraphQL schema and resolvers — no code needed.

### GraphQL app definition
A GraphQL app is a JSON document stored in `/gql-apps` (free/shared) or `/restheart/gql-apps` (dedicated) with the following top-level fields:
- `descriptor.name` — app name.
- `descriptor.description` — optional description.
- `descriptor.enabled` — boolean; disabled apps are ignored by the GraphQL engine.
- `descriptor.uri` — the path under which the app's GraphQL endpoint is served (e.g. `/graphql/myapp`).
- `schema` — the GraphQL SDL schema string.
- `mappings` — object mapping GraphQL types and fields to MongoDB collections and queries.

### Capabilities
- **List GraphQL apps** — table of all apps with name, URI, enabled status.
- **Create GraphQL app** — full editor with two modes:
  - **Visual Editor** — structured form for descriptor fields, schema textarea, and mappings.
  - **JSON Editor** — raw JSON textarea for power users who prefer to edit the full document directly.
- **Edit GraphQL app** — same dual-mode editor, pre-populated with existing values.
- **Delete GraphQL app** — with confirmation.
- **Enable/disable app** — toggle per row; updates `descriptor.enabled` via PATCH.
- **Copy endpoint URL** — copies the GraphQL endpoint URL to clipboard.
- **JSON formatting** — "Format" button in JSON editor mode.
- **Validation** — the UI validates required fields before saving.

### GraphQL endpoint format
```
POST /graphql/<uri>
Content-Type: application/json

{ "query": "{ ... }" }
```

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| List apps | `GET /gql-apps` |
| Create app | `POST /gql-apps` |
| Update app | `PATCH /gql-apps/<id>` |
| Delete app | `DELETE /gql-apps/<id>` |
| Query GraphQL | `POST /graphql/<uri>` |

### Documentation notes for the website
- Provide a complete walkthrough: define a schema → add mappings → enable → run a GraphQL query.
- Document the `mappings` object format in detail — this is the most complex part of the GraphQL app definition.
- Clarify the difference between the Visual Editor and JSON Editor modes and when to use each.
- Note the collection path difference between free/shared and dedicated plans.

---

## 8. Schemas (JSON Schema)

**Navigation path:** Service → Schemas

### What it does
Manages JSON Schema documents stored in the `/_schemas` collection. These schemas can be assigned to collections as document validators, enforcing document structure at the database level.

### Capabilities
- **List schemas** — paginated table with schema `_id`, `title`, and `description`.
- **Search schemas** — client-side filter over the loaded page.
- **Create schema** — JSON editor with:
  - Schema `_id` (identifier used when assigning to a collection).
  - Full JSON Schema document (draft-07 compatible).
  - "Format" button to pretty-print.
  - Live validation feedback before saving.
- **Edit schema** — same editor, pre-populated.
- **Delete schema** — with confirmation.
- **Copy schema ID** — copies the `_id` to clipboard for use in other tools.
- **Assign to collection** — from the Collection Browser's metadata dialog, the user selects a schema by ID and it is written as the collection's `jsonSchema` validator property.
- **Pagination** — previous/next with configurable page size.

### Schema document format (stored in `/_schemas`)
```json
{
  "_id": "order-schema",
  "title": "Order",
  "description": "Validates order documents",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "customerId": { "type": "string" },
    "total": { "type": "number", "minimum": 0 },
    "status": { "type": "string", "enum": ["pending", "shipped", "delivered"] }
  },
  "required": ["customerId", "total"]
}
```

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| List schemas | `GET /_schemas?page=...&pagesize=...` |
| Create schema | `POST /_schemas` |
| Update schema | `PATCH /_schemas/<id>` |
| Delete schema | `DELETE /_schemas/<id>` |
| Assign to collection | `PATCH /<db>/<collection>` with `{ "jsonSchema": { ... } }` |

### Documentation notes for the website
- Explain what JSON Schema validation means in MongoDB context (server-side validation applied on every write).
- Show the flow: create schema → assign to collection → test a write that fails validation.
- Document supported JSON Schema draft version (draft-07).
- Clarify that schemas are shared across collections — one schema can be reused by multiple collections.
- Link to the JSON Schema specification and recommended visual editors (e.g. jsonschema.net).

---

## 9. WebSocket Change Streams

**Navigation path:** Service → WebSocket

### What it does
Defines and manages MongoDB Change Stream endpoints exposed as WebSocket connections. Each stream definition is stored in the `streams` collection metadata property. Clients connect via WebSocket and receive real-time Change Event notifications as documents are inserted, updated, or deleted.

### Why server-side stream definitions
Stream definitions are declared server-side so clients can only subscribe to pre-approved, tested streams — they cannot open arbitrary change streams. This is the same security model used for aggregations.

### How it works
1. The developer defines a `streams` array in a collection's metadata via the UI.
2. RESTHeart exposes a WebSocket endpoint at `wss://<host>/<db>/<collection>/_streams/<uri>`.
3. Clients connect to the endpoint authenticating with HTTP Basic Auth (credentials in the WebSocket URL: `wss://user:password@host/...`).
4. RESTHeart opens a MongoDB Change Stream on the collection, applies the pipeline stages as a filter, and forwards matching Change Events to all connected clients as JSON messages.

### Stream definition format
The stream definition is stored as part of the collection's metadata:
```json
{
  "streams": [
    {
      "uri": "all-changes",
      "stages": [
        {
          "$match": {
            "operationType": { "$in": ["insert", "update", "replace"] }
          }
        }
      ]
    }
  ]
}
```

### Important: stages operate on Change Events, not documents
Unlike aggregation stages (which receive raw documents), stream stages receive MongoDB **Change Event** objects. To access the modified document, use `$$fullDocument`:
```json
{ "$match": { "fullDocument.status": "active" } }
```

### Capabilities
- **List collections with their stream count** — loads all collections and fetches each collection's `/_meta` to discover the `streams` array.
- **Add stream** — single JSON editor showing the complete stream definition object `{ "uri": "...", "stages": [...] }`.
  - Validation ensures `uri` is a non-empty string and `stages` is an array.
  - "Format" button pretty-prints the JSON.
- **Edit stream** — same single-JSON editor, `uri` is immutable.
- **Delete stream** — removes the entry from the `streams` array; active connected clients are disconnected automatically by RESTHeart.
- **Copy WebSocket URL** — copies the `wss://` endpoint to clipboard.
- **Live Try panel** — inline WebSocket tester:
  - Prompts for username and password of a user registered in the `users` collection.
  - Connects to the stream using `wss://username:password@host/...` — the browser converts this to `Authorization: Basic ...` in the WebSocket upgrade request.
  - Displays connection status: Connecting → Connected / Disconnected / Error.
  - Streams incoming Change Events in a live, auto-scrolling log with timestamps.
  - Events are formatted as pretty-printed JSON.
  - Maximum 200 events shown; oldest are discarded when the limit is reached.
  - "Disconnect" / "Reconnect" / "Clear" actions.
  - Error code 1006 is annotated as a likely authentication failure.
- **Search collections** — debounced search over collection names.
- **Pagination** — page through collections.
- **Database selector (dedicated only)**.

### Authentication note
WebSocket connections from browsers cannot set arbitrary HTTP headers. RESTHeart Cloud supports credentials embedded directly in the WebSocket URL (`wss://user:pass@host/path`), which the browser converts into a standard `Authorization: Basic base64(user:pass)` header in the HTTP upgrade request. The admin JWT token is **not** usable here — only regular users registered in the `users` collection can authenticate WebSocket connections.

### Relevant RESTHeart API endpoints
| Operation | Endpoint |
|---|---|
| Read collection metadata | `GET /<db>/<collection>/_meta` |
| Save streams | `PATCH /<db>/<collection>` with `{ "streams": [...] }` |
| Connect to stream | `wss://<host>/<db>/<collection>/_streams/<uri>` |

### Documentation notes for the website
- Explain the difference between Change Stream stages (input = Change Event) and aggregation stages (input = document).
- Show a complete worked example: define stream → connect via websocat or browser JS → trigger a document insert → see the event.
- Document the authentication mechanism: Basic Auth in the WebSocket URL.
- Mention the MongoDB requirement: **Change Streams require MongoDB configured as a Replica Set** (not standalone). Free/shared RESTHeart Cloud services already meet this requirement.
- Document the Change Event structure with the key fields: `operationType`, `fullDocument`, `ns`, `documentKey`, `updateDescription`.
- Add a JavaScript client code example:
  ```javascript
  const ws = new WebSocket("wss://alice:secret@myservice.restheart.com/mydb/orders/_streams/all-changes");
  ws.onmessage = (event) => {
    const changeEvent = JSON.parse(event.data);
    console.log(changeEvent.fullDocument);
  };
  ```
- Explain that when a stream definition is modified or deleted, RESTHeart automatically closes all active WebSocket connections for that stream.

---

## Cross-cutting UI Behaviours

These behaviours apply consistently across all eight features and should be reflected in documentation.

### Dedicated vs. Free/Shared plan differences
| Aspect | Free / Shared | Dedicated |
|---|---|---|
| Database | Fixed single database | User selects from available databases |
| Users collection path | `/users` | `/restheart/users` |
| ACL collection path | `/acl` | `/restheart/acl` |
| GraphQL apps path | `/gql-apps` | `/restheart/gql-apps` |
| Schemas path | `/_schemas` | `/_schemas` (same) |
| Aggregations / streams | Per-collection metadata | Same, scoped to selected database |

### Admin JWT
All management operations in the UI use a short-lived **Admin JWT** token obtained from the RESTHeart Cloud control plane. This token is injected as `Authorization: Bearer <token>` on every API call to the user's RESTHeart service instance. It is separate from, and has broader permissions than, the end-user credentials stored in the `users` collection.

### Confirmation dialogs
Destructive operations (delete collection, delete document, delete user, delete permission, delete aggregation, delete stream, delete webhook, delete schema) always require explicit confirmation via a modal dialog before executing.

### Search and pagination
All list views implement:
- Client-side or server-side debounced search (300 ms delay).
- Configurable page size.
- Previous / next pagination with total page count display.

### JSON editing
All JSON-capable fields offer:
- Syntax-aware textarea with monospace font.
- A "Format" button that pretty-prints valid JSON (reports error on invalid input).
- Inline validation errors surfaced before the save action is allowed.

### Error handling
HTTP errors from the RESTHeart API are surfaced as toast notifications with the most specific error message available (`exception message.errmsg` → `exception message` string → `message` → generic fallback).

---

## Suggested Documentation Structure for the Website

Based on the features above, the following documentation pages are recommended:

1. **RESTHeart Cloud UI — Getting Started** — overview of the console, plan differences, admin JWT concept.
2. **Managing Data** — Collection Browser + Documents Browser (combined, since they are a drill-down flow).
3. **Managing Users** — User Management page.
4. **Managing Permissions (ACL)** — Permissions Management page + predicate language reference.
5. **Aggregation Pipelines** — Aggregations page + `$var` / `avars` reference.
6. **Webhooks** — Webhooks page, HTTP and email types, condition predicates, logs.
7. **GraphQL Applications** — GraphQL page, app definition format, mappings reference.
8. **JSON Schema Validation** — Schemas page + how to assign to a collection.
9. **WebSocket Change Streams** — WebSocket page + Change Event structure + authentication + client code examples.
10. **Dedicated vs. Free/Shared Plans** — cross-cutting reference for path differences and database selector.