require 'bundler'
require 'bundler/setup'
require 'sinatra/reloader'
require 'digest/md5'

# Have Bundler require default Gems
Bundler.require

Dotenv.load

ts = Time.now.to_s
pubKey = "e687d607d622b25c31d6ae38f2f42597"
hash = Digest::MD5.hexdigest(ts + pubKey + ENV['COMIC_VINE_KEY'])
# # Load the file to connect to the DB
# require_relative 'db/connection.rb'
#
# # Load specific routes / controllers
# require_relative 'controllers/artists.rb'
# require_relative 'controllers/songs.rb'
#
# # Load models
# require_relative 'models/artist'
# require_relative 'models/song'

class ComicVine
  include HTTParty
  base_uri 'comicvine.com/api/search/'

  def initialize(api_key, query, format)
    @options = { query: {api_key: api_key, query: query, format: format}}
    # @thingy = Digest::MD5.hexdigest(api_key)
  end

  def character
    self.class.get('/', @options)
  end
end

comicVine = ComicVine.new(ENV['COMIC_VINE_KEY'], 'spider-man', 'json')
# puts hash
# puts Time.now.to_i
# puts Digest::MD5.hexdigest(ENV['COMIC_VINE_KEY'])
# puts comicVine.character
####################
#  General routes  #
####################

get "/" do
  erb :home
end

# puts ENV['MARVEL_PRIVATE_KEY']

# task :mytask => :dotenv do
#   puts ENV['MARVEL_PRIVATE_KEY']
#     # things that require .env
# end


# Use the class methods to get down to business quickly
# response = HTTParty.get('http://www.comicvine.com/api/search/?api_key=fb331d39f4973d84452bf569e1a98a70ca8f4d8f&query=spider-man&format=json')
#
# puts response.body
