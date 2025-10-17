'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, Edit, Users, Bell, Paperclip, Smile, Send, X, Mail, Phone, Video, Image, File, Link2, ChevronLeft, Menu } from 'lucide-react';

// Dữ liệu mẫu
const conversations = [
  {
    id: 1,
    name: 'Project Alpha Team',
    avatar: 'https://i.pravatar.cc/150?img=20',
    lastMessage: "Let's finalize the sprint goals",
    time: '10:30 AM',
    unread: 3,
    type: 'group',
    members: 8,
    description: 'Team working on Project Alpha'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: "I've reviewed the design mockups",
    time: '9:15 AM',
    unread: 0,
    type: 'direct',
    email: 'sarah.chen@example.com',
    phone: '+1 234 567 8900'
  },
  {
    id: 3,
    name: 'Marketing Team',
    avatar: 'https://i.pravatar.cc/150?img=21',
    lastMessage: 'New campaign analytics ready',
    time: 'Yesterday',
    unread: 1,
    type: 'group',
    members: 12,
    description: 'Marketing and campaign team'
  },
  {
    id: 4,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Can we schedule a quick call?',
    time: 'Yesterday',
    unread: 0,
    type: 'direct',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901'
  },
  {
    id: 5,
    name: 'Design Feedback',
    avatar: 'https://i.pravatar.cc/150?img=22',
    lastMessage: 'Got it. Will implement changes',
    time: '2 days ago',
    unread: 0,
    type: 'group',
    members: 5,
    description: 'Design review and feedback'
  }
];

