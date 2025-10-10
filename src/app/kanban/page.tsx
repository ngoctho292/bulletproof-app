'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/features/kanban/components/kanban-board';
import { BoardSelector } from '@/features/kanban/components/board-selector';
import { CreateBoardModal } from '@/features/kanban/components/create-board-modal';
import { BoardMembersPanel } from '@/features/kanban/components/board-members-panel';
import { AssignTaskModal } from '@/features/kanban/components/assign-task-modal';
import { useKanbanStore } from '@/features/kanban/stores/kanban-store';
import { Users, Settings, Copy, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

export default function KanbanPage() {
  const { getCurrentBoard, duplicateBoard, deleteBoard } = useKanbanStore();
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const board = getCurrentBoard();

  useEffect(() => {
    const handleOpenMembers = () => setShowMembersPanel(true);
    window.addEventListener('open-board-members-panel', handleOpenMembers);
    return () => window.removeEventListener('open-board-members-panel', handleOpenMembers);
  }, []);

  const handleDuplicateBoard = () => {
    if (board && confirm(`Duplicate board "${board.name}"?`)) {
      duplicateBoard(board.id);
    }
  };

  const handleDeleteBoard = () => {
    if (board && confirm(`Delete board "${board.name}" and all its tasks?`)) {
      deleteBoard(board.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BoardSelector />
              {board && (
                <div className="text-sm text-gray-600">
                  {board.description}
                </div>
              )}
            </div>

            {board && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMembersPanel(true)}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users size={18} />
                  <span className="text-sm">
                    {board.members.length} {board.members.length === 1 ? 'Member' : 'Members'}
                  </span>
                </button>

                <button
                  onClick={handleDuplicateBoard}
                  className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  title="Duplicate board"
                >
                  <Copy size={18} />
                </button>

                <button
                  onClick={handleDeleteBoard}
                  className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete board"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {board ? (
          <KanbanBoard />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No board selected</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-create-board-modal'))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Board
            </button>
          </div>
        )}
      </div>

      <CreateBoardModal />
      <BoardMembersPanel isOpen={showMembersPanel} onClose={() => setShowMembersPanel(false)} />
      <AssignTaskModal />
    </div>
  );
}