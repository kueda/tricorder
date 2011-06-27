require 'test_helper'

class TricorderControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get compare" do
    get :compare
    assert_response :success
  end

end
