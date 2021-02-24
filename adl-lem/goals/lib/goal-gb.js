const sqlite3 = require("sqlite3");

const TBL_GOAL = "tbl_goal";
const COL_USER = "user";
const COL_GOAL = "goal";
const COL_GOAL_TYPE = "type";
const COL_STATUS = "status";
const COL_TIME = "timestamp";

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

const goals = {
	/**
	 * Initialize the SQLite3 Connection.
	 * @param {string} path - Path of the SQLite database to read or create.
	 * @param {Function<Error>} cb - Callback to receive the completion event with any errors encountered.
	 */
	init(path, cb) {
		db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
			run(`CREATE TABLE IF NOT EXISTS ${TBL_GOAL} (
				${COL_USER} TEXT,
				${COL_GOAL} TEXT,
				${COL_GOAL_TYPE} TEXT,
				${COL_STATUS} TEXT,
				${COL_TIME} TEXT
			)`)
				.then(result => cb(null))
				.catch(cb)
		})
	},

	/**
	 * Create a goal for the given user.  This will throw a rejection of the goal
	 * already exists for the user.
	 * @param {string} user - UUID of the user to receive the goal.
	 * @param {string} goal - URI representing the goal.
	 */
	createGoal(user, goal, time, type = undefined, status = undefined) {
		if (type == undefined) 
			type = goals.typeEnum.competency;
		if (status == undefined)
			status = goals.statusEnum.inactive;
		
		let columns = `(${COL_USER}, ${COL_GOAL}, ${COL_TIME}, ${COL_GOAL_TYPE}, ${COL_STATUS})`
		let params = [user, goal, time, type, status]

		return goals.readGoal(user, goal)
			.then(result => {
				
				if (result)
					return result
				else
					return run(`INSERT INTO ${TBL_GOAL} ${columns} VALUES ((?), (?), (?), (?), (?))`, params).then(result => goals.readGoal(user, goal))
			})
	},

	/**
	 * Get all known goals of a given user.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 */
	readGoals(user) {
		return get(`SELECT * FROM ${TBL_GOAL} WHERE user = (?)`, [user])
	},

	/**
	 * Get a single goal for the user.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 * @param {string} goal - URI representing the goal.
	 */
	readGoal(user, goal) {
		return getFirst(`SELECT * FROM ${TBL_GOAL} WHERE user = (?) AND goal = (?)`, [user, goal])
			.catch(err => {
				console.error(err);
				return err;
			})
	},

	/**
	 * Update a user's goal with a given status.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 * @param {string} goal - URI representing the goal.
	 * @param {string} status - New status of this goal. 
	 */
	updateGoal(user, goal, time, status) {
		return run(`
			UPDATE ${TBL_GOAL} 
			SET 
				${COL_STATUS} = (?),
				${COL_TIME} = (?) 
			WHERE 
				${COL_USER} = (?) AND 
				${COL_GOAL} = (?)`, [status, time, user, goal])
			.then(result => goals.readGoal(user, goal))
			.catch(console.error)
	},

	/**
	 * Update a user's goals with a given status.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 * @param {string} goal - URI representing the goal.
	 * @param {string} status - New status of this goal. 
	 */
	updateGoals(user, status) {
		return run(`UPDATE ${TBL_GOAL} SET ${COL_STATUS} = (?) WHERE ${COL_USER} = (?)`, [status, user])
			.then(result => goals.readGoals(user))
			.catch(console.error)
	},

	/**
	 * Update a user's goal with a given status.
	 * @param {string} user - UUID of the TLA user we're querying. 
	 * @param {string} goal - URI representing the goal.
	 * @param {string} status - New status of this goal. 
	 */
	deactivateIncompleteGoals(user) {
		return run(`UPDATE ${TBL_GOAL} SET ${COL_STATUS} = (?) WHERE ${COL_USER} = (?) AND status <> (?)`, [goals.statusEnum.inactive, user, goals.statusEnum.satisfied])
			.then(result => goals.readGoals(user))
			.catch(console.error)
	},

	/**
	 * Deletes a goal for a given user.
	 * @param {string} user - UUID of the user to receive the goal.
	 * @param {string} goal - URI representing the goal.
	 */
	deleteGoal(user, goal) {
		return goals.count().then(countBefore => {
			return run(`DELETE FROM ${TBL_GOAL} WHERE user = (?) AND goal = (?)`, [user, goal])
				.then(result => goals.count())
				.then(countAfter => countBefore - countAfter)
		})
	},

	/**
	 * Deletes ALL goals for a given user.  Returns the number of deleted records.
	 * @param {string} user - UUID of the user to receive the goal.
	 */
	deleteGoals(user) {
		return goals.count().then(countBefore => {
			return run(`DELETE FROM ${TBL_GOAL} WHERE user = (?)`, [user])
				.then(result => goals.count())
				.then(countAfter => countBefore - countAfter)
		})
	},

	/**
	 * Returns a count of all known goal assignments.
	 */
	count() {
		return get(`SELECT * FROM ${TBL_GOAL}`).then(results => results.length);
	},

	/**
	 * Enum representing each possible Type of Goal.
	 * 
	 * Currently, this is just Competency.
	 */
	typeEnum: {
		/** Goal represents a Competency, to be met through activities and instructor approval. */
		competency: "competency",
	},

	/**
	 * Enum representing each possible Status of a Goal.
	 */
	statusEnum: {
		/** Goal is available but not active. */
		inactive: "inactive",
		/** Goal is currently active for the given user. */
		active: "active",
		/** Goal has been satisfied by this user. */
		satisfied: "satisfied"
	},
}

module.exports = goals;