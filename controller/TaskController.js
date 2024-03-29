const Task = require('../models/Task');
const User = require('../models/User');
class TaskController {
  static async getTasks(body, query) {
    const { page, pageSize, type } = query;
    const { userId } = body;
    // 判断列表类型
    let selectObj = {};
    if (type === 'publish') {
      selectObj = { setter: userId };
    } else if (type === 'accept') {
      selectObj = { getter: userId };
    }

    // 获取数据
    const total = (await Task.find(selectObj)).length;
    const tasks = await Task.find(selectObj)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('setter getter', 'username')
      .lean();
    tasks.forEach((item) => {
      item.setter = item.setter.username;
      item.getter = item.getter?.username || '无';
    });
    return { total, list: tasks };
  }

  static async getSearchTasks(query) {
    const { keyword } = query;
    const tasks = await Task.find({ title: { $regex: keyword } }).sort({ createdAt: -1 });
    return tasks;
  }

  static async getTask(body, query) {
    const { _id } = query;
    const { url, protocol } = body;
    try {
      const task = await Task.findById(_id).populate('setter getter', 'username').lean();
      // 将图片路径替换为绝对路径
      task.imgs = task.imgs.map((item) => {
        if (item.startsWith('/')) {
          item = `${protocol}://${url}${item}`;
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
    if (task.status !== 2) {
      await User.findByIdAndUpdate(task.setter, { balance: setter.balance + task.price });
    }
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

    // 修改价格
    if (price !== oldTask.price) {
      if (status && status !== oldTask.status) {
        return '价格与状态不可同时修改';
      }
      if (oldTask.status === 2) {
        return '任务已完成，无法修改价格';
      }
      const setter = await User.findById(oldTask.setter);
      const gap = price - oldTask.price;
      if (setter.balance < gap) {
        return '余额不足';
      }
      await User.findByIdAndUpdate(oldTask.setter, { balance: setter.balance - gap });
    }

    // 修改状态
    if (status != null && status !== oldTask.status) {
      if (oldTask.status === 0) {
        // 未接受 -> 已接受/已完成
        return '任务暂无接受者，无法修改状态！';
      } else if (oldTask.status === 1) {
        if (status === 0) {
          // 已接受 -> 未接受
          newTask.getter = null;
          newTask.status = status;
        } else if (status === 2) {
          // 已接受 -> 已完成
          newTask.status = status;
          const getter = await User.findById(oldTask.getter);
          await User.findByIdAndUpdate(oldTask.getter, { balance: getter.balance + oldTask.price });
        }
      } else {
        // 已完成 -> 未接受/已接受
        if (status === 0) {
          newTask.getter = null;
        }
        newTask.status = status;
        const getter = await User.findById(oldTask.getter);
        if (getter.balance < parseInt(oldTask.price)) {
          return `接受者余额不足${oldTask.price}元，无法修改任务状态`;
        }
        await User.findByIdAndUpdate(oldTask.getter, { balance: getter.balance - oldTask.price });
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
