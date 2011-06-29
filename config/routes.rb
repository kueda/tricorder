Tricorder::Application.routes.draw do
    # Riparian routes
  resources :flow_tasks do
    member do
      get :run
    end
  end


  get ":id", :to => "tricorder#index", :as => "task", :constraints => {:id => /\d+/}
  get "tricorder/compare"

    # Riparian routes
  resources :flow_tasks do
    member do
      get :run
    end
  end
  
  resources :users, :only => [ :show, :edit, :update ]
  
  match '/auth/:provider/callback' => 'sessions#create'
  match '/signin' => 'sessions#new', :as => :signin
  match '/signout' => 'sessions#destroy', :as => :signout
  match '/auth/failure' => 'sessions#failure'
  
  root :to => "tricorder#index"
end
