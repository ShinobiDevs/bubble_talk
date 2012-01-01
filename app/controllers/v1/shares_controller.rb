class V1::SharesController < ApplicationController

  before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token

  respond_to :json

  # POST /v1/shares.json
  def create
    @share = current_user.shares.build(share_params)

    if @share.save
      #respond_with(:v1, @share.includes(:bubbles))
      render :json => @share.as_json(:include => :bubbles)
    else
      respond_with({error: @share.errors.full_messages}, status: :unprocessable_entity)
    end
  end

  # PATCH /v1/shares/1.json
  # PATCH /v1/shares/1
  def update
    @share = current_user.shares.where(uuid: params[:uuid]).first

    if @share.blank?
      respond_with({error: "Share not found"}, status: :not_found)
    else
      if @share.update_attributes(share_params)
        render :json => @share.as_json(:include => :bubbles)
      else
        respond_with({error: @share.errors.full_messages}, status: :unprocessable_entity)
      end
    end
  end

  # DELETE /v1/shares/1.json
  # DELETE /v1/shares/1
  def destroy
    @share = current_user.shares.where(uuid: params[:uuid]).first

    if @share.blank?
      respond_with({error: "Share not found"}, status: :not_found)
    else
      if @share.destroy
        respond_with(:v1, @share)
      else
        respond_with({error: @share.errors.full_messages}, status: :unprocessable_entity)
      end
    end
  end

  # GET /v1/shares/1.json
  # GET /v1/shares/1
  def show
    url = params[:url]
    if url.present?
      @share = current_user.shares.where(url: url).includes(:bubbles).first
    else
      @share = Share.where(uuid: params[:uuid]).includes(:bubbles).first
      current_user.update_attribute(:clicked_share, "")
    end

    if @share.blank?
      respond_with({error: "Share not found"}, status: :not_found)
    else
      #@share = Share.where(uuid: params[:id]).includes(:bubbles).first
      #if @share.present?
      #  @share.increase_page_views
      #end
      render :json => @share.as_json(:include => :bubbles)
    end
  end

  private

    def share_params
      params.require(:share).permit(:user_id, :url, bubbles_attributes: [:_id, :user_id, :left, :top, :height, :width, :direction, :body, :url, :bg_color, :text_color, :bubble_id_num, :_destroy])
    end
end
