'use client';

import { useState } from 'react';
import { useKanbanStore } from '../stores/kanban-store';
import { X, Plus, Crown, Shield, User as UserIcon, Mail, Trash2 } from 'lucide-react';

interface BoardMembersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BoardMembersPanel({ isOpen, onClose }: BoardMembersPanelProps) {
  const { getCurrentBoard, addMember, removeMember, updateMember } = useKanbanStore();
  const board = getCurrentBoard();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'member'>('member');

  if (!isOpen || !board) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    addMember(board.id, {
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      role: newMemberRole,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMemberName)}&background=random`,
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('member');
    setShowAddForm(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown size={14} className="text-yellow-500" />;
      case 'admin':
        return <Shield size={14} className="text-blue-500" />;
      default:
        return <UserIcon size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold">Board Members</h2>
            <p className="text-sm text-gray-600">{board.members.length} members</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {board.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{member.name}</span>
                    {getRoleIcon(member.role)}
                    <span className="text-xs text-gray-500 capitalize">{member.role}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Mail size={12} />
                    {member.email}
                  </div>
                </div>

                {member.role !== 'owner' && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${member.name} from board?`)) {
                        removeMember(board.id, member.id);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Member Form */}
          {showAddForm ? (
            <form onSubmit={handleAddMember} className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3">Add New Member</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 border rounded-lg"
                  autoFocus
                />
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as 'admin' | 'member')}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="member">Member - Can create and edit tasks</option>
                  <option value="admin">Admin - Can manage board and members</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
            >
              <Plus size={20} />
              Add Member
            </button>
          )}
        </div>
      </div>
    </div>
  );
}