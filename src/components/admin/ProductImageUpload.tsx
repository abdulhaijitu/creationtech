 import { useState, useRef } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { Label } from '@/components/ui/label';
 import { toast } from 'sonner';
 import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
 
 interface ProductImageUploadProps {
   productId: string;
   currentImageUrl: string | null;
   onImageUploaded: (url: string) => void;
   onImageRemoved: () => void;
 }
 
 const ProductImageUpload = ({
   productId,
   currentImageUrl,
   onImageUploaded,
   onImageRemoved,
 }: ProductImageUploadProps) => {
   const [isUploading, setIsUploading] = useState(false);
   const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
 
     // Validate file type
     if (!file.type.startsWith('image/')) {
       toast.error('Please select an image file');
       return;
     }
 
     // Validate file size (max 5MB)
     if (file.size > 5 * 1024 * 1024) {
       toast.error('Image size must be less than 5MB');
       return;
     }
 
     setIsUploading(true);
 
     try {
       // Generate unique filename
       const fileExt = file.name.split('.').pop();
       const fileName = `${productId}-${Date.now()}.${fileExt}`;
       const filePath = `${fileName}`;
 
       // Upload to Supabase storage
       const { error: uploadError } = await supabase.storage
         .from('product-images')
         .upload(filePath, file, { upsert: true });
 
       if (uploadError) throw uploadError;
 
       // Get public URL
       const { data: { publicUrl } } = supabase.storage
         .from('product-images')
         .getPublicUrl(filePath);
 
       setPreviewUrl(publicUrl);
       onImageUploaded(publicUrl);
       toast.success('Image uploaded successfully');
     } catch (error) {
       console.error('Upload error:', error);
       toast.error('Failed to upload image');
     } finally {
       setIsUploading(false);
       if (fileInputRef.current) {
         fileInputRef.current.value = '';
       }
     }
   };
 
   const handleRemove = async () => {
     if (previewUrl) {
       // Extract filename from URL for deletion
       try {
         const urlParts = previewUrl.split('/');
         const fileName = urlParts[urlParts.length - 1];
         
         await supabase.storage
           .from('product-images')
           .remove([fileName]);
       } catch (error) {
         console.error('Delete error:', error);
       }
     }
     
     setPreviewUrl(null);
     onImageRemoved();
     toast.success('Image removed');
   };
 
   return (
     <div className="space-y-3">
       <Label>Product Image</Label>
       
       {previewUrl ? (
         <div className="relative group">
           <img
             src={previewUrl}
             alt="Product preview"
             className="w-full h-48 object-cover rounded-lg border"
           />
           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
             <Button
               type="button"
               variant="secondary"
               size="sm"
               onClick={() => fileInputRef.current?.click()}
               disabled={isUploading}
             >
               <Upload className="h-4 w-4 mr-1" />
               Replace
             </Button>
             <Button
               type="button"
               variant="destructive"
               size="sm"
               onClick={handleRemove}
               disabled={isUploading}
             >
               <X className="h-4 w-4 mr-1" />
               Remove
             </Button>
           </div>
         </div>
       ) : (
         <div
           onClick={() => !isUploading && fileInputRef.current?.click()}
           className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
         >
           {isUploading ? (
             <>
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               <span className="text-sm text-muted-foreground">Uploading...</span>
             </>
           ) : (
             <>
               <ImageIcon className="h-8 w-8 text-muted-foreground" />
               <span className="text-sm text-muted-foreground">Click to upload image</span>
               <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
             </>
           )}
         </div>
       )}
 
       <input
         ref={fileInputRef}
         type="file"
         accept="image/*"
         onChange={handleFileSelect}
         className="hidden"
       />
     </div>
   );
 };
 
 export default ProductImageUpload;