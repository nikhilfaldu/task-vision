"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = exports.createTaskForList = void 0;
const taskService = __importStar(require("../services/taskService"));
const createTaskForList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { title, description, dueDate, allDay, repeat } = req.body;
        if (!title || !listId) {
            return res.status(400).json({ error: 'Title and listId are required' });
        }
        const newTask = await taskService.createTask({
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            allDay,
            repeat,
            listId,
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create task for list' });
    }
};
exports.createTaskForList = createTaskForList;
const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks(req.query.listId);
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task)
            return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    try {
        const newTask = await taskService.createTask(req.body);
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const updated = await taskService.updateTask(req.params.id, req.body);
        if (!updated)
            return res.status(404).json({ error: 'Task not found' });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const deleted = await taskService.deleteTask(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
