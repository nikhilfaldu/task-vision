export const setListVisibility = async (req: Request, res: Response) => {
  try {
    const { visible } = req.body;
    if (typeof visible !== 'boolean') {
      return res.status(400).json({ error: 'visible must be boolean' });
    }
    const updated = await listService.setListVisibility(req.params.id, visible);
    if (!updated) return res.status(404).json({ error: 'List not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update list visibility' });
  }
};
import { Request, Response } from 'express';
import * as listService from '../services/listService';

export const getAllLists = async (req: Request, res: Response) => {
  try {
    const lists = await listService.getAllLists();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
};

export const getListById = async (req: Request, res: Response) => {
  try {
    const list = await listService.getListById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch list' });
  }
};

export const createList = async (req: Request, res: Response) => {
  try {
    const newList = await listService.createList(req.body.name);
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create list' });
  }
};

export const updateList = async (req: Request, res: Response) => {
  try {
    const updated = await listService.updateList(req.params.id, req.body.name);
    if (!updated) return res.status(404).json({ error: 'List not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update list' });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    const deleted = await listService.deleteList(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'List not found' });
    res.json({ message: 'List deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete list' });
  }
};
