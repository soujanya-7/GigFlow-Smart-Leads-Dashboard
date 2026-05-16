import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, UserCircle } from 'lucide-react';
import { authApi } from '../api/auth';
import { User } from '../types';
import Header from '../components/layout/Header';
import { TableSkeleton } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/StateViews';

const UsersPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: authApi.getUsers,
  });

  const users: User[] = data?.data || [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  if (error) {
    return (
      <div>
        <Header title="Users" subtitle="Manage team members" />
        <div className="p-6">
          <ErrorState message="Failed to load users" onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Users" subtitle={`${users.length} team members`} />

      <div className="p-6 animate-fade-in">
        <div className="card overflow-hidden">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              {isLoading ? (
                <TableSkeleton rows={5} cols={4} />
              ) : users.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={4} className="p-0">
                      <EmptyState title="No users found" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === 'admin'
                              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <UserCircle className="w-3 h-3" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="text-gray-500 dark:text-gray-400 text-xs">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
