class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user
  helper_method :signed_in?
  helper_method :correct_user?
  
  include FlowTasksHelper

  private
    def current_user
      begin
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
      rescue Mongoid::Errors::DocumentNotFound
        nil
      end
    end

    def signed_in?
      return true if current_user
    end

    def correct_user?
      @user = User.find(params[:id])
      unless current_user == @user
        redirect_to root_url, :alert => "Access denied."
      end
    end

    def authenticate_user!
      if !current_user
        redirect_to root_url, :alert => 'You need to sign in for access to this page.'
      end
    end
    
    def redirect_to_back_or(alt, options = {})
      url = request.env['HTTP_REFERER'] || alt
      url = alt if url == request.url
      url = '/' if url == request.url
      redirect_to(url, options)
    end

end
