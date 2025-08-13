import prisma from '../prismaClient';

export const getAllTasks = async (listId?: string) => {
  return prisma.task.findMany({
    where: listId ? { listId } : undefined,
    orderBy: { createdAt: 'asc' },
    include: { list: true },
  });
};

export const getTaskById = async (id: string) => {
  return prisma.task.findUnique({
    where: { id },
    include: { list: true },
  });
};

export const getListById = async (id: string) => {
  return prisma.taskList.findUnique({
    where: { id },
  });
};

export const createTaskForList = async (data: {
  title: string;
  description?: string;
  dueDate?: Date;
  allDay: boolean;
  repeat: string;
  listId: string;
}) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      completed: false,
      starred: false,
      listId: data.listId,
    },
  });
};

export const createTask = async (data: any) => {
  return prisma.task.create({
    data,
  });
};

export const updateTask = async (id: string, data: any) => {
  const updatableFields = {
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    completed: data.completed,
    starred: data.starred,
  };
  // Filter out undefined values to avoid overwriting with null
  const filteredData = Object.fromEntries(
    Object.entries(updatableFields).filter(([_, v]) => v !== undefined)
  );
  return prisma.task.update({
    where: { id },
    data: filteredData,
  });
};

export const deleteTask = async (id: string) => {
  return prisma.task.delete({
    where: { id },
  });
};
