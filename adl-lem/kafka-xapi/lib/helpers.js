module.exports = {
    
    /**
     * Get the current time in an xAPI-compliant ISO string.
     * @returns String value of the current ISO time.
     */
    getCurrentISOTime: () => new Date().toISOString().slice(0, 22)
}