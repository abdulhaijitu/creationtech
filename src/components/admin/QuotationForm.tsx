 import { useState } from 'react';
 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Plus, X, User, Calendar, FileText, Calculator, Receipt, Trash2 } from 'lucide-react';
 import ClientCombobox from './ClientCombobox';
 import RichTextEditor from '@/components/ui/rich-text-editor';
 
 export interface QuotationItem {
   id?: string;
   description: string;
   quantity: number;
   unit_price: number;
   amount: number;
 }
 
 export interface QuotationFormData {
   client_id: string;
   client_name: string;
   client_email: string;
   client_phone: string;
   client_address: string;
   valid_until: string;
   tax_rate: number;
   discount_amount: number;
   notes: string;
   terms: string;
   status: string;
 }
 
 interface QuotationFormProps {
   formData: QuotationFormData;
   setFormData: (data: QuotationFormData) => void;
   items: QuotationItem[];
   setItems: (items: QuotationItem[]) => void;
   onSubmit: (e: React.FormEvent) => void;
   onCancel: () => void;
   isEditing: boolean;
   isLoading: boolean;
   onAddNewClient?: () => void;
 }
 
 const QuotationForm = ({
   formData,
   setFormData,
   items,
   setItems,
   onSubmit,
   onCancel,
   isEditing,
   isLoading,
   onAddNewClient,
 }: QuotationFormProps) => {
   const { data: clients = [] } = useQuery({
     queryKey: ['clients-list'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('clients')
         .select('id, name, email, phone, address, company')
         .order('name');
       if (error) throw error;
       return data;
     },
   });
 
   const addItem = () => {
     setItems([...items, { description: '', quantity: 1, unit_price: 0, amount: 0 }]);
   };
 
   const removeItem = (index: number) => {
     if (items.length > 1) {
       setItems(items.filter((_, i) => i !== index));
     }
   };
 
   const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
     const newItems = [...items];
     newItems[index] = { ...newItems[index], [field]: value };
     if (field === 'quantity' || field === 'unit_price') {
       newItems[index].amount = Number(newItems[index].quantity) * Number(newItems[index].unit_price);
     }
     setItems(newItems);
   };
 
   const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
   const taxAmount = subtotal * (formData.tax_rate / 100);
   const total = subtotal + taxAmount - formData.discount_amount;
 
   const handleClientSelect = (client: { id: string; name: string; email: string | null; phone: string | null; address: string | null }) => {
     setFormData({
       ...formData,
       client_id: client.id,
       client_name: client.name,
       client_email: client.email || '',
       client_phone: client.phone || '',
       client_address: client.address || '',
     });
   };
 
   return (
     <form onSubmit={onSubmit} className="space-y-6">
       {/* Client Selection Section */}
       <Card>
         <CardHeader className="pb-3">
           <CardTitle className="text-base flex items-center gap-2">
             <User className="h-4 w-4 text-primary" />
             Client Information
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="space-y-2">
             <Label className="text-sm font-medium">Select Client <span className="text-destructive">*</span></Label>
             <ClientCombobox
               clients={clients}
               value={formData.client_id}
               onSelect={handleClientSelect}
               onAddNew={onAddNewClient}
               placeholder="Search and select a client..."
             />
           </div>
           
           {formData.client_id && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-in slide-in-from-top-2 duration-200">
               <div className="space-y-1.5">
                 <Label className="text-xs text-muted-foreground">Email</Label>
                 <Input
                   type="email"
                   value={formData.client_email}
                   onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                   placeholder="client@example.com"
                   className="h-9"
                 />
               </div>
               <div className="space-y-1.5">
                 <Label className="text-xs text-muted-foreground">Phone</Label>
                 <Input
                   value={formData.client_phone}
                   onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                   placeholder="+880 1XXX-XXXXXX"
                   className="h-9"
                 />
               </div>
               <div className="space-y-1.5">
                 <Label className="text-xs text-muted-foreground">Address</Label>
                 <Input
                   value={formData.client_address}
                   onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                   placeholder="Street, City"
                   className="h-9"
                 />
               </div>
             </div>
           )}
         </CardContent>
       </Card>
 
       {/* Quotation Details Section */}
       <Card>
         <CardHeader className="pb-3">
           <CardTitle className="text-base flex items-center gap-2">
             <Calendar className="h-4 w-4 text-primary" />
             Quotation Details
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
               <Label className="text-xs text-muted-foreground">Valid Until</Label>
               <Input
                 type="date"
                 value={formData.valid_until}
                 onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                 className="h-9"
               />
             </div>
             <div className="space-y-1.5">
               <Label className="text-xs text-muted-foreground">Status</Label>
               <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                 <SelectTrigger className="h-9">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="pending">
                     <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-4))]" />
                       Pending
                     </div>
                   </SelectItem>
                   <SelectItem value="approved">
                     <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
                       Approved
                     </div>
                   </SelectItem>
                   <SelectItem value="rejected">
                     <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-destructive" />
                       Rejected
                     </div>
                   </SelectItem>
                   <SelectItem value="converted">
                     <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       Converted
                     </div>
                   </SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
         </CardContent>
       </Card>
 
       {/* Line Items Section */}
       <Card>
         <CardHeader className="pb-3">
           <div className="flex items-center justify-between">
             <CardTitle className="text-base flex items-center gap-2">
               <FileText className="h-4 w-4 text-primary" />
               Line Items
             </CardTitle>
             <Button type="button" variant="outline" size="sm" onClick={addItem}>
               <Plus className="mr-2 h-4 w-4" />
               Add Item
             </Button>
           </div>
         </CardHeader>
         <CardContent>
           {/* Header for desktop */}
           <div className="hidden md:grid md:grid-cols-12 gap-2 mb-2 px-1">
             <div className="col-span-5 text-xs font-medium text-muted-foreground">Description</div>
             <div className="col-span-2 text-xs font-medium text-muted-foreground">Quantity</div>
             <div className="col-span-2 text-xs font-medium text-muted-foreground">Unit Price</div>
             <div className="col-span-2 text-xs font-medium text-muted-foreground text-right">Amount</div>
             <div className="col-span-1"></div>
           </div>
           
           <div className="space-y-3">
             {items.map((item, index) => (
               <div 
                 key={index} 
                 className="group relative grid grid-cols-1 md:grid-cols-12 gap-2 p-3 md:p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
               >
                 {/* Mobile layout */}
                 <div className="md:hidden space-y-3">
                   <div className="flex items-start justify-between">
                     <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       onClick={() => removeItem(index)}
                       disabled={items.length === 1}
                       className="h-8 w-8 text-muted-foreground hover:text-destructive"
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-xs text-muted-foreground">Description</Label>
                     <RichTextEditor
                       content={item.description}
                       onChange={(value) => updateItem(index, 'description', value)}
                       placeholder="Item description with formatting..."
                       className="[&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
                     />
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     <div>
                       <Label className="text-xs text-muted-foreground">Qty</Label>
                       <Input
                         type="number"
                         value={item.quantity}
                         onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                         min="1"
                       />
                     </div>
                     <div>
                       <Label className="text-xs text-muted-foreground">Price</Label>
                       <Input
                         type="number"
                         value={item.unit_price}
                         onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                         min="0"
                       />
                     </div>
                     <div>
                       <Label className="text-xs text-muted-foreground">Amount</Label>
                       <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm font-medium flex items-center justify-end">
                         ৳{item.amount.toLocaleString()}
                       </div>
                     </div>
                   </div>
                 </div>
 
                 {/* Desktop layout */}
                 <div className="hidden md:contents">
                   <div className="col-span-5 self-start">
                     <RichTextEditor
                       content={item.description}
                       onChange={(value) => updateItem(index, 'description', value)}
                       placeholder="Item description with formatting..."
                       className="[&_.ProseMirror]:min-h-[50px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
                     />
                   </div>
                   <div className="col-span-2">
                     <Input
                       type="number"
                       value={item.quantity}
                       onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                       min="1"
                       className="h-9"
                     />
                   </div>
                   <div className="col-span-2">
                     <Input
                       type="number"
                       value={item.unit_price}
                       onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                       min="0"
                       className="h-9"
                     />
                   </div>
                   <div className="col-span-2 flex items-center justify-end">
                     <span className="font-medium text-sm">৳{item.amount.toLocaleString()}</span>
                   </div>
                   <div className="col-span-1 flex items-center justify-center">
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       onClick={() => removeItem(index)}
                       disabled={items.length === 1}
                       className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                     >
                       <X className="h-4 w-4" />
                     </Button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
 
       {/* Summary & Notes Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Notes & Terms */}
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="text-base flex items-center gap-2">
               <Receipt className="h-4 w-4 text-primary" />
               Notes & Terms
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-1.5">
               <Label className="text-xs text-muted-foreground">Notes</Label>
               <Textarea
                 value={formData.notes}
                 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                 placeholder="Additional notes for the client..."
                 rows={3}
                 className="resize-none"
               />
             </div>
             <div className="space-y-1.5">
               <Label className="text-xs text-muted-foreground">Terms & Conditions</Label>
               <Textarea
                 value={formData.terms}
                 onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                 placeholder="Terms and conditions..."
                 rows={2}
                 className="resize-none"
               />
             </div>
           </CardContent>
         </Card>
 
         {/* Totals */}
         <Card className="bg-muted/30">
           <CardHeader className="pb-3">
             <CardTitle className="text-base flex items-center gap-2">
               <Calculator className="h-4 w-4 text-primary" />
               Quotation Summary
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-muted-foreground">Subtotal</span>
               <span className="font-medium">৳{subtotal.toLocaleString()}</span>
             </div>
             
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <span className="text-muted-foreground">Tax</span>
                 <div className="flex items-center gap-1">
                   <Input
                     type="number"
                     value={formData.tax_rate}
                     onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                     className="w-16 h-7 text-center"
                     min="0"
                     max="100"
                   />
                   <span className="text-sm text-muted-foreground">%</span>
                 </div>
               </div>
               <span className="font-medium">৳{taxAmount.toLocaleString()}</span>
             </div>
             
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <span className="text-muted-foreground">Discount</span>
                 <div className="flex items-center gap-1">
                   <span className="text-sm text-muted-foreground">৳</span>
                   <Input
                     type="number"
                     value={formData.discount_amount}
                     onChange={(e) => setFormData({ ...formData, discount_amount: Number(e.target.value) })}
                     className="w-20 h-7 text-center"
                     min="0"
                   />
                 </div>
               </div>
               <span className="font-medium text-destructive">-৳{formData.discount_amount.toLocaleString()}</span>
             </div>
 
             <div className="border-t pt-4 mt-4">
               <div className="flex justify-between items-center">
                 <span className="text-lg font-semibold">Total</span>
                 <span className="text-2xl font-bold text-primary">৳{total.toLocaleString()}</span>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Actions */}
       <div className="flex justify-end gap-3 pt-4">
         <Button type="button" variant="outline" onClick={onCancel}>
           Cancel
         </Button>
         <Button type="submit" disabled={isLoading}>
           {isLoading ? 'Saving...' : isEditing ? 'Update Quotation' : 'Create Quotation'}
         </Button>
       </div>
     </form>
   );
 };
 
 export default QuotationForm;