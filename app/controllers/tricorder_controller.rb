class TricorderController < ApplicationController
  before_filter :load_header_data
  def index
    @json_url = "#{root_path}demo.json"
    if @flow_task = FlowTask.find_by_id(params[:id])
      @rdp_output = @flow_task.rdp_output
      if @abundance_input = @flow_task.abundances_input
        @abundance_url = @abundance_input.file.url
      end
    end
    @json_url = @rdp_output.file.url if @rdp_output
  end

  def compare
    unless @flow_task = FlowTask.find_by_id(params[:id])
      flash[:error] = "That task doesn't exist"
      redirect_to_back_or('/')
    end
    unless @other_flow_task = FlowTask.find_by_id(params[:other_id])
      flash[:error] = "That task doesn't exist"
      redirect_to_back_or(task_path(@flow_task))
    end
    
    @rdp_output       = @flow_task.rdp_output
    @json_url         = @rdp_output.file.url
    @abundance_input  = @flow_task.abundances_input
    
    @other_rdp_output      = @other_flow_task.rdp_output
    @other_json_url        = @other_rdp_output.file.url
    @other_abundance_input = @other_flow_task.abundances_input
  end
  
  private
  def load_header_data
    if signed_in?
      @user_tasks = current_user.flow_tasks.order("id desc").paginate(:page => 1, :per_page => 10)
    end
    @recent_tasks = FlowTask.order("id desc").paginate(:page => 1, :per_page => 10)
  end
end
