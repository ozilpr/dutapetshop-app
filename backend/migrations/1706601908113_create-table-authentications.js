exports.up = pgm => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true
    }
  }, { ifNotExist: true })
}

exports.down = pgm => {
  pgm.dropTable('authentications', { ifExists: true })
}
