# 1. How do you create a db and table via PostgreSQL shell?

**Step 1: Enter PostgreSQL shell:**
```bash
psql
```
Or if needed:
```bash
psql -U your_username -d your_dbname
```

**Step 2: Create a database:**
```sql
CREATE DATABASE myapp;
```

**Step 3: Connect to the database:**
```sql
\c myapp
```

**Step 4: Create a table:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE
);
```

# 2. What is node-postgres and how do you use it?
It's the official PostgreSQL client for Node.js - it lets you connect your Express app to a PostgreSQL database and run queries

You install it (`npm install pg`) and use it:
```javascript
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query('SELECT * FROM users', (err, res) => {
  console.log(res.rows);
});
```

# 3. When should you use a client or a pool in pg?
pg (a Node.js package that lets your app talk to a PostgreSQL database) has two ways to connect: client and pool

**Client:** It's like opening one direct connection to the database (connect, run, disconnect) - it's like calling someone and hanging up. 

Here's an example:
```javascript
const { Client } = require('pg');
const client = new Client();

await client.connect();
const result = await client.query('SELECT * FROM users');
await client.end();
```

**Pool:** It's a group of reusable connections to the db - your app can borrow a connection when needed and return it after. It's like having a group of open phone lines - you use one when needed and hang up when done.

Here's an example:
```javascript
const { Pool } = require('pg');
const pool = new Pool();

const result = await pool.query('SELECT * FROM users');
// No need to manually connect or end — it's managed for you
```

# 4. How would you integrate db query functions in your Express app?

**This is super important**

**4.1** Create a db.js file (pool.js in our situation) - give the database_URL (username, password, name of the db, etc.)

**4.2** Create the DB query functions om queries.js 

Example: 
```javascript
async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows;
}

async function searchUsernames(searchTerm) {
  const { rows } = await pool.query(
    "SELECT * FROM usernames WHERE username ILIKE $1", 
    [`%${searchTerm}%`]
  );
  return rows;
}
```

**4.3** Use the DB query in a router:
```javascript
router.get('/', userController.getUsernames);
router.get('/new', userController.showUsernameForm);
```

**4.4** Hook it into app.js:
```javascript
app.use('/', userRoutes);
```



## How would you populate the db via a script?
Look at the populat-db.js file