class TricorderController < ApplicationController
  def index
    @json_url = "#{root_path}demo.json"
    if @flow_task = FlowTask.find_by_id(params[:id])
      @rdp_output = @flow_task.outputs.detect{|i| i.file_file_name =~ /.rdp.json/}
      if @abundance_input = @flow_task.inputs.detect{|i| i.file_file_name !~ /.fasta$/}
        @abundance_url = @abundance_input.file.url
      end
    end
    @json_url = "#{root_url.sub(/\/$/, '')}#{@rdp_output.file.url}" if @rdp_output
    
    if signed_in?
      @user_tasks = current_user.flow_tasks.order("id desc").paginate(:page => 1)
    end
    @recent_tasks = FlowTask.order("id desc").paginate(:page => 1)
  end

  def compare
  end

end
