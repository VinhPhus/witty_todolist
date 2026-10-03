const Task = require('../models/Task');

// Get tasks for a specific date or date range
exports.getTasks = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = { userId: req.user._id };
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      query.dueDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, difficulty } = req.body;
    
    // Validate dueDate (max 7 days)
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(taskDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (taskDate < today) {
       return res.status(400).json({ message: 'Cannot create task in the past' });
    }
    
    if (diffDays > 7) {
      return res.status(400).json({ message: 'Can only create tasks up to 7 days in advance' });
    }
    
    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      dueDate,
      difficulty
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task details (not status)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, difficulty } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id, status: 'pending' },
      { title, description, dueDate, difficulty },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found or already completed' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id, status: 'pending' });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found or already completed' });
    }
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark task as completed
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.user._id });
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.status === 'completed') return res.status(400).json({ message: 'Task already completed' });
    if (task.status === 'overdue') return res.status(400).json({ message: 'Task is overdue' });
    
    // Check overdue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate < today) {
       task.status = 'overdue';
       await task.save();
       return res.status(400).json({ message: 'Task is overdue' });
    }
    
    task.status = 'completed';
    task.completedAt = new Date();
    
    // Add points and rank logic
    const { awardPointsForTask } = require('../services/gamificationService');
    const result = await awardPointsForTask(req.user._id, task._id, task.difficulty);
    
    task.pointsAwarded = result.awarded;
    await task.save();
    
    res.json({ task, gamification: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
