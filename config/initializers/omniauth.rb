Rails.application.config.middleware.use OmniAuth::Builder do
  require 'openid/store/filesystem'
  
  # generic openid
  provider :openid, OpenID::Store::Filesystem.new('./tmp'), :name => 'openid'
  
  provider :openid, OpenID::Store::Filesystem.new('./tmp'), :name => 'google', :identifier => 'https://www.google.com/accounts/o8/id'
end
