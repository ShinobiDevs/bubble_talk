class Share
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  has_many :bubbles

  field :uuid,                   type: String
  field :url,                    type: String
  field :page_views,             type: Integer, default: 0

  accepts_nested_attributes_for :bubbles

  before_create :create_uuid
  
  def increase_page_views
    self.inc({page_views: 1})
  end

  protected

  # Create the UUID for the share
  def create_uuid
    self.uuid = SecureRandom.hex(12)
  end
end
