import React, { useState, useEffect } from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  History,
  Share2,
  Lock,
  Unlock,
  User,
  LogOut,
  Settings,
  Calendar,
  FileText,
  Flame,
} from 'lucide-react';

// Mock Auth0 service - Replace with real Auth0 integration
const mockAuth = {
  isAuthenticated: false,
  user: null,
  login: () => {
    mockAuth.isAuthenticated = true;
    mockAuth.user = { name: 'John Doe', email: 'john@example.com' };
  },
  logout: () => {
    mockAuth.isAuthenticated = false;
    mockAuth.user = null;
  },
};

const PastebinService = () => {
  const [currentView, setCurrentView] = useState('create');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [expiration, setExpiration] = useState('never');
  const [language, setLanguage] = useState('text');
  const [pastes, setPastes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPaste, setSelectedPaste] = useState(null);
  const [notification, setNotification] = useState('');

  // Initialize with some sample data
  useEffect(() => {
    const samplePastes = [
      {
        id: '1',
        title: 'Sample Code',
        content: 'console.log("Hello World!");',
        language: 'javascript',
        isPrivate: false,
        burnAfterRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        views: 5,
        expired: false,
      },
      {
        id: '2',
        title: 'Secret Note',
        content: 'This is a private note',
        language: 'text',
        isPrivate: true,
        burnAfterRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        views: 1,
        expired: false,
      },
    ];
    setPastes(samplePastes);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAuth = () => {
    if (isAuthenticated) {
      mockAuth.logout();
      setIsAuthenticated(false);
      setUser(null);
      showNotification('Logged out successfully');
    } else {
      mockAuth.login();
      setIsAuthenticated(true);
      setUser(mockAuth.user);
      showNotification('Logged in successfully');
    }
  };

  const createPaste = () => {
    if (!content.trim()) {
      showNotification('Please enter some content');
      return;
    }

    const newPaste = {
      id: Date.now().toString(),
      title: title || 'Untitled',
      content,
      language,
      isPrivate,
      burnAfterRead,
      expiration,
      createdAt: new Date().toISOString(),
      views: 0,
      expired: false,
      author: isAuthenticated ? user.email : 'anonymous',
    };

    setPastes((prev) => [newPaste, ...prev]);

    // Clear form
    setContent('');
    setTitle('');
    setIsPrivate(false);
    setBurnAfterRead(false);
    setExpiration('never');
    setLanguage('text');

    showNotification('Paste created successfully!');
    setCurrentView('history');
  };

  const viewPaste = (paste) => {
    if (paste.expired) {
      showNotification('This paste has expired');
      return;
    }

    // Increment view count
    setPastes((prev) =>
      prev.map((p) => (p.id === paste.id ? { ...p, views: p.views + 1 } : p))
    );

    // Handle burn after read
    if (paste.burnAfterRead && paste.views > 0) {
      setPastes((prev) =>
        prev.map((p) => (p.id === paste.id ? { ...p, expired: true } : p))
      );
      showNotification('This paste has been burned after reading');
    }

    setSelectedPaste(paste);
    setCurrentView('view');
  };

  const deletePaste = (pasteId) => {
    setPastes((prev) => prev.filter((p) => p.id !== pasteId));
    showNotification('Paste deleted');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!');
    } catch (err) {
      showNotification('Failed to copy to clipboard');
    }
  };

  const clearClipboard = async () => {
    try {
      await navigator.clipboard.writeText('');
      showNotification('Clipboard cleared!');
    } catch (err) {
      showNotification('Could not clear clipboard');
    }
  };

  const shareUrl = (pasteId) => {
    const url = `${window.location.origin}/paste/${pasteId}`;
    copyToClipboard(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const CreateView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Paste
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter paste title..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text">Plain Text</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration
              </label>
              <select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="never">Never</option>
                <option value="10min">10 Minutes</option>
                <option value="1hour">1 Hour</option>
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Private</span>
                  {isPrivate ? (
                    <Lock size={16} className="ml-1 text-gray-500" />
                  ) : (
                    <Unlock size={16} className="ml-1 text-gray-500" />
                  )}
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={burnAfterRead}
                    onChange={(e) => setBurnAfterRead(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Burn after read</span>
                  <Flame size={16} className="ml-1 text-red-500" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Paste your content here..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={createPaste}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Paste
            </button>

            <button
              onClick={clearClipboard}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={20} />
              Clear Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Paste History</h2>

        {pastes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No pastes yet. Create your first paste!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastes.map((paste) => (
              <div
                key={paste.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  paste.expired ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {paste.title}
                      </h3>
                      {paste.isPrivate && (
                        <Lock size={16} className="text-gray-500" />
                      )}
                      {paste.burnAfterRead && (
                        <Flame size={16} className="text-red-500" />
                      )}
                      {paste.expired && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          EXPIRED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(paste.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {paste.views} views
                      </span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                        {paste.language}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm truncate">
                      {paste.content.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => viewPaste(paste)}
                      disabled={paste.expired}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => shareUrl(paste.id)}
                      disabled={paste.isPrivate || paste.expired}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Share"
                    >
                      <Share2 size={16} />
                    </button>

                    <button
                      onClick={() => deletePaste(paste.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const PasteView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedPaste.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(selectedPaste.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {selectedPaste.views} views
              </span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                {selectedPaste.language}
              </span>
              {selectedPaste.isPrivate && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Lock size={14} />
                  Private
                </span>
              )}
              {selectedPaste.burnAfterRead && (
                <span className="flex items-center gap-1 text-red-600">
                  <Flame size={14} />
                  Burn after read
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(selectedPaste.content)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Copy size={16} />
              Copy
            </button>

            <button
              onClick={() => setCurrentView('history')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {selectedPaste.content}
          </pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-800">PasteBin</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('create')}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    currentView === 'create'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Plus size={18} />
                  Create
                </button>

                <button
                  onClick={() => setCurrentView('history')}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    currentView === 'history'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <History size={18} />
                  History
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  {user.name}
                </div>
              )}

              <button
                onClick={handleAuth}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  isAuthenticated
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <LogOut size={18} />
                    Logout
                  </>
                ) : (
                  <>
                    <User size={18} />
                    Login
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 notification">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="py-6">
        {currentView === 'create' && <CreateView />}
        {currentView === 'history' && <HistoryView />}
        {currentView === 'view' && selectedPaste && <PasteView />}
      </main>
    </div>
  );
};

export default PastebinService;
