 import { useState, useRef } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { Label } from '@/components/ui/label';
 import { toast } from 'sonner';
 import { Upload, X, ImageIcon, Loader2, GripVertical } from 'lucide-react';
 
 interface MediaItem {
   type: string;
   url: string;
 }
 
 interface ProductGalleryUploadProps {
   productId: string;
   images: MediaItem[];
   onImagesChange: (images: MediaItem[]) => void;
 }
 
 const ProductGalleryUpload = ({
   productId,
   images,
   onImagesChange,
 }: ProductGalleryUploadProps) => {
   const [isUploading, setIsUploading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (!files || files.length === 0) return;
 
     const validFiles: File[] = [];
     for (let i = 0; i < files.length; i++) {
       const file = files[i];
       if (!file.type.startsWith('image/')) {
         toast.error(`${file.name} is not an image file`);
         continue;
       }
       if (file.size > 5 * 1024 * 1024) {
         toast.error(`${file.name} is larger than 5MB`);
         continue;
       }
       validFiles.push(file);
     }
 
     if (validFiles.length === 0) return;
 
     setIsUploading(true);
     const newImages: MediaItem[] = [];
 
     try {
       for (const file of validFiles) {
         const fileExt = file.name.split('.').pop();
         const fileName = `${productId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
 
         const { error: uploadError } = await supabase.storage
           .from('product-images')
           .upload(fileName, file, { upsert: true });
 
         if (uploadError) {
           console.error('Upload error:', uploadError);
           toast.error(`Failed to upload ${file.name}`);
           continue;
         }
 
         const { data: { publicUrl } } = supabase.storage
           .from('product-images')
           .getPublicUrl(fileName);
 
         newImages.push({ type: 'image', url: publicUrl });
       }
 
       if (newImages.length > 0) {
         onImagesChange([...images, ...newImages]);
         toast.success(`${newImages.length} image(s) uploaded successfully`);
       }
     } catch (error) {
       console.error('Upload error:', error);
       toast.error('Failed to upload images');
     } finally {
       setIsUploading(false);
       if (fileInputRef.current) {
         fileInputRef.current.value = '';
       }
     }
   };
 
   const handleRemove = async (index: number) => {
     const imageToRemove = images[index];
     
     try {
       const urlParts = imageToRemove.url.split('/');
       const fileName = urlParts[urlParts.length - 1];
       await supabase.storage.from('product-images').remove([fileName]);
     } catch (error) {
       console.error('Delete error:', error);
     }
     
     const newImages = images.filter((_, i) => i !== index);
     onImagesChange(newImages);
     toast.success('Image removed');
   };
 
   const moveImage = (fromIndex: number, toIndex: number) => {
     if (toIndex < 0 || toIndex >= images.length) return;
     const newImages = [...images];
     const [movedImage] = newImages.splice(fromIndex, 1);
     newImages.splice(toIndex, 0, movedImage);
     onImagesChange(newImages);
   };
 
   return (
     <div className="space-y-4">
       <div className="flex items-center justify-between">
         <Label>Product Images ({images.length})</Label>
         <Button
           type="button"
           variant="outline"
           size="sm"
           onClick={() => fileInputRef.current?.click()}
           disabled={isUploading}
         >
           <Upload className="h-4 w-4 mr-1" />
           Add Images
         </Button>
       </div>
 
       {images.length > 0 ? (
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
           {images.map((image, index) => (
             <div key={index} className="relative group aspect-square">
               <img
                 src={image.url}
                 alt={`Product image ${index + 1}`}
                 className="w-full h-full object-cover rounded-lg border"
               />
               {index === 0 && (
                 <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                   Primary
                 </span>
               )}
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                 <div className="flex gap-1">
                   {index > 0 && (
                     <Button
                       type="button"
                       variant="secondary"
                       size="sm"
                       onClick={() => moveImage(index, index - 1)}
                       title="Move left"
                     >
                       ←
                     </Button>
                   )}
                   {index < images.length - 1 && (
                     <Button
                       type="button"
                       variant="secondary"
                       size="sm"
                       onClick={() => moveImage(index, index + 1)}
                       title="Move right"
                     >
                       →
                     </Button>
                   )}
                 </div>
                 <Button
                   type="button"
                   variant="destructive"
                   size="sm"
                   onClick={() => handleRemove(index)}
                 >
                   <X className="h-4 w-4 mr-1" />
                   Remove
                 </Button>
               </div>
             </div>
           ))}
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
               <span className="text-sm text-muted-foreground">Click to upload images</span>
               <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB each. Multiple files allowed.</span>
             </>
           )}
         </div>
       )}
 
       {isUploading && images.length > 0 && (
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
           <Loader2 className="h-4 w-4 animate-spin" />
           Uploading...
         </div>
       )}
 
       <input
         ref={fileInputRef}
         type="file"
         accept="image/*"
         multiple
         onChange={handleFileSelect}
         className="hidden"
       />
 
       <p className="text-xs text-muted-foreground">
         The first image will be used as the primary image on product cards. Drag images to reorder.
       </p>
     </div>
   );
 };
 
 export default ProductGalleryUpload;