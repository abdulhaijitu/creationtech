import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface PortfolioProject {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string | null;
  client_en: string | null;
  client_bn: string | null;
  description_en: string | null;
  description_bn: string | null;
  category: string | null;
  tags: string[];
  result_en: string | null;
  result_bn: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
}

const AdminPortfolio = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    title_en: '',
    title_bn: '',
    client_en: '',
    client_bn: '',
    description_en: '',
    description_bn: '',
    category: '',
    tags: '',
    result_en: '',
    result_bn: '',
    image_url: '',
    is_featured: false,
    is_active: true,
  });

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects((data || []).map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] })));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({ title: 'Error', description: 'Failed to load projects', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateDialog = () => {
    setSelectedProject(null);
    setFormData({
      slug: '', title_en: '', title_bn: '', client_en: '', client_bn: '',
      description_en: '', description_bn: '', category: '', tags: '',
      result_en: '', result_bn: '', image_url: '', is_featured: false, is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: PortfolioProject) => {
    setSelectedProject(project);
    setFormData({
      slug: project.slug,
      title_en: project.title_en,
      title_bn: project.title_bn || '',
      client_en: project.client_en || '',
      client_bn: project.client_bn || '',
      description_en: project.description_en || '',
      description_bn: project.description_bn || '',
      category: project.category || '',
      tags: project.tags.join(', '),
      result_en: project.result_en || '',
      result_bn: project.result_bn || '',
      image_url: project.image_url || '',
      is_featured: project.is_featured,
      is_active: project.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.slug || !formData.title_en) {
      toast({ title: 'Validation Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const projectData = {
        slug: formData.slug,
        title_en: formData.title_en,
        title_bn: formData.title_bn || null,
        client_en: formData.client_en || null,
        client_bn: formData.client_bn || null,
        description_en: formData.description_en || null,
        description_bn: formData.description_bn || null,
        category: formData.category || null,
        tags: tagsArray,
        result_en: formData.result_en || null,
        result_bn: formData.result_bn || null,
        image_url: formData.image_url || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      if (selectedProject) {
        const { error } = await supabase.from('portfolio_projects').update(projectData).eq('id', selectedProject.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        const { error } = await supabase.from('portfolio_projects').insert({ ...projectData, display_order: projects.length });
        if (error) throw error;
        toast({ title: 'Success', description: 'Project created successfully' });
      }

      setIsDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save project', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      const { error } = await supabase.from('portfolio_projects').delete().eq('id', selectedProject.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Project deleted successfully' });
      setIsDeleteDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete project', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground">Manage your portfolio projects</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
          ) : projects.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No projects yet.</CardContent></Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{project.title_en}</h3>
                      {project.is_featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    {project.category && <Badge variant="outline" className="mt-1">{project.category}</Badge>}
                    <p className="text-sm text-muted-foreground">/{project.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${project.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {project.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedProject(project); setIsDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (English) *</Label>
                <Input id="title_en" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_bn">Title (Bangla)</Label>
                <Input id="title_bn" value={formData.title_bn} onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })} className="font-bangla" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_en">Client (English)</Label>
                <Input id="client_en" value={formData.client_en} onChange={(e) => setFormData({ ...formData, client_en: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_bn">Client (Bangla)</Label>
                <Input id="client_bn" value={formData.client_bn} onChange={(e) => setFormData({ ...formData, client_bn: e.target.value })} className="font-bangla" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">Description (English)</Label>
              <Textarea id="description_en" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="React, Node.js, AWS" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result_en">Result (English)</Label>
              <Input id="result_en" value={formData.result_en} onChange={(e) => setFormData({ ...formData, result_en: e.target.value })} placeholder="200% increase in sales" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : selectedProject ? 'Update' : 'Create'}</Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isDeleteDialogOpen && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedProject?.title_en}"?</AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AdminLayout>
  );
};

export default AdminPortfolio;
