exports.up = pgm => {
  pgm.createTable('admin', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    password: {
      type: 'TEXT',
      notNull: true
    },
    fullname: {
      type: 'TEXT',
      notNull: true
    },
    created_at: {
      type: 'TEXT',
      notNull: true
    },
    updated_at: {
      type: 'TEXT',
      notNull: false
    },
    deleted_at: {
      type: 'TEXT',
      notNull: false,
      default: null
    }
  }, { ifNotExists: true })
}

exports.down = pgm => {
  pgm.dropTable('admin', { ifExists: true })
}
