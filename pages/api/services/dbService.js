const StormDB = require('stormdb')

// return object so it is cached as singleton
export default {
  db: new StormDB(new StormDB.localFileEngine('db.json'), {
    async: false
  }),
  initialized: false,
  init: function() {
    if (!this.initialized) {
      this.db.default({
        tasks: [],
        sessions: []
      })
      console.log('db initialized')
    }
    this.initialized = true
  },
  getDB: function() {
    return this.db
  }
}
