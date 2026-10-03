const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, completeTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', completeTask);

module.exports = router;
