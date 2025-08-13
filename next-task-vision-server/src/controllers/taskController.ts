import { Request, Response } from 'express';
import * as taskService from '../services/taskService';

export const createTaskForList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const { title, description, dueDate, allDay, repeat } = req.body;
    if (!title || !listId) {
      return res.status(400).json({ error: 'Title and listId are required' });
    }

    const list = await taskService.getListById(listId);
    if (!list) {
      return res.status(404).json({ error: `List with ID ${listId} not found` });
    }

    const newTask = await taskService.createTaskForList({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      allDay: !!allDay,
      repeat: repeat || 'Does not repeat',
      listId,
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task for list error:', error);
    res.status(500).json({ 
      error: 'Failed to create task for list', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks(req.query.listId as string);
    res.json(tasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, allDay, repeat, completed, starred } = req.body;
    if (!title && !description && !dueDate && !allDay && !repeat && completed === undefined && starred === undefined) {
      return res.status(400).json({ error: 'At least one field is required to update' });
    }

    const updatedTask = await taskService.updateTask(id, {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      allDay: allDay !== undefined ? !!allDay : undefined,
      repeat: repeat || undefined,
      completed,
      starred,
    });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      error: 'Failed to update task', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await taskService.deleteTask(id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      error: 'Failed to delete task', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};
