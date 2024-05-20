exports.up = pgm => {
  pgm.createTable('owners', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true
    },
    register_code: {
      type: 'VARCHAR(16)',
      notNull: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    phone: {
      type: 'VARCHAR(15)',
      notNull: false
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
  pgm.dropTable('owners', { ifExists: true })
}
