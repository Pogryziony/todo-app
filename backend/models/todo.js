const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'other'],
    default: 'other'
  },
  syncWithCalendar: {
    type: Boolean,
    default: false
  },
  googleCalendarEventId: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema); 