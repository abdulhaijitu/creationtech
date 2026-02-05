 /**
  * Creation Tech Enterprise Color System
  * Centralized status color utilities for consistent UI across admin dashboard
  * 
  * USAGE:
  * import { getStatusColor, getRoleColor, STATUS_VARIANTS } from '@/lib/status-colors';
  * 
  * <Badge className={getStatusColor('success')}>Active</Badge>
  * <Badge className={getRoleColor('admin')}>Admin</Badge>
  */
 
 // Status variants mapping - use semantic tokens only
 export const STATUS_VARIANTS = {
   // Success states: active, completed, confirmed, paid, approved
   success: 'bg-success-muted text-success-muted-foreground border-success/20',
   
   // Warning states: pending, in_progress, attention, late
   warning: 'bg-warning-muted text-warning-muted-foreground border-warning/20',
   
   // Info states: new, info, scheduled, review
   info: 'bg-info-muted text-info-muted-foreground border-info/20',
   
   // Destructive states: failed, cancelled, rejected, overdue, error
   destructive: 'bg-destructive/10 text-destructive border-destructive/20',
   
   // Neutral states: inactive, closed, draft, disabled
   neutral: 'bg-neutral-muted text-neutral-muted-foreground border-neutral/20',
   
   // Primary brand states: featured, highlighted
   primary: 'bg-primary/10 text-primary border-primary/20',
   
   // Accent states: special, premium
   accent: 'bg-accent/10 text-accent border-accent/20',
 } as const;
 
 // Role-specific colors
 export const ROLE_VARIANTS = {
   admin: 'bg-role-admin-muted text-role-admin-foreground border-role-admin/20',
   manager: 'bg-role-manager-muted text-role-manager-foreground border-role-manager/20',
   developer: 'bg-role-developer-muted text-role-developer-foreground border-role-developer/20',
 } as const;
 
 // Solid role badge colors (for icons/indicators)
 export const ROLE_SOLID_VARIANTS = {
   admin: 'bg-role-admin text-white',
   manager: 'bg-role-manager text-white',
   developer: 'bg-role-developer text-white',
 } as const;
 
 // Status to variant mapping for common statuses
 export const STATUS_MAP: Record<string, keyof typeof STATUS_VARIANTS> = {
   // Success
   active: 'success',
   completed: 'success',
   confirmed: 'success',
   paid: 'success',
   approved: 'success',
   hired: 'success',
   present: 'success',
   published: 'success',
   shortlisted: 'success',
   sent: 'success',
   accepted: 'success',
   
   // Warning
   pending: 'warning',
   in_progress: 'warning',
   contacted: 'warning',
   reviewed: 'warning',
   late: 'warning',
   half_day: 'warning',
   expired: 'warning',
   
   // Info
   new: 'info',
   scheduled: 'info',
   on_leave: 'info',
   processing: 'info',
   open: 'info',
   
   // Destructive
   failed: 'destructive',
   cancelled: 'destructive',
   rejected: 'destructive',
   overdue: 'destructive',
   error: 'destructive',
   absent: 'destructive',
   terminated: 'destructive',
   declined: 'destructive',
   
   // Neutral
   inactive: 'neutral',
   closed: 'neutral',
   draft: 'neutral',
   disabled: 'neutral',
   archived: 'neutral',
 };
 
 /**
  * Get status color classes for a given status string
  * Falls back to neutral if status is not recognized
  */
 export function getStatusColor(status: string): string {
   const normalizedStatus = status.toLowerCase().replace(/[\s-]/g, '_');
   const variant = STATUS_MAP[normalizedStatus] || 'neutral';
   return STATUS_VARIANTS[variant];
 }
 
 /**
  * Get status color classes for a specific variant
  */
 export function getVariantColor(variant: keyof typeof STATUS_VARIANTS): string {
   return STATUS_VARIANTS[variant];
 }
 
 /**
  * Get role color classes for admin roles
  */
 export function getRoleColor(role: string): string {
   const normalizedRole = role.toLowerCase() as keyof typeof ROLE_VARIANTS;
   return ROLE_VARIANTS[normalizedRole] || ROLE_VARIANTS.developer;
 }
 
 /**
  * Get solid role color (for icons/indicators)
  */
 export function getRoleSolidColor(role: string): string {
   const normalizedRole = role.toLowerCase() as keyof typeof ROLE_SOLID_VARIANTS;
   return ROLE_SOLID_VARIANTS[normalizedRole] || ROLE_SOLID_VARIANTS.developer;
 }
 
 // Chart color array for data visualization
 export const CHART_COLORS = [
   'hsl(var(--chart-1))',
   'hsl(var(--chart-2))',
   'hsl(var(--chart-3))',
   'hsl(var(--chart-4))',
   'hsl(var(--chart-5))',
 ];