class SessionsController < ApplicationController

  def new
    redirect_to "#{root_path}auth/google"
  end

  def create
    auth = request.env["omniauth.auth"]
    user = User.where(:provider => auth['provider'], :uid => auth['uid']).first
    user ||= User.where(:email => auth['user_info']['email']) if auth['user_info']['email']
    user ||= User.create_with_omniauth(auth)
    session[:user_id] = user.id
    redirect_to root_url, :notice => 'Signed in!'
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => 'Signed out!'
  end

  def failure
    redirect_to root_url, :alert => "Authentication error: #{params[:message].humanize}"
  end

end
