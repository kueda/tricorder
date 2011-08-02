# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110802233038) do

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "flow_task_resources", :force => true do |t|
    t.integer  "flow_task_id"
    t.string   "resource_type"
    t.integer  "resource_id"
    t.string   "type"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "extra"
  end

  add_index "flow_task_resources", ["flow_task_id", "type"], :name => "index_flow_task_resources_on_flow_task_id_and_type"
  add_index "flow_task_resources", ["resource_type", "resource_id"], :name => "index_flow_task_resources_on_resource_type_and_resource_id"

  create_table "flow_tasks", :force => true do |t|
    t.string   "type"
    t.string   "options"
    t.string   "command"
    t.string   "error"
    t.datetime "started_at"
    t.datetime "finished_at"
    t.integer  "user_id"
    t.string   "redirect_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "flow_tasks", ["user_id"], :name => "index_flow_tasks_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
