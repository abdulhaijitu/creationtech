import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string | null;
  excerpt_en: string | null;
  content_en: string | null;
  author_name: string | null;
  category_id: string | null;
  tags: string[];
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
  published_at: string | null;
}

interface BlogCategory {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string | null;
}

const AdminBlog = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [deleteType, setDeleteType] = useState<'post' | 'category'>('post');
  const [isSaving, setIsSaving] = useState(false);

  const [postForm, setPostForm] = useState({
    slug: '', title_en: '', title_bn: '', excerpt_en: '', content_en: '',
    author_name: '', category_id: '', tags: '', featured_image_url: '',
    meta_title: '', meta_description: '', status: 'draft',
  });

  const [categoryForm, setCategoryForm] = useState({
    slug: '', name_en: '', name_bn: '',
  });

  const fetchData = async () => {
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_categories').select('*').order('name_en'),
      ]);

      if (postsRes.error) throw postsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setPosts((postsRes.data || []).map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] })));
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreatePostDialog = () => {
    setSelectedPost(null);
    setPostForm({
      slug: '', title_en: '', title_bn: '', excerpt_en: '', content_en: '',
      author_name: '', category_id: '', tags: '', featured_image_url: '',
      meta_title: '', meta_description: '', status: 'draft',
    });
    setIsPostDialogOpen(true);
  };

  const openEditPostDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setPostForm({
      slug: post.slug,
      title_en: post.title_en,
      title_bn: post.title_bn || '',
      excerpt_en: post.excerpt_en || '',
      content_en: post.content_en || '',
      author_name: post.author_name || '',
      category_id: post.category_id || '',
      tags: post.tags.join(', '),
      featured_image_url: post.featured_image_url || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      status: post.status,
    });
    setIsPostDialogOpen(true);
  };

  const handleSavePost = async () => {
    if (!postForm.slug || !postForm.title_en) {
      toast({ title: 'Validation Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setIsSaving(true);

    try {
      const tagsArray = postForm.tags.split(',').map(t => t.trim()).filter(t => t);
      const postData = {
        slug: postForm.slug,
        title_en: postForm.title_en,
        title_bn: postForm.title_bn || null,
        excerpt_en: postForm.excerpt_en || null,
        content_en: postForm.content_en || null,
        author_id: user?.id,
        author_name: postForm.author_name || null,
        category_id: postForm.category_id || null,
        tags: tagsArray,
        featured_image_url: postForm.featured_image_url || null,
        meta_title: postForm.meta_title || null,
        meta_description: postForm.meta_description || null,
        status: postForm.status,
        published_at: postForm.status === 'published' ? new Date().toISOString() : null,
      };

      if (selectedPost) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', selectedPost.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Post updated successfully' });
      } else {
        const { error } = await supabase.from('blog_posts').insert(postData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Post created successfully' });
      }

      setIsPostDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save post', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateCategoryDialog = () => {
    setSelectedCategory(null);
    setCategoryForm({ slug: '', name_en: '', name_bn: '' });
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.slug || !categoryForm.name_en) {
      toast({ title: 'Validation Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setIsSaving(true);

    try {
      const categoryData = {
        slug: categoryForm.slug,
        name_en: categoryForm.name_en,
        name_bn: categoryForm.name_bn || null,
      };

      if (selectedCategory) {
        const { error } = await supabase.from('blog_categories').update(categoryData).eq('id', selectedCategory.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Category updated' });
      } else {
        const { error } = await supabase.from('blog_categories').insert(categoryData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Category created' });
      }

      setIsCategoryDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'post' && selectedPost) {
        const { error } = await supabase.from('blog_posts').delete().eq('id', selectedPost.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Post deleted' });
      } else if (deleteType === 'category' && selectedCategory) {
        const { error } = await supabase.from('blog_categories').delete().eq('id', selectedCategory.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Category deleted' });
      }
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name_en || 'Uncategorized';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Manage blog posts and categories</p>
        </div>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openCreatePostDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>

            {isLoading ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
            ) : posts.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No posts yet.</CardContent></Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{post.title_en}</h3>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{getCategoryName(post.category_id)}</Badge>
                        <span className="text-xs text-muted-foreground">/{post.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditPostDialog(post)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedPost(post); setDeleteType('post'); setIsDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openCreateCategoryDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </div>

            {categories.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No categories yet.</CardContent></Card>
            ) : (
              categories.map((cat) => (
                <Card key={cat.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium">{cat.name_en}</h3>
                      <p className="text-sm text-muted-foreground">/{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(cat); setCategoryForm({ slug: cat.slug, name_en: cat.name_en, name_bn: cat.name_bn || '' }); setIsCategoryDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(cat); setDeleteType('category'); setIsDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={postForm.slug} onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={postForm.status} onValueChange={(v) => setPostForm({ ...postForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title (English) *</Label>
              <Input value={postForm.title_en} onChange={(e) => setPostForm({ ...postForm, title_en: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input value={postForm.author_name} onChange={(e) => setPostForm({ ...postForm, author_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={postForm.category_id} onValueChange={(v) => setPostForm({ ...postForm, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name_en}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={postForm.excerpt_en} onChange={(e) => setPostForm({ ...postForm, excerpt_en: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={postForm.content_en} onChange={(e) => setPostForm({ ...postForm, content_en: e.target.value })} rows={8} />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input value={postForm.tags} onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Featured Image URL</Label>
              <Input value={postForm.featured_image_url} onChange={(e) => setPostForm({ ...postForm, featured_image_url: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input value={postForm.meta_title} onChange={(e) => setPostForm({ ...postForm, meta_title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Input value={postForm.meta_description} onChange={(e) => setPostForm({ ...postForm, meta_description: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePost} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Name (English) *</Label>
              <Input value={categoryForm.name_en} onChange={(e) => setCategoryForm({ ...categoryForm, name_en: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Name (Bangla)</Label>
              <Input value={categoryForm.name_bn} onChange={(e) => setCategoryForm({ ...categoryForm, name_bn: e.target.value })} className="font-bangla" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteType === 'post' ? 'Post' : 'Category'}</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlog;
