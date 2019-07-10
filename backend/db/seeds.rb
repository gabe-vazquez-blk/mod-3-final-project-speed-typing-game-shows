Quote.delete_all
Show.delete_all

Show.create(name: "Game of Thrones", background_url: "", audio_path: "mp3/Opening Credits Game of Thrones Season 8 (HBO) (1).mp3")
Show.create(name: "Harry Potter", background_url: "", audio_path: "")
Show.create(name: "Fresh Prince of Bel-Air", background_url: "", audio_path: "")
Show.create(name: "Hey Arnold", background_url: "", audio_path: "")


20.times do
  Quote.create(quote: Faker::TvShows::GameOfThrones.unique.quote, show_id: Show.all.first.id)
end

20.times do
  Quote.create(quote: Faker::Movies::HarryPotter.unique.quote, show_id: Show.all.second.id)
end

20.times do
  Quote.create(quote: Faker::TvShows::TheFreshPrinceOfBelAir.unique.quote, show_id: Show.all.third.id)
end

15.times do
  Quote.create(quote: Faker::TvShows::HeyArnold.unique.quote, show_id: Show.all.fourth.id)
end
