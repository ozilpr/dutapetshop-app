exports.up = pgm => {
  pgm.createTable('transactions', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true
    },
    transaction_id: {
      type: 'VARCHAR(30)',
      notNull: true
    },
    resource_id: {
      type: 'VARCHAR(30)',
      notNull: true
    },
    quantity: {
      type: 'INTEGER',
      notNull: true
    },
    price: {
      type: 'INTEGER',
      notNull: true
    },
    discount: {
      type: 'INTEGER',
      notNull: false
    },
    discount_type: {
      type: 'VARCHAR',
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

  pgm.addConstraint('transactions', 'fk_transactions.transaction_id_transaction_details.id', {
    foreignKeys: {
      columns: 'transaction_id',
      references: 'transaction_details(id)',
      onDelete: 'CASCADE',
      exclude: {
        where: 'deleted_at IS NULL'
      }
    }
  }, { ifNotExists: true })

  pgm.addConstraint('transactions', 'fk_transactions.resource_id_med_resources.id', {
    foreignKeys: {
      columns: 'resource_id',
      references: 'med_resources(id)',
      onDelete: 'CASCADE',
      exclude: {
        where: 'deleted_at IS NULL'
      }
    }
  }, { ifNotExists: true })
}

exports.down = pgm => {
  pgm.dropConstraint('transactions', 'fk_transactions.resource_id_med_resources.id', { ifExists: true })
  pgm.dropConstraint('transactions', 'fk_transactions.transaction_id_transaction_details.id', { ifExists: true })
  pgm.dropTable('transactions', { ifExists: true })
}
