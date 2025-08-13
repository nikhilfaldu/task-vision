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
exports.deleteList = exports.updateList = exports.createList = exports.getListById = exports.getAllLists = exports.setListVisibility = void 0;
const setListVisibility = async (req, res) => {
    try {
        const { visible } = req.body;
        if (typeof visible !== 'boolean') {
            return res.status(400).json({ error: 'visible must be boolean' });
        }
        const updated = await listService.setListVisibility(req.params.id, visible);
        if (!updated)
            return res.status(404).json({ error: 'List not found' });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update list visibility' });
    }
};
exports.setListVisibility = setListVisibility;
const listService = __importStar(require("../services/listService"));
const getAllLists = async (req, res) => {
    try {
        const lists = await listService.getAllLists();
        res.json(lists);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
};
exports.getAllLists = getAllLists;
const getListById = async (req, res) => {
    try {
        const list = await listService.getListById(req.params.id);
        if (!list)
            return res.status(404).json({ error: 'List not found' });
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch list' });
    }
};
exports.getListById = getListById;
const createList = async (req, res) => {
    try {
        const newList = await listService.createList(req.body.name);
        res.status(201).json(newList);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create list' });
    }
};
exports.createList = createList;
const updateList = async (req, res) => {
    try {
        const updated = await listService.updateList(req.params.id, req.body.name);
        if (!updated)
            return res.status(404).json({ error: 'List not found' });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update list' });
    }
};
exports.updateList = updateList;
const deleteList = async (req, res) => {
    try {
        const deleted = await listService.deleteList(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'List not found' });
        res.json({ message: 'List deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete list' });
    }
};
exports.deleteList = deleteList;
