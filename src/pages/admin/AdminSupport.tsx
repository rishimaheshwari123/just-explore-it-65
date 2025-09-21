import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  BarChart3,
  Users,
  TrendingUp,
  Star,
  FileText,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

interface Ticket {
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  userModel: string;
  messages: Array<{
    sender: string;
    senderName: string;
    senderModel: string;
    message: string;
    timestamp: string;
  }>;
  assignedTo?: {
    name: string;
    email: string;
  };
  rating?: {
    score: number;
    feedback: string;
  };
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  categoryBreakdown: Array<{ _id: string; count: number }>;
  priorityBreakdown: Array<{ _id: string; count: number }>;
  averageRating: number;
}

const AdminSupport: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'account', label: 'Account Management' },
    { value: 'business_listing', label: 'Business Listing' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'general', label: 'General Support' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ];

  const statuses = [
    { value: 'open', label: 'Open', color: 'bg-blue-500' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-500' }
  ];

  // Fetch tickets and stats
  const fetchData = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      
      // Fetch tickets
      const ticketsResponse = await fetch(`${BASE_URL}/tickets/admin/all`);
      const ticketsData = await ticketsResponse.json();
      
      // Fetch stats
      const statsResponse = await fetch(`${BASE_URL}/tickets/admin/stats`);
      const statsData = await statsResponse.json();

      if (ticketsData.success) {
        setTickets(ticketsData.tickets);
      }
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch support data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update ticket status
  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${BASE_URL}/tickets/admin/status/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminId: user?._id,
          internalNote: internalNote || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Ticket updated successfully!");
        setInternalNote('');
        fetchData();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(data.ticket);
        }
      } else {
        toast.error("Failed to update ticket");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    }
  };

  // Add message to ticket
  const handleSendMessage = async (ticketId: string) => {
    if (!newMessage.trim()) return;

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${BASE_URL}/tickets/message/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          senderId: user?._id,
          senderModel: 'Auth',
          senderName: user?.name || 'Admin'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewMessage('');
        fetchData();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(data.ticket);
        }
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-500';
  };

  const getUserTypeIcon = (userModel: string) => {
    switch (userModel) {
      case 'Vendor': return '🏪';
      case 'User': return '👤';
      case 'Auth': return '🛡️';
      default: return '👤';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Support Management</h1>
            <p className="text-red-100">Manage and resolve customer support tickets</p>
          </div>
          <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-red-100">Total Tickets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-200">{stats.open}</div>
              <div className="text-sm text-red-100">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-200">{stats.inProgress}</div>
              <div className="text-sm text-red-100">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-200">{stats.resolved}</div>
              <div className="text-sm text-red-100">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-200">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-red-100">Avg Rating</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map(priority => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="text-sm text-gray-600 flex items-center">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      </div>

      {/* Tickets Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Support Tickets</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-500">No support tickets match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredTickets.map(ticket => (
                <Card 
                  key={ticket._id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTicket?._id === ticket._id ? 'ring-2 ring-red-500' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getUserTypeIcon(ticket.userModel)}</span>
                          <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">#{ticket.ticketId}</p>
                        <p className="text-sm text-gray-600">
                          {ticket.userName} ({ticket.userModel})
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`${getStatusColor(ticket.status)} text-white text-xs flex items-center gap-1`}>
                          {ticket.status === 'open' && <Clock className="h-3 w-3" />}
                          {ticket.status === 'in_progress' && <RefreshCw className="h-3 w-3 animate-spin" />}
                          {ticket.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
                          {ticket.status === 'closed' && <CheckCircle className="h-3 w-3" />}
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs flex items-center gap-1`}>
                          {ticket.priority === 'urgent' && <AlertCircle className="h-3 w-3" />}
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Category: {ticket.category.replace('_', ' ')}</span>
                      <span>{format(new Date(ticket.createdAt), 'MMM dd, HH:mm')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-blue-600">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {ticket.messages.length} messages
                      </div>
                      {ticket.rating && (
                        <div className="flex items-center text-xs text-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          {ticket.rating.score}/5
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Details */}
        <div className="lg:sticky lg:top-6">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-xl">{getUserTypeIcon(selectedTicket.userModel)}</span>
                      {selectedTicket.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">#{selectedTicket.ticketId}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedTicket.userName} ({selectedTicket.userEmail})
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`${getStatusColor(selectedTicket.status)} text-white flex items-center gap-1`}>
                      {selectedTicket.status === 'open' && <Clock className="h-3 w-3" />}
                      {selectedTicket.status === 'in_progress' && <RefreshCw className="h-3 w-3 animate-spin" />}
                      {selectedTicket.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
                      {selectedTicket.status === 'closed' && <CheckCircle className="h-3 w-3" />}
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={`${getPriorityColor(selectedTicket.priority)} text-white flex items-center gap-1`}>
                      {selectedTicket.priority === 'urgent' && <AlertCircle className="h-3 w-3" />}
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status Update */}
                <div className="border rounded-lg p-3 bg-gray-50">
                  <Label className="text-sm font-medium mb-2 block">Update Status</Label>
                  <div className="flex gap-2 mb-2">
                    {statuses.map(status => (
                      <Button
                        key={status.value}
                        size="sm"
                        variant={selectedTicket.status === status.value ? "default" : "outline"}
                        onClick={() => handleUpdateStatus(selectedTicket._id, status.value)}
                        className="text-xs"
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Add internal note (optional)"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>

                {/* Messages */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedTicket.messages.map((message, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      message.senderModel === 'Auth' 
                        ? 'bg-red-50 ml-4' 
                        : 'bg-blue-50 mr-4'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <span>{getUserTypeIcon(message.senderModel)}</span>
                          {message.senderName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
                
                {/* Reply Form */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleSendMessage(selectedTicket._id)}
                      disabled={!newMessage.trim()}
                      className="self-end bg-red-600 hover:bg-red-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rating Display */}
                {selectedTicket.rating && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Customer Rating: {selectedTicket.rating.score}/5</span>
                    </div>
                    {selectedTicket.rating.feedback && (
                      <p className="text-sm text-gray-600">{selectedTicket.rating.feedback}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
                <p className="text-gray-500">Choose a ticket from the list to view details and manage it.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;