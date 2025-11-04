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
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Paperclip,
  Star,
  Filter,
  Search,
  RefreshCw
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
  messages: Array<{
    sender: string;
    senderName: string;
    message: string;
    timestamp: string;
  }>;
  assignedTo?: {
    name: string;
    email: string;
  };
}

const VendorSupport: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const categories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'account', label: 'Account Management' },
    { value: 'business_listing', label: 'Business Listing' },
    { value: 'feature_request', label: 'Feature Request' },
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

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";
      const response = await fetch(`${BASE_URL}/tickets/user/${user?._id}`);
      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
      } else {
        toast.error("Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchTickets();
    }
  }, [user]);

  // Create new ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title || !newTicket.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";
      const response = await fetch(`${BASE_URL}/tickets/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTicket,
          userId: user?._id,
          userModel: 'Vendor',
          userEmail: user?.email,
          userName: user?.name
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Ticket created successfully!");
        setIsCreateModalOpen(false);
        setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
        fetchTickets();
      } else {
        toast.error(data.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  };

  // Add message to ticket
  const handleSendMessage = async (ticketId: string) => {
    if (!newMessage.trim()) return;

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";
      const response = await fetch(`${BASE_URL}/tickets/message/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          senderId: user?._id,
          senderModel: 'Vendor',
          senderName: user?.name
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewMessage('');
        fetchTickets();
        // Update selected ticket
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
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Support Center</h1>
            <p className="text-blue-100">Get help with your account and business listings</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue and we'll help you resolve it quickly.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Provide detailed information about your issue"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Ticket</Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchTickets}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Tickets ({filteredTickets.length})</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-500 mb-4">You haven't created any support tickets yet.</p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map(ticket => (
              <Card 
                key={ticket._id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTicket?._id === ticket._id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{ticket.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">#{ticket.ticketId}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`${getStatusColor(ticket.status)} text-white text-xs flex items-center gap-1`}>
                        {ticket.status === 'open' && <Clock className="h-3 w-3" />}
                        {ticket.status === 'in_progress' && <RefreshCw className="h-3 w-3 animate-spin" />}
                        {ticket.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
                        {ticket.status === 'closed' && <CheckCircle className="h-3 w-3" />}
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Category: {ticket.category.replace('_', ' ')}</span>
                    <span>{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {ticket.messages.length > 1 && (
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {ticket.messages.length - 1} replies
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Ticket Details */}
        <div className="lg:sticky lg:top-6">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.title}</CardTitle>
                    <p className="text-sm text-gray-500">#{selectedTicket.ticketId}</p>
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
                {/* Messages */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      message.senderName === user?.name 
                        ? 'bg-blue-50 ml-4' 
                        : 'bg-gray-50 mr-4'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{message.senderName}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
                
                {/* Reply Form */}
                {selectedTicket.status !== 'closed' && (
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => handleSendMessage(selectedTicket._id)}
                        disabled={!newMessage.trim()}
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {selectedTicket.status === 'closed' && (
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">This ticket has been closed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
                <p className="text-gray-500">Choose a ticket from the list to view details and messages.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorSupport;