const pool = require("./pool");

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

async function insertUsername(username) {
  await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
} //$1 is a placeholder for a value in order to prevent SQL injection - it menas "insert the first value from the array"

async function deleteAllUsernames() {
  await pool.query("DELETE FROM usernames");
}

module.exports = {
  getAllUsernames,
  searchUsernames,
  insertUsername,
  deleteAllUsernames
};