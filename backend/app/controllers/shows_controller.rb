class ShowsController < ApplicationController
  def index
    shows = Show.all
    render json: shows
  end

  def show
    show = Show.find(params[:id])
    render json: show
  end

  def quotes
    show_obj = Show.find(params[:id])
    quotes = show_obj.quotes
    render json: quotes
  end
end
