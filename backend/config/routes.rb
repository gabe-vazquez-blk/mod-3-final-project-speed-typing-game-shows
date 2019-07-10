Rails.application.routes.draw do

  get '/shows', to: 'shows#index'
  get '/shows/:id', to: 'shows#show'
  get '/shows/:id/quotes', to: 'shows#quotes'

  get '/quotes', to: 'quotes#index'
  get '/quotes/:id', to: 'quotes#show'

  get '/users', to: 'users#index'
  get '/uses/:id', to: 'users#show'
  post '/users', to: 'users#create'

end
