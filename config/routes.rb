BubbleTalk::Application.routes.draw do

  get "shares/index"
  get "registrations/update"
  get "home/index"

  devise_for(:users,:controllers => { omniauth_callbacks: "users/omniauth_callbacks", :registrations => "registrations", :sessions => "sessions" })
  devise_scope :user do
    get 'users/me', to: 'sessions#me'
	end
  
  namespace "v1" do
    resources :shares
  end

  resources :shares

  root to: "home#index"
end
