const sqlite3 = require("sqlite3");

const TBL_COMP = "competencies";
const COL_USER = "user";
const COL_COMP_ID = "competencyID";
const COL_COMP_CONF = "confidence";
const COL_COMP_TIME = "timestamp";

/** @type {sqlite3.Database}  */
var db;

// SQLite doesn't have promises or async/await by default, so we'll create
// the promise structure manually.
function exec(method, sql, params) {
	return new Promise((resolve, reject) => {
		db.prepare(sql)[method](params, (error, result) => {
			if (error) reject(error)
			else resolve(result);
		}).finalize();
	})
}
function run(sql, params) {return exec("run", sql, params)}
function get(sql, params) {return exec("all", sql, params)}
function getFirst(sql, params) {return get(sql, params).then(result => (result && result.length) > 0 ? result[0] : null)}

const comps = {
	/**
	 * Initialize the SQLite3 Connection.
	 * @param {string} path - Path of the SQLite database to read or create.
	 * @param {Function<Error>} cb - Callback to receive the completion event with any errors encountered.
	 */
	init(path, cb) {
		db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
			run(`CREATE TABLE IF NOT EXISTS ${TBL_COMP} (
				${COL_USER} TEXT,
				${COL_COMP_ID} TEXT,
				${COL_COMP_CONF} TEXT,
				${COL_COMP_TIME} TEXT
			)`)
				.then(_ => cb(null))
				.catch(cb)
		})
	},

	/**
	 * Create a stored competency entry for the given user.
     * This will throw a rejection if the goal already exists for the user.
	 * @param {string} user - UUID of the user to receive the goal.
	 * @param {string} comp - URI representing the competency.
     * @param {string} conf - Value representing the confidence rating.
	 */
	createComp(user, comp, conf, time) {
		let columns = `(${COL_USER}, ${COL_COMP_ID}, ${COL_COMP_CONF}, ${COL_COMP_TIME})`;
		let params = [user, comp, conf, time];

		return comps.readComp(user, comp)
			.then(result => {
				
				if (result)
					return result
				else
					return run(`INSERT INTO ${TBL_COMP} ${columns} VALUES ((?), (?), (?), (?))`, params).then(result => comps.readComp(user, comp))
			})
	},

    /**
	 * Get all known competency entries. Purely for debugging.
	 */
	readAll() {
		return get(`SELECT * FROM ${TBL_COMP}`);
	},

	/**
	 * Get all known competency entries of a given user.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 */
	readComps(user) {
		return get(`SELECT * FROM ${TBL_COMP} WHERE user = (?)`, [user]);
	},

	/**
	 * Get a single competency entry for the user.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 * @param {string} comp - URI representing the competency.
	 */
	readComp(user, comp) {
		return getFirst(`SELECT * FROM ${TBL_COMP} WHERE ${COL_USER} = (?) AND ${COL_COMP_ID} = (?)`, [user, comp])
			.catch(err => {
				console.error(err);
				return err;
			})
	},

	/**
	 * Update a user's competency with a given confidence rating.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 * @param {string} comp - URI representing the competency.
	 * @param {string} conf - Value representing the confidence rating.
	 */
	updateComp(user, comp, conf, time) {
		return run(`
			UPDATE ${TBL_COMP} 
			SET 
				${COL_COMP_CONF} = (?),
				${COL_COMP_TIME} = (?) 
			WHERE 
				${COL_USER} = (?) AND 
				${COL_COMP_ID} = (?) AND
				`, [conf, time, user, comp])
			.then(result => comps.readComp(user, comp))
			.catch(console.error)
	},

	/**
	 * Deletes a competency entry for a given user.
	 * @param {string} user - UUID of the user to receive the goal.
	 * @param {string} comp - URI representing the competency.
	 */
	deleteComp(user, comp) {
		return comps.count().then(countBefore => {
			return run(`DELETE FROM ${TBL_COMP} WHERE ${COL_USER} = (?) AND ${COL_COMP_ID} = (?)`, [user, comp])
				.then(result => comps.count())
				.then(countAfter => countBefore - countAfter)
		})
	},

	/**
	 * Deletes ALL competency entries for a given user.  Returns the number of deleted records.
	 * @param {string} user - UUID of the user to receive the goal.
	 */
	deleteComps(user) {
		return comps.count().then(countBefore => {
			return run(`DELETE FROM ${TBL_COMP} WHERE user = (?)`, [user])
				.then(result => comps.count())
				.then(countAfter => countBefore - countAfter)
		})
	},

	/**
	 * Returns a count of all known competency entries.
	 */
	count() {
		return get(`SELECT * FROM ${TBL_COMP}`).then(results => results.length);
	}
}

module.exports = comps;
