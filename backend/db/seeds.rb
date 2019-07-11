Quote.delete_all
Show.delete_all

Show.create(name: "Game of Thrones", background_url: "https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif", audio_path: "mp3/Game_of_Thrones_theme_song.mp3")
Show.create(name: "Harry Potter", background_url: "https://media.giphy.com/media/26BRzozg4TCBXv6QU/giphy.gif", audio_path: "mp3/Harry_Potter_theme_song.mp3")
Show.create(name: "Fresh Prince of Bel-Air", background_url: "https://media.giphy.com/media/wqPWKOtW2AD9S/giphy.gif", audio_path: "mp3/Fresh_Prince_of_Bel_Air_theme_song.mp3")
Show.create(name: "Hey Arnold", background_url: "https://media.giphy.com/media/yfrAFw5xz4RNu/giphy.gif", audio_path: "mp3/Hey_Arnold_theme_song.mp3")


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
