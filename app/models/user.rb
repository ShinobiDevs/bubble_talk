class User
  include Mongoid::Document
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :token_authenticatable

  field :email,              :type => String, :default => ""
  field :facebook_uid,              :type => String, :default => ""
  field :access_token,              :type => String, :default => ""
  field :name,              :type => String, :default => ""
  field :profile_picture,              :type => String, :default => ""
  field :encrypted_password, :type => String, :default => ""
  field :reset_password_token,   :type => String
  field :reset_password_sent_at, :type => Time
  field :remember_created_at, :type => Time
  field :sign_in_count,      :type => Integer, :default => 0
  field :current_sign_in_at, :type => Time
  field :last_sign_in_at,    :type => Time
  field :current_sign_in_ip, :type => String
  field :last_sign_in_ip,    :type => String
  field :authentication_token, :type => String


  has_many :shares
  has_many :bubbles

  def as_json(options)
    super(options.merge(only: [:email, :name, :profile_picture, :authentication_token]))
  end
end
