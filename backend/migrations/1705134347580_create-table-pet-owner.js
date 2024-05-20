exports.up = pgm => {
  pgm.createTable('pet_owner', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true
    },
    owner_id: {
      type: 'VARCHAR(30)',
      notNull: true
    },
    pet_id: {
      type: 'VARCHAR(30)',
      notNull: true
    },
    created_at: {
      type: 'TEXT',
      notNull: true
    },
    updated_at: {
      type: 'TEXT',
      notNull: false
    }
  }, { ifNotExists: true })

  pgm.addConstraint('pet_owner', 'fk_pet_owner.pet_id_pets.id', {
    foreignKeys: {
      columns: 'pet_id',
      references: 'pets(id)',
      onDelete: 'CASCADE',
      exclude: {
        where: 'deleted_at IS NULL'
      }
    }
  }, { ifNotExists: true })

  pgm.addConstraint('pet_owner', 'fk_pet_owner.owner_id_owners.id', {
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
  pgm.dropConstraint('pet_owner', 'fk_pet_owner.owner_id_owners.id', { ifExists: true })
  pgm.dropConstraint('pet_owner', 'fk_pet_owner.pet_id_pets.id', { ifExists: true })
  pgm.dropTable('pet_owner', { ifExists: true })
}
