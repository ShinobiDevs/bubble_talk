class V1::SharesController < ApplicationController

  before_filter :authenticate_user!

  respond_to :html, except: [:create, :update]
  respond_to :json

  # POST /v1/shares.json
  def create
    @share = current_user.shares.build(params[:share])

    if @share.save
      respond_with(@share)
    else
      respond_with({error: @share.errors.full_messages}, status: :unprocessable_entity)
    end
  end

  # PATCH /v1/shares/1.json
  def update
    @share = current_user.shares.where(id: params[:id]).first

    if @share.blank?
      respond_with({error: "Share not found"}, status: :not_found)
    else
      if @share.update_attributes(params[:share])
        respond_with(@share)
      else
        respond_with({error: @share.errors.full_messages}, status: :unprocessable_entity)
      end
    end
  end

  # GET /v1/shares/1.json
  # GET /v1/shares/1
  def show
    @share = Share.find(params[:id]).includes(:bubbles)
    respond_with(@share)
  end
end
