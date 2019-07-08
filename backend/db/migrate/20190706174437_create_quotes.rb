class CreateQuotes < ActiveRecord::Migration[5.2]
  def change
    create_table :quotes do |t|
      t.text :quote
      t.belongs_to :show, foreign_key: true

      t.timestamps
    end
  end
end
