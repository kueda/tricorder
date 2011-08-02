class AddExtraToFlowTaskResources < ActiveRecord::Migration
  def self.up
    add_column :flow_task_resources, :extra, :string
  end

  def self.down
    remove_column :flow_task_resources, :extra
  end
end
