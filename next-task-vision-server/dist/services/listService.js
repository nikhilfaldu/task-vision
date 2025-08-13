"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteList = exports.updateList = exports.createList = exports.getListById = exports.getAllLists = exports.setListVisibility = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const setListVisibility = async (id, visible) => {
    return prismaClient_1.default.taskList.update({
        where: { id },
        data: { visible },
    });
};
exports.setListVisibility = setListVisibility;
const getAllLists = async () => {
    return prismaClient_1.default.taskList.findMany({
        include: { tasks: true },
        orderBy: { createdAt: 'asc' },
    });
};
exports.getAllLists = getAllLists;
const getListById = async (id) => {
    return prismaClient_1.default.taskList.findUnique({
        where: { id },
        include: { tasks: true },
    });
};
exports.getListById = getListById;
const createList = async (name) => {
    return prismaClient_1.default.taskList.create({
        data: { name, visible: true },
    });
};
exports.createList = createList;
const updateList = async (id, name) => {
    return prismaClient_1.default.taskList.update({
        where: { id },
        data: { name },
    });
};
exports.updateList = updateList;
const deleteList = async (id) => {
    return prismaClient_1.default.taskList.delete({
        where: { id },
    });
};
exports.deleteList = deleteList;
