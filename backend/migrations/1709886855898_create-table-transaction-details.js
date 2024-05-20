exports.up = pgm => {
  pgm.createTable('transaction_details', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true
    },
    owner_id: {
      type: 'VARCHAR(30)',
      notNull: true
    },
    transaction_date: {
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

  pgm.addConstraint('transaction_details', 'fk_transaction_details.owner_id_owners.id', {
    foreignKeys: {
      columns: 'owner_id',
      references: 'owners(id)',
      onDelete: 'CASCADE',
      exclude: {
        where: 'deleted_at IS NULL'
      }
    }
  }, { ifNotExists: true })
}

exports.down = pgm => {
  pgm.dropConstraint('transaction_details', 'fk_transaction_details.owner_id_owners.id', { ifExists: true })
  pgm.dropTable('transaction_details', { ifExists: true })
}
