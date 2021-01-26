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
        tasks: [{
          id:'ccf00b24-6fb5-4f29-8f01-0da8efa3f5d3',
          task:'stalker',
          last_modified:(new Date()).toISOString(),
          selected: false,
          editing: false,
          current: 0,
          total: 0
        }],
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
