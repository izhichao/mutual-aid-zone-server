const Task = require('../db/models/Task');
const User = require('../db/models/User');
class TaskController {
  static async getTasks() {
    const tasks = await Task.find().sort({ createdAt: -1 }).lean();
    for (let i = 0; i < tasks.length; i++) {
      const { username: setter } = await User.findById(tasks[i].setter);
      tasks[i].setterName = setter;
      if (tasks[i].getter) {
        const { username: getter } = await User.findById(tasks[i].getter);
        tasks[i].getterName = getter;
      } else {
        tasks[i].getterName = '无';
      }
    }
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
    try {
      const task = await Task.findById(_id).lean();
      // 将用户ID转换为用户名
      const { username: setter } = await User.findById(task.setter);
      task.setterName = setter;
      if (task.getter) {
        const { username: getter } = await User.findById(task.getter);
        task.getterName = getter;
      } else {
        task.getterName = '无';
      }
      // 将图片路径替换为绝对路径
      task.imgs = task.imgs.map((item) => {
        if (item.startsWith('/')) {
          item = `http://${url}${item}`;
        }
        return item;
      });
      return task;
    } catch (error) {
      return '任务不存在';
    }
  }

  static async createTask(taskData) {
    let { title, price, content, userId, imgs } = taskData;
    imgs = imgs.map((item) => `/images/${item}`);

    // 获取用户的余额，判断是否足够
    const user = await User.findById(userId);
    if (user.balance < parseInt(price)) {
      return '余额不足';
    } else {
      await User.findByIdAndUpdate(userId, {
        balance: user.balance - parseInt(price)
      });
    }
    const task = await Task.create({
      title,
      price,
      content,
      setter: userId,
      imgs
    });
    return task;
  }

  static async deleteTask(taskData) {
    const { _id } = taskData;
    const task = await Task.findByIdAndDelete(_id);
    const setter = await User.findById(task.setter);
    await User.findByIdAndUpdate(task.setter, { balance: setter.balance + task.price });
    return '删除成功';
  }

  static async editTask(taskData) {
    let { _id, title, price, content, imgs, status } = taskData;
    // 处理图片
    imgs = imgs.map((item) => `/images/${item}`);
    const oldTask = await Task.findById(_id);
    if (oldTask.imgs.length >= 6 && imgs.length > 0) {
      return '图片数量最大为6张';
    }
    const newImgs = [...oldTask.imgs, ...imgs];
    const newTask = {
      title,
      price,
      content,
      imgs: newImgs
    };

    if (status !== oldTask.status) {
      if (oldTask.getter) {
        // 任务有接收者时
        if (status === 0) {
          // 移除接收者
          newTask.getter = null;
          newTask.status = status;
        } else if (status === 1) {
          newTask.status = status;
          const getter = await User.findById(oldTask.getter);
          if (getter.balance < parseInt(price)) {
            return `接收者余额不足${oldTask.price}元，无法修改任务状态`;
          }
          await User.findByIdAndUpdate(oldTask.getter, { balance: getter.balance - oldTask.price });
        } else {
          newTask.status = status;
          const getter = await User.findById(oldTask.getter);
          await User.findByIdAndUpdate(oldTask.getter, { balance: getter.balance + oldTask.price });
        }
      } else {
        // 任务无接收者时
        if (status === 1 || status === 2) {
          return '任务暂无接收者，无法修改状态！';
        }
      }
    }

    const task = await Task.findByIdAndUpdate(_id, newTask, { new: true });
    return task;
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
    const task = await Task.findByIdAndUpdate(_id, { status: 2 });
    const getter = await User.findById(task.getter);
    await User.findByIdAndUpdate(task.getter, { balance: getter.balance + task.price });
    return '任务完成';
  }
}

module.exports = TaskController;
