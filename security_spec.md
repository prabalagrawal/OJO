# Security Specification: OJO Sovereign Registry

## 1. Data Invariants
- **Identity Integrity**: No user can spoof their ID (`uid`) or elevate their role to `admin` via the client.
- **Relational Integrity**: Orders must belong to valid users. Verification logs must point to valid products and be authored by admins.
- **State Locking**: Once an order is `delivered` or `cancelled`, its status cannot be reverted to a processing state by a customer.
- **Provenance Integrity**: Only `admin` roles can set a product's status to `verified` or `live`.

## 2. The "Dirty Dozen" Payloads (Deny Test Cases)
1. **Self-Promotion**: Non-admin user trying to update their role to `admin`.
2. **Shadow Field Injection**: Creating a product with an unapproved `internalNote` field.
3. **Identity Spoofing**: User A trying to create an order on behalf of User B.
4. **ID Poisoning**: Requesting a document with an ID that exceeds 128 characters or contains malicious characters.
5. **Unauthorized Listing**: Authenticated user trying to `list` all `activity_logs`.
6. **Price Tampering**: User trying to update the `price` of a product in the registry.
7. **Negative Value Attack**: Creating an order with a `total` of `-100`.
8. **Stale Data Write**: Updating a document without updating `updatedAt` to `request.time`.
9. **Spam Creation**: Non-admin user attempting to create entries in the `products` collection.
10. **PII Leak**: Non-owner/Non-admin attempting to `get` another user's private profile data.
11. **Status Shortcutting**: User updating an order from `pending` directly to `delivered` (if business logic requires intermediate steps).
12. **Recursive Cost Attack**: Crafting a deep query that forces redundant `get()` lookups across collections.

## 3. Test Runner
(Implemented via `firestore.rules.test.ts` logic or simulation logic in rules).
