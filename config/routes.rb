BubbleTalk::Application.routes.draw do
  namespace "v1" do
    resources :shares
  end
end
