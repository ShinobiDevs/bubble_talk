class SharesController < ApplicationController
	def show
		uuid = params[:uuid];
		if uuid.present?
			@share = Share.where(uuid: uuid).first
		else
			@share = Share.where(uuid: params[:id]).first
			@user = @share.user
		end

		respond_to do |wants|
      wants.html
      wants.json { render :json => @share.as_json(:include => :bubbles) }
    end
  	#checked = params[:checked]
  	
  	#if checked.present?
  		#@share = Share.where(uuid: params[:uuid]).includes(:bubbles).first
  		#current_user.update_attribute(:clicked_share, params[:id])
  		#redirect_to @share.url
  	#else
  	#	@share = Share.where(uuid: params[:id]).first
  	#	@user = @share.user
	  #end
  end
end
