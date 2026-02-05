 import { useEffect, useState } from 'react';
 import { Eye, Plus, Search, MoreHorizontal, User, Mail, Phone, Building2, Calendar } from 'lucide-react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Badge } from '@/components/ui/badge';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { useToast } from '@/hooks/use-toast';
 import { supabase } from '@/integrations/supabase/client';
 
 interface Department {
   id: string;
   name: string;
   description: string | null;
   is_active: boolean;
 }
 
 interface Employee {
   id: string;
   employee_id: string;
   full_name: string;
   email: string | null;
   phone: string | null;
   department_id: string | null;
   designation: string | null;
   join_date: string | null;
   salary: number | null;
   status: string;
   avatar_url: string | null;
   address: string | null;
   emergency_contact: string | null;
   notes: string | null;
   created_at: string;
 }
 
import { getStatusColor } from '@/lib/status-colors';
 
 const AdminEmployees = () => {
   const { toast } = useToast();
   const [activeTab, setActiveTab] = useState('employees');
   const [employees, setEmployees] = useState<Employee[]>([]);
   const [departments, setDepartments] = useState<Department[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [departmentFilter, setDepartmentFilter] = useState('all');
   
   // Employee Dialog
   const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
   const [employeeForm, setEmployeeForm] = useState({
     full_name: '',
     email: '',
     phone: '',
     department_id: '',
     designation: '',
     join_date: '',
     salary: 0,
     address: '',
     emergency_contact: '',
     notes: '',
   });
 
   // Department Dialog
   const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
   const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
   const [departmentForm, setDepartmentForm] = useState({
     name: '',
     description: '',
   });
 
   const fetchEmployees = async () => {
     try {
       const { data, error } = await supabase
         .from('employees')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       setEmployees(data || []);
     } catch (error) {
       console.error('Error fetching employees:', error);
       toast({ title: 'Error', description: 'Failed to load employees', variant: 'destructive' });
     } finally {
       setIsLoading(false);
     }
   };
 
   const fetchDepartments = async () => {
     try {
       const { data, error } = await supabase
         .from('departments')
         .select('*')
         .order('name');
 
       if (error) throw error;
       setDepartments(data || []);
     } catch (error) {
       console.error('Error fetching departments:', error);
     }
   };
 
   useEffect(() => {
     fetchEmployees();
     fetchDepartments();
   }, []);
 
   // Employee functions
   const openCreateEmployeeDialog = () => {
     setSelectedEmployee(null);
     setEmployeeForm({
       full_name: '',
       email: '',
       phone: '',
       department_id: '',
       designation: '',
       join_date: '',
       salary: 0,
       address: '',
       emergency_contact: '',
       notes: '',
     });
     setIsEmployeeDialogOpen(true);
   };
 
   const openEditEmployeeDialog = (employee: Employee) => {
     setSelectedEmployee(employee);
     setEmployeeForm({
       full_name: employee.full_name,
       email: employee.email || '',
       phone: employee.phone || '',
       department_id: employee.department_id || '',
       designation: employee.designation || '',
       join_date: employee.join_date || '',
       salary: employee.salary || 0,
       address: employee.address || '',
       emergency_contact: employee.emergency_contact || '',
       notes: employee.notes || '',
     });
     setIsEmployeeDialogOpen(true);
   };
 
   const handleSaveEmployee = async () => {
     if (!employeeForm.full_name) {
       toast({ title: 'Error', description: 'Employee name is required', variant: 'destructive' });
       return;
     }
 
     try {
       if (selectedEmployee) {
         const { error } = await supabase
           .from('employees')
           .update({
             full_name: employeeForm.full_name,
             email: employeeForm.email || null,
             phone: employeeForm.phone || null,
             department_id: employeeForm.department_id || null,
             designation: employeeForm.designation || null,
             join_date: employeeForm.join_date || null,
             salary: employeeForm.salary || null,
             address: employeeForm.address || null,
             emergency_contact: employeeForm.emergency_contact || null,
             notes: employeeForm.notes || null,
           })
           .eq('id', selectedEmployee.id);
 
         if (error) throw error;
         toast({ title: 'Success', description: 'Employee updated successfully' });
       } else {
         const { data: empIdData } = await supabase.rpc('generate_employee_id');
         const employeeId = empIdData || `EMP-${Date.now()}`;
 
         const { error } = await supabase.from('employees').insert({
           employee_id: employeeId,
           full_name: employeeForm.full_name,
           email: employeeForm.email || null,
           phone: employeeForm.phone || null,
           department_id: employeeForm.department_id || null,
           designation: employeeForm.designation || null,
           join_date: employeeForm.join_date || null,
           salary: employeeForm.salary || null,
           address: employeeForm.address || null,
           emergency_contact: employeeForm.emergency_contact || null,
           notes: employeeForm.notes || null,
         });
 
         if (error) throw error;
         toast({ title: 'Success', description: 'Employee added successfully' });
       }
 
       setIsEmployeeDialogOpen(false);
       fetchEmployees();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const updateEmployeeStatus = async (id: string, status: string) => {
     try {
       const { error } = await supabase.from('employees').update({ status }).eq('id', id);
       if (error) throw error;
       toast({ title: 'Success', description: 'Status updated' });
       fetchEmployees();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   // Department functions
   const openCreateDepartmentDialog = () => {
     setSelectedDepartment(null);
     setDepartmentForm({ name: '', description: '' });
     setIsDepartmentDialogOpen(true);
   };
 
   const openEditDepartmentDialog = (department: Department) => {
     setSelectedDepartment(department);
     setDepartmentForm({
       name: department.name,
       description: department.description || '',
     });
     setIsDepartmentDialogOpen(true);
   };
 
   const handleSaveDepartment = async () => {
     if (!departmentForm.name) {
       toast({ title: 'Error', description: 'Department name is required', variant: 'destructive' });
       return;
     }
 
     try {
       if (selectedDepartment) {
         const { error } = await supabase
           .from('departments')
           .update({
             name: departmentForm.name,
             description: departmentForm.description || null,
           })
           .eq('id', selectedDepartment.id);
 
         if (error) throw error;
         toast({ title: 'Success', description: 'Department updated' });
       } else {
         const { error } = await supabase.from('departments').insert({
           name: departmentForm.name,
           description: departmentForm.description || null,
         });
 
         if (error) throw error;
         toast({ title: 'Success', description: 'Department created' });
       }
 
       setIsDepartmentDialogOpen(false);
       fetchDepartments();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const getDepartmentName = (departmentId: string | null) => {
     if (!departmentId) return '-';
     const dept = departments.find(d => d.id === departmentId);
     return dept?.name || '-';
   };
 
   const filteredEmployees = employees.filter((emp) => {
     const matchesSearch =
       emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
     const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
     const matchesDepartment = departmentFilter === 'all' || emp.department_id === departmentFilter;
     return matchesSearch && matchesStatus && matchesDepartment;
   });
 
   const formatDate = (dateStr: string | null) => {
     if (!dateStr) return '-';
     return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
   };
 
   const formatCurrency = (amount: number | null) => {
     if (!amount) return '-';
     return `৳${amount.toLocaleString('en-BD')}`;
   };
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         <AdminPageHeader
           title="HR Management"
           description="Manage employees, departments, and attendance"
         />
 
         <Tabs value={activeTab} onValueChange={setActiveTab}>
           <TabsList>
             <TabsTrigger value="employees">Employees</TabsTrigger>
             <TabsTrigger value="departments">Departments</TabsTrigger>
           </TabsList>
 
           <TabsContent value="employees" className="space-y-4 mt-4">
             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                 <Input
                   placeholder="Search employees..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10"
                 />
               </div>
               <div className="flex items-center gap-2">
                 <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                   <SelectTrigger className="w-[150px]">
                     <SelectValue placeholder="Department" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Departments</SelectItem>
                     {departments.map((dept) => (
                       <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                   <SelectTrigger className="w-[130px]">
                     <SelectValue placeholder="Status" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Status</SelectItem>
                     <SelectItem value="active">Active</SelectItem>
                     <SelectItem value="inactive">Inactive</SelectItem>
                     <SelectItem value="on_leave">On Leave</SelectItem>
                     <SelectItem value="terminated">Terminated</SelectItem>
                   </SelectContent>
                 </Select>
                 <Button onClick={openCreateEmployeeDialog}>
                   <Plus className="h-4 w-4 mr-2" /> Add Employee
                 </Button>
               </div>
             </div>
 
             <div className="grid gap-4">
               {isLoading ? (
                 <Card><CardContent className="py-8 text-center text-muted-foreground">Loading employees...</CardContent></Card>
               ) : filteredEmployees.length === 0 ? (
                 <Card><CardContent className="py-8 text-center text-muted-foreground">No employees found.</CardContent></Card>
               ) : (
                 filteredEmployees.map((employee) => (
                   <Card key={employee.id} className="hover:shadow-md transition-shadow">
                     <CardContent className="py-4">
                       <div className="flex items-start justify-between gap-4">
                         <div className="flex items-start gap-4">
                           <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                             {employee.full_name.charAt(0).toUpperCase()}
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                               <h3 className="font-medium">{employee.full_name}</h3>
                               <Badge variant="outline">{employee.employee_id}</Badge>
                                <Badge className={getStatusColor(employee.status)} variant="secondary">
                                 {employee.status.replace('_', ' ')}
                               </Badge>
                             </div>
                             <p className="text-sm text-muted-foreground">{employee.designation || 'No designation'}</p>
                             <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                               <span className="flex items-center gap-1">
                                 <Building2 className="h-3 w-3" /> {getDepartmentName(employee.department_id)}
                               </span>
                               {employee.email && (
                                 <span className="flex items-center gap-1">
                                   <Mail className="h-3 w-3" /> {employee.email}
                                 </span>
                               )}
                               {employee.phone && (
                                 <span className="flex items-center gap-1">
                                   <Phone className="h-3 w-3" /> {employee.phone}
                                 </span>
                               )}
                               {employee.join_date && (
                                 <span className="flex items-center gap-1">
                                   <Calendar className="h-3 w-3" /> Joined {formatDate(employee.join_date)}
                                 </span>
                               )}
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <Button variant="outline" size="sm" onClick={() => openEditEmployeeDialog(employee)}>
                             <Eye className="h-4 w-4 mr-1" /> View
                           </Button>
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={() => updateEmployeeStatus(employee.id, 'active')}>Mark Active</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => updateEmployeeStatus(employee.id, 'inactive')}>Mark Inactive</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => updateEmployeeStatus(employee.id, 'on_leave')}>Mark On Leave</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => updateEmployeeStatus(employee.id, 'terminated')}>Mark Terminated</DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 ))
               )}
             </div>
           </TabsContent>
 
           <TabsContent value="departments" className="space-y-4 mt-4">
             <div className="flex justify-end">
               <Button onClick={openCreateDepartmentDialog}>
                 <Plus className="h-4 w-4 mr-2" /> Add Department
               </Button>
             </div>
 
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {departments.map((dept) => {
                 const employeeCount = employees.filter(e => e.department_id === dept.id).length;
                 return (
                   <Card key={dept.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEditDepartmentDialog(dept)}>
                     <CardContent className="py-4">
                       <div className="flex items-center justify-between">
                         <div>
                           <h3 className="font-medium">{dept.name}</h3>
                           <p className="text-sm text-muted-foreground">{dept.description || 'No description'}</p>
                           <p className="text-sm text-muted-foreground mt-2">{employeeCount} employee{employeeCount !== 1 ? 's' : ''}</p>
                         </div>
                         <Building2 className="h-8 w-8 text-muted-foreground/30" />
                       </div>
                     </CardContent>
                   </Card>
                 );
               })}
               {departments.length === 0 && (
                 <Card className="md:col-span-2 lg:col-span-3">
                   <CardContent className="py-8 text-center text-muted-foreground">
                     No departments yet. Create your first department.
                   </CardContent>
                 </Card>
               )}
             </div>
           </TabsContent>
         </Tabs>
       </div>
 
       {/* Employee Dialog */}
       <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
             <DialogDescription>
               {selectedEmployee ? `Employee ID: ${selectedEmployee.employee_id}` : 'Add a new employee to your team'}
             </DialogDescription>
           </DialogHeader>
 
           <div className="space-y-4">
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Full Name *</Label>
                 <Input value={employeeForm.full_name} onChange={(e) => setEmployeeForm({ ...employeeForm, full_name: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Email</Label>
                 <Input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Phone</Label>
                 <Input value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Department</Label>
                 <Select value={employeeForm.department_id} onValueChange={(value) => setEmployeeForm({ ...employeeForm, department_id: value })}>
                   <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                   <SelectContent>
                     {departments.map((dept) => (
                       <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label>Designation</Label>
                 <Input value={employeeForm.designation} onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Join Date</Label>
                 <Input type="date" value={employeeForm.join_date} onChange={(e) => setEmployeeForm({ ...employeeForm, join_date: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Salary</Label>
                 <Input type="number" min="0" value={employeeForm.salary} onChange={(e) => setEmployeeForm({ ...employeeForm, salary: Number(e.target.value) })} />
               </div>
               <div className="space-y-2">
                 <Label>Emergency Contact</Label>
                 <Input value={employeeForm.emergency_contact} onChange={(e) => setEmployeeForm({ ...employeeForm, emergency_contact: e.target.value })} />
               </div>
             </div>
             <div className="space-y-2">
               <Label>Address</Label>
               <Textarea value={employeeForm.address} onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })} rows={2} />
             </div>
             <div className="space-y-2">
               <Label>Notes</Label>
               <Textarea value={employeeForm.notes} onChange={(e) => setEmployeeForm({ ...employeeForm, notes: e.target.value })} rows={2} />
             </div>
             <div className="flex justify-end gap-3">
               <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>Cancel</Button>
               <Button onClick={handleSaveEmployee}>{selectedEmployee ? 'Update' : 'Add Employee'}</Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
 
       {/* Department Dialog */}
       <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{selectedDepartment ? 'Edit Department' : 'Add Department'}</DialogTitle>
             <DialogDescription>
               {selectedDepartment ? 'Update department details' : 'Create a new department'}
             </DialogDescription>
           </DialogHeader>
 
           <div className="space-y-4">
             <div className="space-y-2">
               <Label>Name *</Label>
               <Input value={departmentForm.name} onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} />
             </div>
             <div className="space-y-2">
               <Label>Description</Label>
               <Textarea value={departmentForm.description} onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })} rows={3} />
             </div>
             <div className="flex justify-end gap-3">
               <Button variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>Cancel</Button>
               <Button onClick={handleSaveDepartment}>{selectedDepartment ? 'Update' : 'Create'}</Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminEmployees;