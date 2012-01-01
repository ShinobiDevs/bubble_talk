class User
  include Mongoid::Document
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :token_authenticatable

  devise :omniauthable, :omniauth_providers => [:facebook]

  before_save :ensure_authentication_token

  ## Database authenticatable
  field :email,                 :type => String, :default => ""
  field :encrypted_password,    :type => String, :default => ""
  field :authentication_token,  :type => String

  # Facebook
  field :provider,          :type => String
  field :access_token,      :type => String, :default => ""
  field :facebook_uid,      :type => String, :default => ""
  field :name,              :type => String, :default => ""
  field :profile_picture,   :type => String, :default => ""
  
  ## Recoverable
  field :reset_password_token,   :type => String
  field :reset_password_sent_at, :type => Time

  ## Rememberable
  field :remember_created_at, :type => Time

  ## Trackable
  field :sign_in_count,       :type => Integer, :default => 0
  field :current_sign_in_at,  :type => Time
  field :last_sign_in_at,     :type => Time
  field :current_sign_in_ip,  :type => String
  field :last_sign_in_ip,     :type => String
  
  has_many :shares
  has_many :bubbles

  def self.find_for_facebook_oauth(auth, signed_in_resource=nil)
    user = User.where(:provider => auth.provider, :facebook_uid => auth.uid).first
    unless user
      facebook_user = FbGraph::User.fetch(:me, access_token: auth.credentials.token)

      user = User.create!(name:facebook_user.name,
                          access_token: facebook_user.access_token.to_s,
                          provider:"facebook",
                          profile_picture: facebook_user.picture,
                          facebook_uid:facebook_user.identifier,
                          email:facebook_user.email,
                          password:Devise.friendly_token[0,20])
    end
    user
  end

  def as_json(options)
    super(options.merge(only: [:_id, :email, :name, :profile_picture, :authentication_token]))
  end
end
