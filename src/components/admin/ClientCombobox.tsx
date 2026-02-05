 import { useState } from 'react';
 import { Check, ChevronsUpDown, User, Plus } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { Button } from '@/components/ui/button';
 import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
 } from '@/components/ui/command';
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from '@/components/ui/popover';
 
 interface Client {
   id: string;
   name: string;
   email: string | null;
   phone: string | null;
   address: string | null;
   company?: string | null;
 }
 
 interface ClientComboboxProps {
   clients: Client[];
   value: string;
   onSelect: (client: Client) => void;
   onAddNew?: () => void;
   placeholder?: string;
   disabled?: boolean;
 }
 
 const ClientCombobox = ({
   clients,
   value,
   onSelect,
   onAddNew,
   placeholder = "Select client...",
   disabled = false,
 }: ClientComboboxProps) => {
   const [open, setOpen] = useState(false);
 
   const selectedClient = clients.find((client) => client.id === value);
 
   return (
     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         <Button
           variant="outline"
           role="combobox"
           aria-expanded={open}
           className="w-full justify-between h-10 font-normal"
           disabled={disabled}
         >
           {selectedClient ? (
             <div className="flex items-center gap-2 truncate">
               <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                 <User className="h-3 w-3 text-primary" />
               </div>
               <div className="flex flex-col items-start truncate">
                 <span className="truncate">{selectedClient.name}</span>
                 {selectedClient.email && (
                   <span className="text-xs text-muted-foreground truncate">{selectedClient.email}</span>
                 )}
               </div>
             </div>
           ) : (
             <span className="text-muted-foreground">{placeholder}</span>
           )}
           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
         </Button>
       </PopoverTrigger>
       <PopoverContent className="w-[400px] p-0" align="start">
         <Command>
           <CommandInput placeholder="Search clients..." />
           <CommandList>
             <CommandEmpty>
               <div className="py-4 text-center">
                 <p className="text-sm text-muted-foreground mb-2">No client found.</p>
                 {onAddNew && (
                   <Button variant="outline" size="sm" onClick={() => { setOpen(false); onAddNew(); }}>
                     <Plus className="mr-2 h-4 w-4" />
                     Add New Client
                   </Button>
                 )}
               </div>
             </CommandEmpty>
             <CommandGroup>
               {clients.map((client) => (
                 <CommandItem
                   key={client.id}
                   value={`${client.name} ${client.email || ''} ${client.company || ''}`}
                   onSelect={() => {
                     onSelect(client);
                     setOpen(false);
                   }}
                   className="cursor-pointer"
                 >
                   <div className="flex items-center gap-3 flex-1">
                     <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                       <User className="h-4 w-4 text-primary" />
                     </div>
                     <div className="flex flex-col min-w-0">
                       <span className="font-medium truncate">{client.name}</span>
                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
                         {client.email && <span className="truncate">{client.email}</span>}
                         {client.company && <span className="truncate">• {client.company}</span>}
                       </div>
                     </div>
                   </div>
                   <Check
                     className={cn(
                       "h-4 w-4 flex-shrink-0",
                       value === client.id ? "opacity-100" : "opacity-0"
                     )}
                   />
                 </CommandItem>
               ))}
             </CommandGroup>
           </CommandList>
         </Command>
       </PopoverContent>
     </Popover>
   );
 };
 
 export default ClientCombobox;