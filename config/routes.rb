Tricorder::Application.routes.draw do
  get ":id", :to => "tricorder#index", :as => "task", :constraints => {:id => /\d+/}
  get ":id/compare/:other_id", :to => "tricorder#compare", :as => "compare", :constraints => {:id => /\d+/, :other_id => /\d+/}

  # Riparian routes
  resources :flow_tasks, :constraints => {:id => /\d+/} do
    collection do
      get :user
    end
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
