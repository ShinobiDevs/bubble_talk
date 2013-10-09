config = YAML::load(File.open(File.join(Rails.root, "config", "facebook.yml")))[Rails.env]
FACEBOOK_APP = FbGraph::Application.new(config["client_id"], secret: config["client_secret"])