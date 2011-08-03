class FlowTasksController < ApplicationController
  before_filter :load_flow_task, :only => [:show, :destroy, :run, :comparisons]
  before_filter :authenticate_user!
  
  PARTIALS = %w(recent user compare)
  
  def index
    @flow_task = FlowTask.find_by_id(params[:flow_task_id])
    @flow_tasks = FlowTask.order("id desc").paginate(:page => params[:page], 
      :per_page => get_per_page)
    respond_to do |format|
      format.html do
        if params[:partial]
          render_flow_task_partial
          return
        end
      end
    end
  end
  
  def user
    @flow_task = FlowTask.find_by_id(params[:flow_task_id])
    @flow_tasks = current_user.flow_tasks.order("id desc").paginate(
      :page => params[:page], :per_page => get_per_page)
    render_flow_task_partial
  end
  
  def show
  end
  
  def new
    klass = params[:type].camlize.constantize rescue FlowTask
    @flow_task = klass.new
  end
  
  def create
    class_name = params.keys.detect{|k| k =~ /flow_task/}
    klass = class_name.camelize.constantize rescue FlowTask
    @flow_task = klass.new(params[class_name])
    @flow_task.inputs.delete_if {|inp| !inp.file.file?}
    @flow_task.user = current_user
    if @flow_task.save
      flash[:notice] = "Task created"
      @flow_task.update_attribute(:redirect_url, task_path(@flow_task.id))
      redirect_to run_flow_task_path(@flow_task.id)
    else
      if file_size_error = @flow_task.errors.delete(:"inputs.file_file_size")
        flash[:error] = "Input file cannot be empty"
        unless @flow_task.errors.blank?
          flash[:error] += " and #{@flow_task.errors.full_messages.to_sentence}"
        end
      else
        flash[:error] = @flow_task.errors.full_messages.to_sentence
      end
      redirect_to root_url
    end
  end
  
  def run
    delayed_progress(request.path) do
      @job = Delayed::Job.enqueue(@flow_task)
    end
  end
  
  def destroy
    @flow_task.destroy
    flash[:notice] = "Task destroyed"
    redirect_to_back_or(flow_tasks_path)
  end
  
  private
  
  def load_flow_task
    return true if @flow_task = FlowTask.find_by_id(params[:id])
    flash[:error] = "That task doesn't exist"
    redirect_to_back_or(flow_tasks_path)
    false
  end
  
  # Encapsulates common pattern for actions that start a bg task get called 
  # repeatedly to check progress
  # Key is required, and a block that assigns a new Delayed::Job to @job
  def delayed_progress(key)
    @tries = params[:tries].to_i
    if @tries > 20
      @status = @error
      @error_msg = "This is taking forever.  Please try again later."
      return
    end
    @job_id = Rails.cache.read(key)
    @job = Delayed::Job.find_by_id(@job_id)
    if @job_id
      if @job && @job.last_error
        @status = "error"
        @error_msg = @job.last_error
        @job.destroy
        Rails.cache.delete(key)
      elsif @job
        @status = "working"
      else
        @status = "done"
        Rails.cache.delete(key)
      end
    else
      @status = "start"
      yield
      Rails.cache.write(key, @job.id)
    end
  end
  
  def render_flow_task_partial
    partial = params[:partial]
    partial = "recent" unless PARTIALS.include?(partial)
    render :partial => partial, :layout => false
  end
  
  def get_per_page
    per_page = (params[:per_page] || 10).to_i
    per_page = 200 if per_page > 200
    per_page
  end
end
