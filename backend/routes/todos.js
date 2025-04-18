const express = require('express');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

const router = express.Router();

// All todo routes require authentication
router.use(auth);

// CRUD operations for todos
router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.get('/:id', todoController.getTodoById);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router; 