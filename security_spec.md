# Security Specification for OJO Marketplace

## Data Invariants
1. Products can only be created/updated by verified Administrators.
2. Users can only access and modify their own profile and cart.
3. Every write operation must validate the data structure and field types.
4. Timestamps must be server-generated.
5. All document IDs must be valid alphanumeric strings.

## The Dirty Dozen Payloads (Intended to be REJECTED)

1. **Identity Spoofing**: Attempting to create a user profile for a different UID.
   ```json
   { "uid": "victim_uid", "name": "Attacker", "role": "CUSTOMER" }
   ```
2. **Privilege Escalation**: User trying to register as an ADMIN.
   ```json
   { "uid": "user_uid", "name": "Attacker", "role": "ADMIN" }
   ```
3. **Shadow Update**: Adding a field not in the schema.
   ```json
   { "name": "Fake Tea", "price": 100, "ghost_field": "hidden_malware" }
   ```
4. **Invalid Type**: Setting price as a string.
   ```json
   { "name": "Bad Product", "price": "cheap" }
   ```
5. **Unauthorized Product Write**: Non-admin trying to update product stock.
   ```json
   { "stock": 999999 }
   ```
6. **Resource Poisoning**: Extremely long string in artisan name.
   ```json
   { "artisanName": "A".repeat(1001) }
   ```
7. **Negative Values**: Setting stock to -1.
   ```json
   { "stock": -1 }
   ```
8. **Invalid Enum**: Setting category to "Invalid Category".
   ```json
   { "category": "Car" }
   ```
9. **Bypassing Server Timestamp**: Providing a client-side date for addedAt.
   ```json
   { "productId": "p1", "quantity": 1, "addedAt": "2020-01-01T00:00:00Z" }
   ```
10. **Cart Theft**: Attempting to read another user's cart.
    - Operation: GET /users/victim_uid/cart/item_id
11. **Registry Scraping**: Attempting a blanket read of all user private data.
    - Operation: LIST /users
12. **Malformed ID**: Creating a product with a 2KB junk character ID.
    - Operation: CREATE /products/%FF%FE%FD...
