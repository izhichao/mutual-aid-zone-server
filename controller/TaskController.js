const Task = require('../db/models/Task');
const User = require('../db/models/User');
class TaskController {
  static async getTasks() {
    const tasks = await Task.find();
    return tasks;
  }

  static async getPublishTasks(body) {
    const { userId } = body;
    const tasks = await Task.find({ setter: userId });
    return tasks;
  }

  static async getAcceptTasks(body) {
    const { userId } = body;
    const tasks = await Task.find({ getter: userId });
    return tasks;
  }

  static async getTaskDetail(body, query) {
    const { _id } = query;
    const { url } = body;
    const task = await Task.findById(_id).lean();
    const { username } = await User.findById(task.setter);
    // 将图片路径替换为绝对路径
    task.imgs = task.imgs.map((item) => {
      if (item.startsWith('/')) {
        item = `http://${url}${item}`;
      }
      return item;
    });
    // 将用户ID转换为用户名
    task.setter = username;
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
}

module.exports = TaskController;
