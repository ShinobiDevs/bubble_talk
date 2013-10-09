class Bubble
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :share
  belongs_to :user
  field :left,        type: Integer
  field :right,       type: Integer
  field :top,         type: Integer
  field :bottom,      type: Integer
  field :direction,   type: String
  field :url,         type: String
  field :body,        type: String
  field :bg_color,    type: String
  field :text_color,  type: String
end
