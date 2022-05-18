const Task = require('../db/models/Task');

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
