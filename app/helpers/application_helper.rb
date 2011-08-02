module ApplicationHelper
  def serial_id
    @__serial_id = @__serial_id.to_i + 1
    @__serial_id
  end
end
