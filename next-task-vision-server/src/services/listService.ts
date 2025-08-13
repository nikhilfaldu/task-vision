import prisma from '../prismaClient';

export const setListVisibility = async (id: string, visible: boolean) => {
  return prisma.taskList.update({
    where: { id },
    data: { visible },
  });
};

export const getAllLists = async () => {
  return prisma.taskList.findMany({
    include: { tasks: true },
    orderBy: { createdAt: 'asc' },
  });
};

export const getListById = async (id: string) => {
  return prisma.taskList.findUnique({
    where: { id },
    include: { tasks: true },
  });
};

export const createList = async (name: string) => {
  return prisma.taskList.create({
    data: { name, visible: true },
  });
};

export const updateList = async (id: string, name: string) => {
  return prisma.taskList.update({
    where: { id },
    data: { name },
  });
};

export const deleteList = async (id: string) => {
  // First delete all tasks for this list
  await prisma.task.deleteMany({
    where: { listId: id },
  });
  // Then delete the list itself
  return prisma.taskList.delete({
    where: { id },
  });
};
