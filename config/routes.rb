BubbleTalk::Application.routes.draw do

  devise_for(:users,:controllers => { :sessions => "sessions" })
  
  namespace "v1" do
    resources :shares
  end
end
