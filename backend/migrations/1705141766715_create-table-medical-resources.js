exports.up = pgm => {
  pgm.createTable('med_resources', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    description: {
      type: 'VARCHAR(200)',
      notNull: false
    },
    type: {
      type: 'VARCHAR(50)',
      notNull: false
    },
    price: {
      type: 'VARCHAR(50)',
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
  pgm.dropTable('med_resources', { ifExists: true })
}
