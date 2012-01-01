class Bubble
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :share
  belongs_to :user
  field :uuid,          type: String
  field :left,          type: Integer
  field :top,           type: Integer
  field :width,         type: Integer
  field :height,        type: Integer
  field :direction,     type: String
  field :url,           type: String
  field :body,          type: String
  field :bg_color,      type: String
  field :text_color,    type: String
  field :bubble_id_num, type: Integer

  before_create :create_uuid

  protected

  # Create the UUID for the share
  def create_uuid
    self.uuid = SecureRandom.hex(12)
  end
end
