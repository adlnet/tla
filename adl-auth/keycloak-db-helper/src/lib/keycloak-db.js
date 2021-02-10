const pg = require("pg");
const config = require("../config");

// Postgres connection info
const conString = `postgres://${config.pg.user}:${config.pg.pass}@${config.pg.host}:${config.pg.port}/${config.pg.db}`;
const client = new pg.Client(conString);

// Joined query to get users with their realms
const QUERY_USERS = "SELECT u.id AS id, u.username, r.name AS realm FROM realm AS r INNER JOIN user_entity AS u ON r.id = u.realm_id WHERE r.name <> 'master';";
const QUERY_USERS_ALL = "SELECT u.id AS id, u.username, r.name AS realm FROM realm AS r INNER JOIN user_entity AS u ON r.id = u.realm_id;";

// Cache these to prevent each request from triggering a SQL query
const cache = {
	query: {},
	queryTimes: {},
}
const CACHE_CYCLE_MS = config.cacheMS;

// Each query we make to Postgres will have the same general flow, so the exported functions of this
// module will all run their actual SQL through this.  
function query(sql, callback) {

	// Check if we've already done this query recently
	if (cache.query[sql] != undefined && (Date.now() - cache.queryTimes[sql]) < CACHE_CYCLE_MS)
		callback(cache.query[sql])

	else client.query(sql, (error, result) => {
		cache.queryTimes[sql] = Date.now();
		if (error) {
			console.error("[PG] QUERY ERROR:", error);
			cache.query[sql] = [];
			callback(null);
		} else {
			cache.query[sql] = result.rows;
			callback(result.rows);
		}
	});
}


module.exports = {
	init(cb) {
		client.connect(cb);
	},

	getUsers(cb) {
		query(QUERY_USERS, cb);
	},

	getAllUsers(cb) {
		query(QUERY_USERS_ALL, cb);
	},
};