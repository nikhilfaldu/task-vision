import { Router } from 'express';
import * as listController from '../controllers/listController';

const router = Router();


router.get('/', listController.getAllLists);
router.get('/:id', listController.getListById);
router.post('/', listController.createList);
router.put('/:id', listController.updateList);
router.patch('/:id/visible', listController.setListVisibility);
router.delete('/:id', listController.deleteList);

// Add task to a specific list
import { createTaskForList } from '../controllers/taskController';
router.post('/:listId/tasks', createTaskForList);

export default router;
