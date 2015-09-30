require 'bundler'
require 'bundler/setup'
require 'sinatra/reloader'
require 'digest/md5'

# Have Bundler require default Gems
Bundler.require

# Load Dotenv which allows access to environment variable
Dotenv.load

# Register Gon-sinatra so that we can send hash variable to js
Sinatra::register Gon::Sinatra

# Set up md5 hash for Marvel authentication
time = Time.now.to_i
my_ts = time.to_s
pubKey = "e687d607d622b25c31d6ae38f2f42597"
my_hash = Digest::MD5.hexdigest(my_ts + ENV['MARVEL_PRIVATE_KEY'] + pubKey )
name = 'spider-man'

# A class for getting json from Marvel using HTTParty; for later use

# class Marvel
#   include HTTParty
#   base_uri 'gateway.marvel.com'
#
#   def initialize(name, my_ts, apikey, my_hash)
#     @options = { query: {name: name, my_ts: my_ts, apikey: apikey, my_hash: my_hash}}
#   end
#
#   def character
#     self.class.get('/v1/public/characters', @options)
#   end
# end
#
# marvel = Marvel.new(name, my_ts, pubKey, my_hash)

####################
#  General routes  #
####################

get "/" do
  @my_ts = my_ts
  @my_hash = my_hash
  gon.my_ts = @my_ts
  gon.my_hash = @my_hash
  erb :home
  # , :locals => {:scooby => marvel.character}
end
