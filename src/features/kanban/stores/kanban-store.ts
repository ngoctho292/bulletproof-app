import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Column, Board, Member } from '../types';
import { nanoid } from 'nanoid';

interface KanbanState {
  // Boards
  boards: Board[];
  currentBoardId: string | null;
  
  // Tasks
  tasks: Task[];
  
  // Board operations
  createBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'columns' | 'members'>) => string;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (id: string | null) => void;
  duplicateBoard: (id: string) => void;
  
  // Member operations
  addMember: (boardId: string, member: Omit<Member, 'id' | 'joinedAt'>) => void;
  updateMember: (boardId: string, memberId: string, updates: Partial<Member>) => void;
  removeMember: (boardId: string, memberId: string) => void;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  moveTask: (id: string, status: string) => void;
  assignTask: (taskId: string, memberIds: string[]) => void;
  
  // Column operations
  addColumn: (boardId: string, column: Omit<Column, 'id'>) => void;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  reorderColumns: (boardId: string, columns: Column[]) => void;
  
  // Helpers
  getCurrentBoard: () => Board | null;
  getBoardTasks: (boardId: string) => Task[];
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      boards: [
        {
          id: 'default-board',
          name: 'My First Board',
          description: 'Default board for getting started',
          color: 'blue',
          createdBy: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          columns: [
            { id: 'todo', title: 'To Do', color: 'gray' },
            { id: 'in-progress', title: 'In Progress', color: 'blue' },
            { id: 'done', title: 'Done', color: 'green' },
          ],
          members: [
            {
              id: 'default-user',
              name: 'You',
              email: 'user@example.com',
              role: 'owner',
              joinedAt: new Date(),
            },
          ],
        },
      ],
      currentBoardId: 'default-board',
      tasks: [
        {
          id: '1',
          title: 'Setup project',
          description: 'Initialize Next.js project with TypeScript',
          status: 'done',
          createdAt: new Date(),
          assignedTo: ['default-user'],
          priority: 'high',
        },
        {
          id: '2',
          title: 'Create components',
          description: 'Build reusable UI components',
          status: 'in-progress',
          createdAt: new Date(),
          assignedTo: ['default-user'],
          priority: 'medium',
        },
        {
          id: '3',
          title: 'Write documentation',
          description: 'Document the codebase',
          status: 'todo',
          createdAt: new Date(),
          priority: 'low',
        },
      ],

      // Board operations
      createBoard: (board) => {
        const id = nanoid();
        const newBoard: Board = {
          ...board,
          id,
          columns: [
            { id: nanoid(), title: 'To Do', color: 'gray' },
            { id: nanoid(), title: 'In Progress', color: 'blue' },
            { id: nanoid(), title: 'Done', color: 'green' },
          ],
          members: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          currentBoardId: id,
        }));

        return id;
      },

      updateBoard: (id, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, ...updates, updatedAt: new Date() } : board
          ),
        })),

      deleteBoard: (id) =>
        set((state) => {
          // Delete all tasks in this board
          const boardTaskIds = state.tasks
            .filter((task) => {
              const board = state.boards.find((b) => b.id === id);
              return board?.columns.some((col) => col.id === task.status);
            })
            .map((t) => t.id);

          return {
            boards: state.boards.filter((board) => board.id !== id),
            tasks: state.tasks.filter((task) => !boardTaskIds.includes(task.id)),
            currentBoardId: state.currentBoardId === id ? null : state.currentBoardId,
          };
        }),

      setCurrentBoard: (id) => set({ currentBoardId: id }),

      duplicateBoard: (id) => {
        const state = get();
        const board = state.boards.find((b) => b.id === id);
        if (!board) return;

        const newBoardId = nanoid();
        const columnMapping = new Map<string, string>();

        // Create new columns with new IDs
        const newColumns = board.columns.map((col) => {
          const newColId = nanoid();
          columnMapping.set(col.id, newColId);
          return { ...col, id: newColId };
        });

        const newBoard: Board = {
          ...board,
          id: newBoardId,
          name: `${board.name} (Copy)`,
          columns: newColumns,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Duplicate tasks
        const boardTasks = state.tasks.filter((task) =>
          board.columns.some((col) => col.id === task.status)
        );

        const newTasks = boardTasks.map((task) => ({
          ...task,
          id: nanoid(),
          status: columnMapping.get(task.status) || task.status,
          createdAt: new Date(),
        }));

        set((state) => ({
          boards: [...state.boards, newBoard],
          tasks: [...state.tasks, ...newTasks],
        }));
      },

      // Member operations
      addMember: (boardId, member) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  members: [
                    ...board.members,
                    {
                      ...member,
                      id: nanoid(),
                      joinedAt: new Date(),
                    },
                  ],
                  updatedAt: new Date(),
                }
              : board
          ),
        })),

      updateMember: (boardId, memberId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  members: board.members.map((member) =>
                    member.id === memberId ? { ...member, ...updates } : member
                  ),
                  updatedAt: new Date(),
                }
              : board
          ),
        })),

      removeMember: (boardId, memberId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  members: board.members.filter((member) => member.id !== memberId),
                  updatedAt: new Date(),
                }
              : board
          ),
          // Unassign tasks from this member
          tasks: state.tasks.map((task) => ({
            ...task,
            assignedTo: task.assignedTo?.filter((id) => id !== memberId),
          })),
        })),

      // Task operations
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: nanoid(),
              createdAt: new Date(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      duplicateTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          return {
            tasks: [
              ...state.tasks,
              {
                ...task,
                id: nanoid(),
                title: `${task.title} (Copy)`,
                createdAt: new Date(),
              },
            ],
          };
        }),

      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
        })),

      assignTask: (taskId, memberIds) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, assignedTo: memberIds } : task
          ),
        })),

      // Column operations
      addColumn: (boardId, column) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: [
                    ...board.columns,
                    {
                      ...column,
                      id: nanoid(),
                    },
                  ],
                  updatedAt: new Date(),
                }
              : board
          ),
        })),

      updateColumn: (boardId, columnId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((col) =>
                    col.id === columnId ? { ...col, ...updates } : col
                  ),
                  updatedAt: new Date(),
                }
              : board
          ),
        })),

      deleteColumn: (boardId, columnId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.filter((col) => col.id !== columnId),
                  updatedAt: new Date(),
                }
              : board
          ),
          // Delete tasks in this column
          tasks: state.tasks.filter((task) => task.status !== columnId),
        })),

      reorderColumns: (boardId, columns) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, columns, updatedAt: new Date() }
              : board
          ),
        })),

      // Helpers
      getCurrentBoard: () => {
        const state = get();
        return state.boards.find((b) => b.id === state.currentBoardId) || null;
      },

      getBoardTasks: (boardId) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return [];

        return state.tasks.filter((task) =>
          board.columns.some((col) => col.id === task.status)
        );
      },
    }),
    {
      name: 'kanban-storage',
    }
  )
);