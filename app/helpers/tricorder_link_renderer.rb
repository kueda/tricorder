class TricorderLinkRenderer < WillPaginate::ActionView::LinkRenderer
  # Allow :params to completely override GET params
  def merge_optional_params(url_params)
    url_params.merge!(@options[:params] || {})
  end
end
