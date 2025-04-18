const Todo = require('../models/todo');
const { google } = require('googleapis');

// Create a Google Calendar client
const createCalendarClient = (user) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken
  });
  
  return google.calendar({ version: 'v3', auth: oauth2Client });
};

// Create a Google Calendar event
const createCalendarEvent = async (todo, user) => {
  try {
    const calendar = createCalendarClient(user);
    
    const event = {
      summary: todo.title,
      description: todo.description || '',
      start: {
        dateTime: todo.dueDate,
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(new Date(todo.dueDate).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour after due date
        timeZone: 'UTC',
      },
    };
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    
    return response.data.id;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Update a Google Calendar event
const updateCalendarEvent = async (todo, user) => {
  try {
    if (!todo.googleCalendarEventId) return;
    
    const calendar = createCalendarClient(user);
    
    const event = {
      summary: todo.title,
      description: todo.description || '',
      start: {
        dateTime: todo.dueDate,
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(new Date(todo.dueDate).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour after due date
        timeZone: 'UTC',
      },
    };
    
    await calendar.events.update({
      calendarId: 'primary',
      eventId: todo.googleCalendarEventId,
      resource: event,
    });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

// Delete a Google Calendar event
const deleteCalendarEvent = async (todo, user) => {
  try {
    if (!todo.googleCalendarEventId) return;
    
    const calendar = createCalendarClient(user);
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: todo.googleCalendarEventId,
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};

// Get all todos for the authenticated user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, category, syncWithCalendar } = req.body;
    
    const todo = new Todo({
      title,
      description,
      dueDate,
      category,
      syncWithCalendar,
      user: req.user._id
    });
    
    // If syncWithCalendar is true and dueDate exists, create a Google Calendar event
    if (syncWithCalendar && dueDate) {
      try {
        const eventId = await createCalendarEvent(todo, req.user);
        todo.googleCalendarEventId = eventId;
      } catch (error) {
        console.error('Failed to sync with Google Calendar:', error);
      }
    }
    
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, completed, dueDate, category, syncWithCalendar } = req.body;
    
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Update fields
    todo.title = title || todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.dueDate = dueDate || todo.dueDate;
    todo.category = category || todo.category;
    
    const prevSyncWithCalendar = todo.syncWithCalendar;
    todo.syncWithCalendar = syncWithCalendar !== undefined ? syncWithCalendar : todo.syncWithCalendar;
    
    // Handle Google Calendar sync
    if (todo.syncWithCalendar && todo.dueDate) {
      if (todo.googleCalendarEventId) {
        // Update existing event
        try {
          await updateCalendarEvent(todo, req.user);
        } catch (error) {
          console.error('Failed to update Google Calendar event:', error);
        }
      } else {
        // Create new event
        try {
          const eventId = await createCalendarEvent(todo, req.user);
          todo.googleCalendarEventId = eventId;
        } catch (error) {
          console.error('Failed to sync with Google Calendar:', error);
        }
      }
    } else if (prevSyncWithCalendar && !todo.syncWithCalendar && todo.googleCalendarEventId) {
      // Remove from calendar if sync is turned off
      try {
        await deleteCalendarEvent(todo, req.user);
        todo.googleCalendarEventId = null;
      } catch (error) {
        console.error('Failed to delete Google Calendar event:', error);
      }
    }
    
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Delete from Google Calendar if it was synced
    if (todo.syncWithCalendar && todo.googleCalendarEventId) {
      try {
        await deleteCalendarEvent(todo, req.user);
      } catch (error) {
        console.error('Failed to delete Google Calendar event:', error);
      }
    }
    
    await todo.remove();
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 