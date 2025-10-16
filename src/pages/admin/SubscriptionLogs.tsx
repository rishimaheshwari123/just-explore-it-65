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
  _id: string;
  business: {
    _id: string;
    businessName: string;
    category: string;
  };
  vendor: {
    _id: string;
    name: string;
    email: string;
  };
  plan: {
    _id: string;
    name: string;
    price: number;
  };
  action: 'purchased' | 'renewed' | 'cancelled' | 'expired' | 'upgraded' | 'downgraded';
  amount: number;
  paymentDetails: {
    transactionId: string;
    paymentMethod: string;
    paymentDate: string;
    paymentStatus: 'completed' | 'pending' | 'failed';
    // Added fields for GST breakdown
    amount?: number;
    currency?: string;
    taxRate?: number;
    taxAmount?: number;
    subtotal?: number;
  };
  metadata: {
    userAgent: string;
    ipAddress: string;
    source: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const SubscriptionLogs = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const fetchSubscriptionLogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`https://server.businessgurujee.com/api/v1/subscription/logs?page=${page}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setSubscriptions(data.data.logs);
        setPagination(data.data.pagination);
      } else {
        toast.error('Failed to fetch subscription logs');
      }
    } catch (error) {
      console.error('Error fetching subscription logs:', error);
      toast.error('Error fetching subscription logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionLogs();
  }, []);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.business?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.vendor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.paymentDetails?.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.action === statusFilter;
    const matchesPlan = planFilter === 'all' || sub.plan?.name?.toLowerCase().includes(planFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Get status badge color
  const getStatusBadgeColor = (action: string) => {
    switch (action) {
      case 'purchased':
        return 'bg-green-100 text-green-800';
      case 'renewed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'upgraded':
        return 'bg-purple-100 text-purple-800';
      case 'downgraded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (action: string) => {
    switch (action) {
      case 'purchased':
        return <CheckCircle className="h-3 w-3" />;
      case 'renewed':
        return <RefreshCw className="h-3 w-3" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3" />;
      case 'expired':
        return <AlertCircle className="h-3 w-3" />;
      case 'upgraded':
        return <TrendingUp className="h-3 w-3" />;
      case 'downgraded':
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
      sub.business?.businessName || 'N/A',
      sub.plan?.name || 'N/A',
      sub.action,
      `₹${sub.amount}`,
      sub.paymentDetails?.paymentStatus?.toUpperCase() || 'N/A',
      format(new Date(sub.createdAt), 'PP'),
    ]);

    autoTable(doc, {
      head: [['Business', 'Plan', 'Action', 'Amount', 'Payment Status', 'Date']],
      body: tableData,
      startY: 50,
    });

    doc.save('subscription-logs.pdf');
    toast.success('Subscription logs exported successfully');
  };

  // Calculate stats
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.action === 'purchased').length;
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
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="purchased">Purchased</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="upgraded">Upgraded</SelectItem>
                <SelectItem value="downgraded">Downgraded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
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
                  <TableHead>Business & Vendor</TableHead>
                  <TableHead>Plan Details</TableHead>
                  <TableHead>Amount (incl. GST)</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {subscription.business?.businessName?.charAt(0)?.toUpperCase() || 'B'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{subscription.business?.businessName || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{subscription.vendor?.name || 'N/A'} ({subscription.vendor?.email || 'N/A'})</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{subscription.plan?.name || 'N/A'}</p>
                        <Badge variant="outline" className="mt-1">
                          {subscription.business?.category || 'General'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-800">₹{(subscription.paymentDetails?.subtotal ?? subscription.amount)?.toLocaleString?.() ?? subscription.paymentDetails?.subtotal ?? subscription.amount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">GST (18%)</span>
                          <span className="text-gray-800">₹{(subscription.paymentDetails?.taxAmount ?? ((subscription.paymentDetails?.subtotal ?? subscription.amount) * 0.18))?.toLocaleString?.() ?? (subscription.paymentDetails?.taxAmount ?? ((subscription.paymentDetails?.subtotal ?? subscription.amount) * 0.18)).toFixed?.(2) ?? (subscription.paymentDetails?.taxAmount ?? ((subscription.paymentDetails?.subtotal ?? subscription.amount) * 0.18))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">Total</span>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-900">₹{subscription.amount?.toLocaleString() || 0}</span>
                            <span className="text-xs text-gray-500">INR</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(subscription.action)}>
                        {getStatusIcon(subscription.action)}
                        <span className="ml-1">{subscription.action?.toUpperCase() || 'N/A'}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        {subscription.paymentDetails?.paymentMethod || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {subscription.paymentDetails?.transactionId || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscription.paymentDetails?.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                        {subscription.paymentDetails?.paymentStatus?.toUpperCase() || 'N/A'}
                      </Badge>
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