const Task = require('../db/models/Task');
const User = require('../db/models/User');
class TaskController {
  static async getTasks() {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return tasks;
  }

  static async getPublishTasks(body) {
    const { userId } = body;
    const tasks = await Task.find({ setter: userId }).sort({ createdAt: -1 });
    return tasks;
  }

  static async getAcceptTasks(body) {
    const { userId } = body;
    const tasks = await Task.find({ getter: userId }).sort({ createdAt: -1 });
    return tasks;
  }

  static async getTaskDetail(body, query) {
    const { _id } = query;
    const { url } = body;
    const task = await Task.findById(_id).lean();
    // 将用户ID转换为用户名
    const { username: setter } = await User.findById(task.setter);
    task.setterName = setter;
    if (task.getter) {
      const { username: getter } = await User.findById(task.getter);
      task.getterName = getter;
    }
    // 将图片路径替换为绝对路径
    task.imgs = task.imgs.map((item) => {
      if (item.startsWith('/')) {
        item = `http://${url}${item}`;
      }
      return item;
    });
    return task;
  }

  static async createTask(taskData) {
    let { title, price, content, userId, imgs } = taskData;
    imgs = imgs.map((item) => `/images/${item}`);
    Task.create({
      title,
      price,
      content,
      setter: userId,
      imgs
    });
    return '发布成功';
  }

  static async deleteTask(taskData) {
    const { _id } = taskData;
    await Task.findByIdAndDelete(_id);
    return '删除成功';
  }

  static async editTask(taskData) {
    let { _id, title, price, content, imgs } = taskData;
    imgs = imgs.map((item) => `/images/${item}`);
    const oldTask = await Task.findById(_id);
    if (oldTask.imgs.length >= 6) {
      return '图片数量最大为6张';
    }
    const newImgs = [...oldTask.imgs, ...imgs];
    await Task.findByIdAndUpdate(_id, {
      title,
      price,
      content,
      imgs: newImgs
    });
    return '编辑成功';
  }

  static async acceptTask(taskData) {
    const { userId, _id } = taskData;
    await Task.findByIdAndUpdate(_id, { getter: userId, status: 1 });
    return '接受成功';
  }

  static async giveupTask(taskData) {
    const { _id } = taskData;
    await Task.findByIdAndUpdate(_id, { getter: null, status: 0 });
    return '放弃成功';
  }

  static async finishTask(taskData) {
    const { _id } = taskData;
    await Task.findByIdAndUpdate(_id, { status: 2 });
    return '任务完成';
  }
}

module.exports = TaskController;