const onlineUsers = [
  { id: 1, name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online' },
  { id: 2, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=12', status: 'online' },
  { id: 3, name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?img=9', status: 'away' },
  { id: 4, name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=13', status: 'online' }
];

const messages = [
  {
    id: 1,
    sender: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Hey team! Have we decided on the final color scheme?',
    time: '10:25 AM',
    isOwn: false
  },
  {
    id: 2,
    sender: 'You',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Yes, we went with the blue gradient theme. I sent the mockups yesterday.',
    time: '10:27 AM',
    isOwn: true
  },
  {
    id: 3,
    sender: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=12',
    content: 'Looks great! When can we start implementation?',
    time: '10:28 AM',
    isOwn: false
  },
  {
    id: 4,
    sender: 'You',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: "Let's aim for Monday. I'll prepare the design system documentation over the weekend.",
    time: '10:30 AM',
    isOwn: true
  }
];

const groupMembers = [
  { id: 1, name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Admin', status: 'online' },
  { id: 2, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=12', role: 'Member', status: 'online' },
  { id: 3, name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?img=9', role: 'Member', status: 'away' },
  { id: 4, name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=13', role: 'Member', status: 'online' },
  { id: 5, name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=45', role: 'Member', status: 'offline' },
  { id: 6, name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=33', role: 'Member', status: 'online' },
  { id: 7, name: 'Lisa Park', avatar: 'https://i.pravatar.cc/150?img=47', role: 'Member', status: 'away' },
  { id: 8, name: 'Tom Harris', avatar: 'https://i.pravatar.cc/150?img=52', role: 'Member', status: 'offline' }
];

const sharedMedia = [
  { id: 1, type: 'image', url: 'https://picsum.photos/200/200?random=1', name: 'design_mockup.png' },
  { id: 2, type: 'image', url: 'https://picsum.photos/200/200?random=2', name: 'screenshot.jpg' },
  { id: 3, type: 'file', name: 'project_brief.pdf', size: '2.4 MB' },
  { id: 4, type: 'image', url: 'https://picsum.photos/200/200?random=3', name: 'wireframe.png' },
  { id: 5, type: 'file', name: 'requirements.docx', size: '1.8 MB' },
  { id: 6, type: 'link', url: 'https://figma.com/...', name: 'Figma Design File' }
];

export default function GroupChatApp() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && conv.unread > 0;
    if (activeTab === 'groups') return matchesSearch && conv.type === 'group';
    return matchesSearch;
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending:', messageInput);
      setMessageInput('');
    }
  };

  const handleConversationSelect = (conv: any) => {
    setSelectedConversation(conv);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar trái */}
      <div className={`${showSidebar ? 'w-full lg:w-80' : 'hidden lg:block lg:w-80'} bg-white border-r flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-3 lg:p-4 border-b">
          <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-full pl-9 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <Search className="absolute left-2.5 lg:left-3 top-2 lg:top-2.5 text-gray-400" size={16} />
            </div>
            <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal size={18} className="text-gray-600" />
            </button>
            <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg">
              <Edit size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-orange-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'unread'
                  ? 'bg-orange-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chưa đọc
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'groups'
                  ? 'bg-orange-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nhóm
            </button>
          </div>
        </div>

        {/* Danh sách cuộc trò chuyện */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleConversationSelect(conv)}
              className={`w-full p-3 lg:p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b ${
                selectedConversation.id === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                {conv.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {conv.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm truncate pr-2">{conv.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
                </div>
                <p className="text-xs lg:text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Users Online - Ẩn trên mobile */}
        <div className="hidden lg:block border-t p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Users Online</h3>
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                  {user.status === 'away' && (
                    <span className="text-xs text-orange-500 font-medium">Away</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Khu vực chat chính */}
      <div className={`${!showSidebar ? 'flex' : 'hidden lg:flex'} flex-1 flex-col min-w-0`}>
        {/* Header chat */}
        <div className="bg-white border-b p-3 lg:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setShowDetailPanel(!showDetailPanel)}
              className="flex items-center gap-2 lg:gap-3 hover:bg-gray-50 rounded-lg p-1 lg:p-2 transition-colors min-w-0 flex-1 lg:flex-none"
            >
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.name}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="text-left min-w-0">
                <h2 className="font-bold text-sm lg:text-lg truncate">{selectedConversation.name}</h2>
                <p className="text-xs lg:text-sm text-gray-500 truncate">
                  {selectedConversation.type === 'group' 
                    ? `${selectedConversation.members} thành viên` 
                    : 'Đang hoạt động'}
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1 lg:gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block" title="Video call">
              <Video size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block" title="Voice call">
              <Phone size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Tìm kiếm">
              <Search size={18} className="text-gray-600" />
            </button>
            <button
              onClick={() => setShowDetailPanel(!showDetailPanel)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Chi tiết"
            >
              <Menu size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Khu vực tin nhắn */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 lg:gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
            >
              <img
                src={message.avatar}
                alt={message.sender}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex-shrink-0 object-cover"
              />
              <div className={`flex flex-col ${message.isOwn ? 'items-end' : ''} max-w-[75%] lg:max-w-md`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs lg:text-sm font-semibold text-gray-700">{message.sender}</span>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <div
                  className={`px-3 lg:px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? 'bg-orange-500 text-white rounded-tr-sm'
                      : 'bg-gray-200 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  <p className="text-xs lg:text-sm break-words">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input tin nhắn */}
        <div className="bg-white border-t p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <Paperclip size={18} className="text-gray-600" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 lg:px-4 py-2 lg:py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 hidden sm:block">
              <Smile size={18} className="text-gray-600" />
            </button>
            <button
              onClick={handleSendMessage}
              className="p-2 lg:p-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex-shrink-0"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Panel chi tiết bên phải */}
      {showDetailPanel && (
        <div className="fixed lg:relative inset-0 lg:inset-auto w-full lg:w-80 xl:w-96 bg-white lg:border-l z-50 lg:z-0 overflow-y-auto">
          <div className="sticky z-10 top-0 bg-white border-b p-4 flex items-center justify-between">
            <h3 className="font-bold text-lg">Chi tiết</h3>
            <button
              onClick={() => setShowDetailPanel(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            {/* Thông tin chính */}
            <div className="text-center mb-6">
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="font-bold text-xl mb-1">{selectedConversation.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedConversation.type === 'group' 
                  ? selectedConversation.description 
                  : selectedConversation.email}
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <span className="text-xs text-gray-600">Call</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Video size={20} className="text-green-600" />
                </div>
                <span className="text-xs text-gray-600">Video</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">Email</span>
              </button>
            </div>

            {/* Thành viên nhóm */}
            {selectedConversation.type === 'group' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Thành viên ({groupMembers.length})</h4>
                  <button className="text-blue-600 text-sm hover:underline">Xem tất cả</button>
                </div>
                <div className="space-y-2">
                  {groupMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-green-500' : 
                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media & Files */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">File & Phương tiện</h4>
                <button className="text-blue-600 text-sm hover:underline">Xem tất cả</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sharedMedia.filter(m => m.type === 'image').slice(0, 6).map((media) => (
                  <div key={media.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={media.url}
                      alt={media.name}
                      className="w-full h-full object-cover hover:opacity-75 cursor-pointer transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Files */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Files</h4>
              <div className="space-y-2">
                {sharedMedia.filter(m => m.type === 'file').map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <File size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Links</h4>
              <div className="space-y-2">
                {sharedMedia.filter(m => m.type === 'link').map((link) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Link2 size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{link.name}</p>
                      <p className="text-xs text-gray-500 truncate">{link.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left">
                <Bell size={18} className="text-gray-600" />
                <span className="text-sm">Tắt thông báo</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left">
                <Search size={18} className="text-gray-600" />
                <span className="text-sm">Tìm kiếm trong cuộc trò chuyện</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg text-left text-red-600">
                <X size={18} />
                <span className="text-sm">Rời khỏi nhóm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}