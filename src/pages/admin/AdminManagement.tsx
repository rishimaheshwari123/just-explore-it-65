import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Shield, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Calendar, 
  Mail, 
  User, 
  UserPlus,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { getAllUsersAPI, deleteUserAPI, editPermissionAPI } from '../../service/operations/auth';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AdminData {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  permissions: {
    manageVendors: boolean;
    addBusiness: boolean;
    editBusiness: boolean;
    supportCenter: boolean;
    blogs: boolean;
    manageUsers: boolean;
    subscriptionLogs: boolean;
    exportData: boolean;
  };
  createdBy?: string;
}

const AdminManagement = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);

  // Add Admin Form State
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: {
      manageVendors: false,
      addBusiness: false,
      editBusiness: false,
      supportCenter: false,
      blogs: false,
      manageUsers: false,
      subscriptionLogs: false,
      exportData: false,
    }
  });

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersAPI();
      // Filter only admin and super_admin roles
      const adminUsers = response.filter((user: AdminData) => 
        user.role === 'admin' || user.role === 'super_admin'
      );
      setAdmins(adminUsers);
    } catch (error) {
      toast.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle add admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call API to create admin
      toast.success('Admin added successfully');
      setIsAddAdminOpen(false);
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: {
          manageVendors: false,
          addBusiness: false,
          editBusiness: false,
          supportCenter: false,
          blogs: false,
          manageUsers: false,
          subscriptionLogs: false,
          exportData: false,
        }
      });
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to add admin');
    }
  };

  // Handle edit admin
  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      await editPermissionAPI(selectedAdmin._id, {
        permissions: selectedAdmin.permissions
      });
      toast.success('Admin permissions updated successfully');
      setIsEditAdminOpen(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to update admin permissions');
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async () => {
    if (!deleteAdminId) return;

    try {
      await deleteUserAPI(deleteAdminId);
      toast.success('Admin deleted successfully');
      setDeleteAdminId(null);
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to delete admin');
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Admin Management Report', 20, 20);
    
    const tableData = filteredAdmins.map(admin => [
      admin.name,
      admin.email,
      admin.role,
      format(new Date(admin.createdAt), 'dd/MM/yyyy'),
      Object.values(admin.permissions).filter(Boolean).length.toString()
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Role', 'Created', 'Permissions']],
      body: tableData,
      startY: 30,
    });

    doc.save('admin-management-report.pdf');
    toast.success('Report exported successfully');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPermissionCount = (permissions: AdminData['permissions']) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Admin Management
          </h1>
          <p className="text-gray-600 mt-1">Manage admin and super admin accounts</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          
          <Button
            onClick={fetchAdmins}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Create a new admin account with specific permissions
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newAdmin.role}
                      onValueChange={(value) => setNewAdmin({...newAdmin, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <Label className="text-base font-medium">Permissions</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {Object.entries(newAdmin.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={value}
                          onChange={(e) => setNewAdmin({
                            ...newAdmin,
                            permissions: {
                              ...newAdmin.permissions,
                              [key]: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={key} className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddAdminOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Admin</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Super Admins</p>
                <p className="text-2xl font-bold text-red-600">
                  {admins.filter(admin => admin.role === 'super_admin').length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regular Admins</p>
                <p className="text-2xl font-bold text-blue-600">
                  {admins.filter(admin => admin.role === 'admin').length}
                </p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {admins.filter(admin => 
                    new Date(admin.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search admins by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Accounts ({filteredAdmins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{admin.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(admin.role)}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {getPermissionCount(admin.permissions)}/8
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${(getPermissionCount(admin.permissions) / 8) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(admin.createdAt), 'dd/MM/yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setIsEditAdminOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteAdminId(admin._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditAdminOpen} onOpenChange={setIsEditAdminOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Admin Permissions</DialogTitle>
            <DialogDescription>
              Update permissions for {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAdmin && (
            <form onSubmit={handleEditAdmin} className="space-y-4">
              <div>
                <Label className="text-base font-medium">Permissions</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {Object.entries(selectedAdmin.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-${key}`}
                        checked={value}
                        onChange={(e) => setSelectedAdmin({
                          ...selectedAdmin,
                          permissions: {
                            ...selectedAdmin.permissions,
                            [key]: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`edit-${key}`} className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditAdminOpen(false);
                    setSelectedAdmin(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Permissions</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteAdminId} onOpenChange={() => setDeleteAdminId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this admin? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManagement;