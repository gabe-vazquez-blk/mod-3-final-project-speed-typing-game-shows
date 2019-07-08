Quote.delete_all
Show.delete_all

Show.create(name: "Game of Thrones")
Show.create(name: "Harry Potter")
Show.create(name: "Test Words")


20.times do
  Quote.create(quote: Faker::TvShows::GameOfThrones.unique.quote, show_id: Show.all.first.id)
end

20.times do
  Quote.create(quote: Faker::Movies::HarryPotter.unique.quote, show_id: Show.all.second.id)
end

60.times do
  Quote.create(quote: Faker::Hipster.unique.word, show_id: Show.all.third.id)
end
