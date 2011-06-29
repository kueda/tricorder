class TricorderController < ApplicationController
  def index
    @json_url = "/demo.json"
    if @flow_task = FlowTask.find_by_id(params[:id])
      @rdp_output = @flow_task.outputs.detect{|i| i.file_file_name =~ /.rdp.json/}
    end
    @json_url = @rdp_output.file.try(:url) if @rdp_output
    
    if signed_in?
      @user_tasks = current_user.flow_tasks.order("id desc").paginate(:page => 1)
    end
    @recent_tasks = FlowTask.order("id desc").paginate(:page => 1)
  end

  def compare
  end

end
