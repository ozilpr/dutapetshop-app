exports.up = pgm => {
  pgm.createTable('pets', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    type: {
      type: 'VARCHAR(30)',
      notNull: false
    },
    race: {
      type: 'VARCHAR(30)',
      notNull: false
    },
    gender: {
      type: 'VARCHAR(10)',
      notNull: false
    },
    birthdate: {
      type: 'TEXT',
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
  pgm.dropTable('pets', { ifExists: true })
}
