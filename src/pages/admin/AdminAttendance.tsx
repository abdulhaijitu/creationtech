 import { useEffect, useState } from 'react';
 import { Calendar, Clock, Search, Plus, Check, X, User } from 'lucide-react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { useToast } from '@/hooks/use-toast';
 import { supabase } from '@/integrations/supabase/client';
 
 interface Employee {
   id: string;
   employee_id: string;
   full_name: string;
   department_id: string | null;
   status: string;
 }
 
 interface Attendance {
   id: string;
   employee_id: string;
   date: string;
   check_in: string | null;
   check_out: string | null;
   status: string;
   notes: string | null;
 }
 
 const statusColors: Record<string, string> = {
   present: 'bg-green-100 text-green-700',
   absent: 'bg-red-100 text-red-700',
   late: 'bg-yellow-100 text-yellow-700',
   half_day: 'bg-orange-100 text-orange-700',
   on_leave: 'bg-blue-100 text-blue-700',
 };
 
 const AdminAttendance = () => {
   const { toast } = useToast();
   const [employees, setEmployees] = useState<Employee[]>([]);
   const [attendance, setAttendance] = useState<Attendance[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   const [searchQuery, setSearchQuery] = useState('');
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
   const [attendanceForm, setAttendanceForm] = useState({
     check_in: '',
     check_out: '',
     status: 'present',
     notes: '',
   });
 
   const fetchEmployees = async () => {
     const { data } = await supabase
       .from('employees')
       .select('id, employee_id, full_name, department_id, status')
       .eq('status', 'active')
       .order('full_name');
     setEmployees(data || []);
   };
 
   const fetchAttendance = async () => {
     try {
       const { data, error } = await supabase
         .from('attendance')
         .select('*')
         .eq('date', selectedDate);
 
       if (error) throw error;
       setAttendance(data || []);
     } catch (error) {
       console.error('Error fetching attendance:', error);
     } finally {
       setIsLoading(false);
     }
   };
 
   useEffect(() => {
     fetchEmployees();
   }, []);
 
   useEffect(() => {
     fetchAttendance();
   }, [selectedDate]);
 
   const getAttendanceForEmployee = (employeeId: string) => {
     return attendance.find(a => a.employee_id === employeeId);
   };
 
   const openMarkAttendanceDialog = (employee: Employee) => {
     const existingAttendance = getAttendanceForEmployee(employee.id);
     setSelectedEmployee(employee);
     setAttendanceForm({
       check_in: existingAttendance?.check_in || '',
       check_out: existingAttendance?.check_out || '',
       status: existingAttendance?.status || 'present',
       notes: existingAttendance?.notes || '',
     });
     setIsDialogOpen(true);
   };
 
   const handleSaveAttendance = async () => {
     if (!selectedEmployee) return;
 
     try {
       const existingAttendance = getAttendanceForEmployee(selectedEmployee.id);
 
       if (existingAttendance) {
         const { error } = await supabase
           .from('attendance')
           .update({
             check_in: attendanceForm.check_in || null,
             check_out: attendanceForm.check_out || null,
             status: attendanceForm.status,
             notes: attendanceForm.notes || null,
           })
           .eq('id', existingAttendance.id);
 
         if (error) throw error;
       } else {
         const { error } = await supabase.from('attendance').insert({
           employee_id: selectedEmployee.id,
           date: selectedDate,
           check_in: attendanceForm.check_in || null,
           check_out: attendanceForm.check_out || null,
           status: attendanceForm.status,
           notes: attendanceForm.notes || null,
         });
 
         if (error) throw error;
       }
 
       toast({ title: 'Success', description: 'Attendance saved' });
       setIsDialogOpen(false);
       fetchAttendance();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const quickMarkAttendance = async (employeeId: string, status: string) => {
     try {
       const existingAttendance = getAttendanceForEmployee(employeeId);
       const now = new Date().toTimeString().slice(0, 5);
 
       if (existingAttendance) {
         const { error } = await supabase
           .from('attendance')
           .update({ status, check_in: status === 'present' || status === 'late' ? now : null })
           .eq('id', existingAttendance.id);
         if (error) throw error;
       } else {
         const { error } = await supabase.from('attendance').insert({
           employee_id: employeeId,
           date: selectedDate,
           status,
           check_in: status === 'present' || status === 'late' ? now : null,
         });
         if (error) throw error;
       }
 
       fetchAttendance();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const filteredEmployees = employees.filter((emp) =>
     emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const stats = {
     total: employees.length,
     present: attendance.filter(a => a.status === 'present').length,
     absent: attendance.filter(a => a.status === 'absent').length,
     late: attendance.filter(a => a.status === 'late').length,
     onLeave: attendance.filter(a => a.status === 'on_leave').length,
   };
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         <AdminPageHeader
           title="Attendance"
           description="Track daily employee attendance"
         />
 
         {/* Stats */}
         <div className="grid gap-4 md:grid-cols-5">
           <Card>
             <CardContent className="pt-4">
               <div className="text-2xl font-bold">{stats.total}</div>
               <p className="text-xs text-muted-foreground">Total Employees</p>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="pt-4">
               <div className="text-2xl font-bold text-green-600">{stats.present}</div>
               <p className="text-xs text-muted-foreground">Present</p>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="pt-4">
               <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
               <p className="text-xs text-muted-foreground">Absent</p>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="pt-4">
               <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
               <p className="text-xs text-muted-foreground">Late</p>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="pt-4">
               <div className="text-2xl font-bold text-blue-600">{stats.onLeave}</div>
               <p className="text-xs text-muted-foreground">On Leave</p>
             </CardContent>
           </Card>
         </div>
 
         {/* Filters */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           <div className="flex items-center gap-4">
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
               <Calendar className="h-4 w-4 text-muted-foreground" />
               <Input
                 type="date"
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 className="w-auto"
               />
             </div>
           </div>
         </div>
 
         {/* Attendance Table */}
         <Card>
           <CardContent className="p-0">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Employee</TableHead>
                   <TableHead>ID</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Check In</TableHead>
                   <TableHead>Check Out</TableHead>
                   <TableHead className="text-right">Quick Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {isLoading ? (
                   <TableRow>
                     <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                       Loading...
                     </TableCell>
                   </TableRow>
                 ) : filteredEmployees.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                       No employees found.
                     </TableCell>
                   </TableRow>
                 ) : (
                   filteredEmployees.map((employee) => {
                     const att = getAttendanceForEmployee(employee.id);
                     return (
                       <TableRow key={employee.id}>
                         <TableCell>
                           <div className="flex items-center gap-2">
                             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                               {employee.full_name.charAt(0)}
                             </div>
                             <span className="font-medium">{employee.full_name}</span>
                           </div>
                         </TableCell>
                         <TableCell className="text-muted-foreground">{employee.employee_id}</TableCell>
                         <TableCell>
                           {att ? (
                             <Badge className={statusColors[att.status]} variant="secondary">
                               {att.status.replace('_', ' ')}
                             </Badge>
                           ) : (
                             <Badge variant="outline">Not Marked</Badge>
                           )}
                         </TableCell>
                         <TableCell>{att?.check_in || '-'}</TableCell>
                         <TableCell>{att?.check_out || '-'}</TableCell>
                         <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-1">
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                               onClick={() => quickMarkAttendance(employee.id, 'present')}
                               title="Mark Present"
                             >
                               <Check className="h-4 w-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                               onClick={() => quickMarkAttendance(employee.id, 'absent')}
                               title="Mark Absent"
                             >
                               <X className="h-4 w-4" />
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => openMarkAttendanceDialog(employee)}
                             >
                               <Clock className="h-4 w-4 mr-1" /> Details
                             </Button>
                           </div>
                         </TableCell>
                       </TableRow>
                     );
                   })
                 )}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       </div>
 
       {/* Attendance Dialog */}
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Mark Attendance</DialogTitle>
             <DialogDescription>
               {selectedEmployee?.full_name} - {selectedDate}
             </DialogDescription>
           </DialogHeader>
 
           <div className="space-y-4">
             <div className="space-y-2">
               <Label>Status</Label>
               <Select value={attendanceForm.status} onValueChange={(value) => setAttendanceForm({ ...attendanceForm, status: value })}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="present">Present</SelectItem>
                   <SelectItem value="absent">Absent</SelectItem>
                   <SelectItem value="late">Late</SelectItem>
                   <SelectItem value="half_day">Half Day</SelectItem>
                   <SelectItem value="on_leave">On Leave</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div className="grid gap-4 grid-cols-2">
               <div className="space-y-2">
                 <Label>Check In</Label>
                 <Input type="time" value={attendanceForm.check_in} onChange={(e) => setAttendanceForm({ ...attendanceForm, check_in: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Check Out</Label>
                 <Input type="time" value={attendanceForm.check_out} onChange={(e) => setAttendanceForm({ ...attendanceForm, check_out: e.target.value })} />
               </div>
             </div>
             <div className="space-y-2">
               <Label>Notes</Label>
               <Textarea value={attendanceForm.notes} onChange={(e) => setAttendanceForm({ ...attendanceForm, notes: e.target.value })} rows={2} />
             </div>
             <div className="flex justify-end gap-3">
               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
               <Button onClick={handleSaveAttendance}>Save</Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminAttendance;