"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const getAllTasks = async (listId) => {
    return prismaClient_1.default.task.findMany({
        where: listId ? { listId } : undefined,
        orderBy: { createdAt: 'asc' },
    });
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (id) => {
    return prismaClient_1.default.task.findUnique({
        where: { id },
    });
};
exports.getTaskById = getTaskById;
const createTask = async (data) => {
    return prismaClient_1.default.task.create({
        data,
    });
};
exports.createTask = createTask;
const updateTask = async (id, data) => {
    return prismaClient_1.default.task.update({
        where: { id },
        data,
    });
};
exports.updateTask = updateTask;
const deleteTask = async (id) => {
    return prismaClient_1.default.task.delete({
        where: { id },
    });
};
exports.deleteTask = deleteTask;
