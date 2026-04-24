import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, ShieldAlert, Key, Power, Users, AlertTriangle } from 'lucide-react';
import { User, UserCreate, UserUpdate } from '@/types/user';
import { getUsers, createUser, updateUser, deleteUser, activateUser, deactivateUser, changeUserPassword } from '@/services/users';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import UserForm from '@/components/forms/UserForm';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    setError(null);
    try {
      const data = await getUsers({ limit: 1000 });
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError("Could not load users.");
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setError(null);
  };

  const handleSubmit = async (data: UserCreate | UserUpdate) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data as UserUpdate);
      } else {
        await createUser(data as UserCreate);
      }
      handleCloseModal();
      await fetchUsers();
    } catch (err: any) {
      console.error("Failed to save user:", err);
      setError(err.response?.data?.detail || "Failed to save user. Check username/email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        await fetchUsers();
      } catch (err: any) {
        alert(err.response?.data?.detail || "Failed to delete user.");
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.is_active) {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to change user status.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordUser) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      await changeUserPassword(passwordUser.id, newPassword);
      setIsPasswordModalOpen(false);
      setPasswordUser(null);
      setNewPassword('');
      alert('Password updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
    );
  }, [users, searchTerm]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system administrators and managers</p>
          </div>
          <Button onClick={handleOpenCreateModal} variant="primary" icon={Plus} className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25">
            Add New User
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by username or email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200" 
            />
          </div>
        </div>

        {isLoading && <div className="flex items-center justify-center min-h-60"><div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>}
        {error && !isModalOpen && !isPasswordModalOpen && <div className="text-center py-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-red-600 flex items-center justify-center gap-2"><AlertTriangle size={18}/> {error}</div>}

        {!isLoading && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border ${user.is_active ? 'border-gray-100 dark:border-gray-700' : 'border-red-300 dark:border-red-900 opacity-75'} transition-all duration-300 group flex flex-col`}>
                <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-blue-500 to-cyan-600'}`}>
                            <ShieldAlert className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">{user.username}</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'}`}>
                          {user.role.toUpperCase()}
                        </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                        <span className={`text-sm font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-auto">
                    <Button onClick={() => handleOpenEditModal(user)} variant="outline" size="sm" icon={Edit} className="col-span-2 border-gray-300 text-gray-700 hover:bg-gray-50">Edit</Button>
                    <Button onClick={() => { setPasswordUser(user); setIsPasswordModalOpen(true); }} variant="outline" size="sm" className="col-span-1 flex justify-center text-yellow-600 border-yellow-200 hover:bg-yellow-50" title="Change Password"><Key className="w-4 h-4" /></Button>
                    {user.is_active ? (
                      <Button onClick={() => handleToggleStatus(user)} variant="danger" size="sm" className="col-span-1 flex justify-center" title="Deactivate"><Power className="w-4 h-4" /></Button>
                    ) : (
                      <Button onClick={() => handleToggleStatus(user)} variant="outline" size="sm" className="col-span-1 flex justify-center text-green-600 border-green-200 hover:bg-green-50" title="Activate"><Power className="w-4 h-4" /></Button>
                    )}
                </div>
                <div className="mt-2 text-right">
                    <button onClick={() => handleDelete(user.id)} className="text-xs text-red-500 hover:underline">Delete User</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && <div className="text-center py-12"><Users className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3><p className="text-gray-500 dark:text-gray-400">Get started by creating a new user</p></div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'Edit User' : 'Add New User'}>
        <UserForm initialData={editingUser} onSubmit={handleSubmit} onCancel={handleCloseModal} isLoading={isSubmitting} />
        {error && isModalOpen && <div className="mt-4 text-center text-sm text-red-600">{error}</div>}
      </Modal>

      <Modal isOpen={isPasswordModalOpen} onClose={() => { setIsPasswordModalOpen(false); setPasswordUser(null); setError(null); }} title={`Change Password for ${passwordUser?.username}`}>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-gray-900 dark:text-white" />
          </div>
          {error && isPasswordModalOpen && <div className="text-center text-sm text-red-600">{error}</div>}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">{isSubmitting ? 'Updating...' : 'Update Password'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UsersList;
