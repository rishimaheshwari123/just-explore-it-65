import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SubscriptionLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  planType: 'monthly' | 'yearly' | 'lifetime';
  amount: number;
  currency: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  paymentMethod: string;
  transactionId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  features: string[];
}

const SubscriptionLogs = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Dummy subscription data
  const dummySubscriptions: SubscriptionLog[] = [
    {
      id: 'sub_001',
      userId: 'user_001',
      userName: 'Rajesh Kumar',
      userEmail: 'rajesh@example.com',
      planName: 'Premium Business',
      planType: 'monthly',
      amount: 2999,
      currency: 'INR',
      status: 'active',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_abc123',
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-02-15T00:00:00Z',
      createdAt: '2024-01-15T10:30:00Z',
      features: ['Unlimited Listings', 'Priority Support', 'Analytics Dashboard', 'Custom Branding']
    },
    {
      id: 'sub_002',
      userId: 'user_002',
      userName: 'Priya Sharma',
      userEmail: 'priya@example.com',
      planName: 'Standard',
      planType: 'yearly',
      amount: 19999,
      currency: 'INR',
      status: 'active',
      paymentMethod: 'UPI',
      transactionId: 'txn_def456',
      startDate: '2024-01-10T00:00:00Z',
      endDate: '2025-01-10T00:00:00Z',
      createdAt: '2024-01-10T14:20:00Z',
      features: ['50 Listings', 'Email Support', 'Basic Analytics']
    },
    {
      id: 'sub_003',
      userId: 'user_003',
      userName: 'Amit Patel',
      userEmail: 'amit@example.com',
      planName: 'Enterprise',
      planType: 'yearly',
      amount: 49999,
      currency: 'INR',
      status: 'expired',
      paymentMethod: 'Net Banking',
      transactionId: 'txn_ghi789',
      startDate: '2023-01-05T00:00:00Z',
      endDate: '2024-01-05T00:00:00Z',
      createdAt: '2023-01-05T09:15:00Z',
      features: ['Unlimited Listings', '24/7 Support', 'Advanced Analytics', 'API Access', 'White Label']
    },
    {
      id: 'sub_004',
      userId: 'user_004',
      userName: 'Sunita Gupta',
      userEmail: 'sunita@example.com',
      planName: 'Basic',
      planType: 'monthly',
      amount: 999,
      currency: 'INR',
      status: 'cancelled',
      paymentMethod: 'Debit Card',
      transactionId: 'txn_jkl012',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-02-01T00:00:00Z',
      createdAt: '2024-01-01T16:45:00Z',
      features: ['10 Listings', 'Basic Support']
    },
    {
      id: 'sub_005',
      userId: 'user_005',
      userName: 'Vikash Singh',
      userEmail: 'vikash@example.com',
      planName: 'Premium Business',
      planType: 'monthly',
      amount: 2999,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'Wallet',
      transactionId: 'txn_mno345',
      startDate: '2024-01-20T00:00:00Z',
      endDate: '2024-02-20T00:00:00Z',
      createdAt: '2024-01-20T11:30:00Z',
      features: ['Unlimited Listings', 'Priority Support', 'Analytics Dashboard', 'Custom Branding']
    },
    {
      id: 'sub_006',
      userId: 'user_006',
      userName: 'Neha Agarwal',
      userEmail: 'neha@example.com',
      planName: 'Lifetime Pro',
      planType: 'lifetime',
      amount: 99999,
      currency: 'INR',
      status: 'active',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_pqr678',
      startDate: '2024-01-12T00:00:00Z',
      endDate: '2099-12-31T00:00:00Z',
      createdAt: '2024-01-12T13:20:00Z',
      features: ['Unlimited Everything', 'Lifetime Updates', 'Premium Support', 'All Features']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubscriptions(dummySubscriptions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesPlan = planFilter === 'all' || sub.planType === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />;
      case 'expired':
        return <XCircle className="h-3 w-3" />;
      case 'cancelled':
        return <AlertCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Subscription Logs Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 32);
    doc.text(`Total Subscriptions: ${filteredSubscriptions.length}`, 14, 40);

    const tableData = filteredSubscriptions.map(sub => [
      sub.userName,
      sub.planName,
      sub.planType,
      `₹${sub.amount}`,
      sub.status.toUpperCase(),
      format(new Date(sub.createdAt), 'PP'),
    ]);

    autoTable(doc, {
      head: [['User', 'Plan', 'Type', 'Amount', 'Status', 'Date']],
      body: tableData,
      startY: 50,
    });

    doc.save('subscription-logs.pdf');
    toast.success('Subscription logs exported successfully');
  };

  // Calculate stats
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const monthlyRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.createdAt);
      const now = new Date();
      return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Logs</h1>
          <p className="text-gray-600 mt-1">Track all subscription activities and payments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">₹{monthlyRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by user, plan, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Logs ({filteredSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {subscription.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{subscription.userName}</p>
                          <p className="text-sm text-gray-500">{subscription.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{subscription.planName}</p>
                        <Badge variant="outline" className="mt-1">
                          {subscription.planType.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">
                          ₹{subscription.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">{subscription.currency}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(subscription.status)}>
                        {getStatusIcon(subscription.status)}
                        <span className="ml-1">{subscription.status.toUpperCase()}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        {subscription.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {subscription.transactionId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(subscription.startDate), 'PP')}</p>
                        <p className="text-gray-500">to</p>
                        <p>{format(new Date(subscription.endDate), 'PP')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {format(new Date(subscription.createdAt), 'PP')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionLogs;