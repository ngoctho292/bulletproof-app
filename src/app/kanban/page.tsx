import { KanbanBoard } from '@/features/kanban/components/kanban-board';

export default function KanbanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kanban Board</h1>
        <p className="text-gray-600">
          Drag and drop tasks between columns to update their status
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}