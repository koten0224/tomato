class Api::V1::TasksController < ApiController
  before_action :authenticate_user_token
  
  def gettasks
    tasks = current_user.tasks
    render json: { message: "ok", tasks: tasks }, status: 200
  end

  # 收到token & task_id, then create a tictac, return tictac_id
  def startwork
    task = current_user.tasks.find(params["task_id"])
    @tictac = Tictac.new(user_id: current_user.id, task_id: task.id)
    @tictac.start!
    render json: { message: "tictac start", tictac_id: @tictac.id }, status: 200
  end

  # Vue API
  def index
    @task = current_user.tasks
    render format: :json
  end

  def create
    @task = current_user.tasks.build(task_params)

    if @task.save
      render json: { state: 'ok', task: @task }
    else
      render json: { state: 'create error' }
    end
  end

  def update
    render json: { state: 'update ok' }
  end

  def destroy 
    task = current_user.tasks.find(params[:id])
    task.destroy
    render json: { state: 'ok', taskId: task.id }
  end

  private

  def task_params
    params.require(:task).permit(:title, 
                                 :description,
                                 :expect_tictacs,
                                 :date,
                                 :project_id,
                                 tag_items: []
   )
  end

end