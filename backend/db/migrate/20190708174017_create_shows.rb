class CreateShows < ActiveRecord::Migration[5.2]
  def change
    create_table :shows do |t|
      t.string :name
      t.string :background_url
      t.string  :audio_path
      t.timestamps
    end
  end
end
