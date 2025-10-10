'use client';

import { useKanbanStore } from '../stores/kanban-store';
import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

export function BoardSelector() {
  const { boards, currentBoardId, setCurrentBoard, getCurrentBoard } = useKanbanStore();
  const currentBoard = getCurrentBoard();
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
          <div className={`w-3 h-3 rounded-full bg-${currentBoard?.color || 'blue'}-500`} />
          <span className="font-semibold">{currentBoard?.name || 'Select Board'}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white border rounded-lg shadow-lg p-2 w-64 z-50"
          sideOffset={5}
        >
          <div className="mb-2 px-2 py-1 text-xs text-gray-500 font-semibold">
            YOUR BOARDS
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => {
                  setCurrentBoard(board.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                  board.id === currentBoardId ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-${board.color}-500 flex-shrink-0`} />
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{board.name}</div>
                  <div className="text-xs text-gray-500">
                    {board.members.length} members
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t mt-2 pt-2">
            <button
              onClick={() => {
                setOpen(false);
                // Trigger create board modal
                window.dispatchEvent(new CustomEvent('open-create-board-modal'));
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors text-sm"
            >
              <Plus size={16} />
              Create New Board
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}