import { useState } from 'react';
import { Save, Building2, Phone, Mail, Clock, MapPin, Share2, Upload, Image, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useBusinessInfo, useUpdateBusinessInfo } from '@/hooks/useBusinessInfo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminBusinessInfo = () => {
  const { toast } = useToast();
  const { role } = useAuth();
  const { data: businessInfo, isLoading } = useBusinessInfo();
  const updateMutation = useUpdateBusinessInfo();
  const [formData, setFormData] = useState<Record<string, { value_en: string; value_bn: string }>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const canEdit = role === 'admin' || role === 'manager';

  // Initialize form data when business info loads
  const getFieldValue = (key: string, lang: 'en' | 'bn') => {
    if (formData[key]) {
      return lang === 'en' ? formData[key].value_en : formData[key].value_bn;
    }
    const info = businessInfo?.find((item) => item.key === key);
    return lang === 'en' ? (info?.value_en ?? '') : (info?.value_bn ?? '');
  };

  const handleChange = (key: string, lang: 'en' | 'bn', value: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [key]: {
        value_en: lang === 'en' ? value : (prev[key]?.value_en ?? getFieldValue(key, 'en')),
        value_bn: lang === 'bn' ? value : (prev[key]?.value_bn ?? getFieldValue(key, 'bn')),
      },
    }));
  };

  const handleSave = async () => {
    try {
      const updates = Object.entries(formData).map(([key, values]) =>
        updateMutation.mutateAsync({ key, value_en: values.value_en, value_bn: values.value_bn })
      );
      await Promise.all(updates);
      setIsDirty(false);
      toast({
        title: 'Changes saved',
        description: 'Business information has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error saving changes',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSkeleton />
      </AdminLayout>
    );
  }

  const renderField = (
    key: string,
    label: string,
    type: 'input' | 'textarea' = 'input',
    placeholder?: string
  ) => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`${key}-en`}>{label} (English)</Label>
        {type === 'input' ? (
          <Input
            id={`${key}-en`}
            value={getFieldValue(key, 'en')}
            onChange={(e) => handleChange(key, 'en', e.target.value)}
            placeholder={placeholder}
            disabled={!canEdit}
          />
        ) : (
          <Textarea
            id={`${key}-en`}
            value={getFieldValue(key, 'en')}
            onChange={(e) => handleChange(key, 'en', e.target.value)}
            placeholder={placeholder}
            rows={3}
            disabled={!canEdit}
          />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${key}-bn`}>{label} (বাংলা)</Label>
        {type === 'input' ? (
          <Input
            id={`${key}-bn`}
            value={getFieldValue(key, 'bn')}
            onChange={(e) => handleChange(key, 'bn', e.target.value)}
            placeholder={placeholder}
            disabled={!canEdit}
          />
        ) : (
          <Textarea
            id={`${key}-bn`}
            value={getFieldValue(key, 'bn')}
            onChange={(e) => handleChange(key, 'bn', e.target.value)}
            placeholder={placeholder}
            rows={3}
            disabled={!canEdit}
          />
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Business Information"
        description="Manage your company contact details, address, and social links"
        action={
          canEdit && (
            <Button onClick={handleSave} disabled={!isDirty || updateMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          )
        }
      />

      {!canEdit && (
        <div className="mb-4 rounded-lg border border-muted bg-muted/50 p-3 text-sm text-muted-foreground">
          You have read-only access to this section.
        </div>
      )}

      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contact" className="gap-2">
            <Building2 className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            Social Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Details
              </CardTitle>
              <CardDescription>Basic company information displayed across the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderField('company_name', 'Company Name')}
              {renderField('website', 'Website', 'input', 'www.yourcompany.com')}
              
              {/* Company Logo Upload */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <p className="text-xs text-muted-foreground">Used in PDF proposals, invoices, and documents</p>
                <div className="flex items-start gap-4">
                  {getFieldValue('company_logo', 'en') ? (
                    <div className="relative group">
                      <img 
                        src={getFieldValue('company_logo', 'en')} 
                        alt="Company Logo" 
                        className="h-16 w-16 object-contain rounded border bg-white p-1"
                      />
                      {canEdit && (
                        <button
                          onClick={() => {
                            handleChange('company_logo', 'en', '');
                            handleChange('company_logo', 'bn', '');
                            setIsDirty(true);
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded border border-dashed flex items-center justify-center bg-muted/50">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  {canEdit && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUploadingLogo}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/png,image/jpeg,image/svg+xml,image/webp';
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            if (file.size > 2 * 1024 * 1024) {
                              toast({ title: 'File too large', description: 'Logo must be under 2MB', variant: 'destructive' });
                              return;
                            }
                            setIsUploadingLogo(true);
                            try {
                              const ext = file.name.split('.').pop();
                              const filePath = `logo.${ext}`;
                              const { error: uploadError } = await supabase.storage
                                .from('company-assets')
                                .upload(filePath, file, { upsert: true });
                              if (uploadError) throw uploadError;
                              const { data: urlData } = supabase.storage
                                .from('company-assets')
                                .getPublicUrl(filePath);
                              const url = urlData.publicUrl + '?t=' + Date.now();
                              handleChange('company_logo', 'en', url);
                              handleChange('company_logo', 'bn', url);
                              setIsDirty(true);
                              toast({ title: 'Logo uploaded', description: 'Remember to save changes.' });
                            } catch (err: any) {
                              toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
                            } finally {
                              setIsUploadingLogo(false);
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG, WebP (max 2MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Phone Numbers
              </CardTitle>
              <CardDescription>Contact phone numbers for your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderField('phone_primary', 'Primary Phone', 'input', '+880 1XXX-XXXXXX')}
              {renderField('phone_secondary', 'Secondary Phone', 'input', '+880 2-XXXXXXXX')}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Addresses
              </CardTitle>
              <CardDescription>Email addresses for different purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderField('email_primary', 'Primary Email', 'input', 'info@company.com')}
              {renderField('email_support', 'Support Email', 'input', 'support@company.com')}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
              <CardDescription>When your business is open</CardDescription>
            </CardHeader>
            <CardContent>
              {renderField('business_hours', 'Business Hours', 'input', 'Sun - Thu: 9:00 AM - 6:00 PM')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Office Address
              </CardTitle>
              <CardDescription>Physical location of your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderField('address', 'Full Address', 'textarea', 'Enter your full office address')}
              {renderField('map_embed', 'Map Embed URL / Coordinates', 'input', 'Google Maps embed URL or coordinates')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>Links to your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={getFieldValue('social_facebook', 'en')}
                    onChange={(e) => handleChange('social_facebook', 'en', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter / X</Label>
                  <Input
                    id="social_twitter"
                    value={getFieldValue('social_twitter', 'en')}
                    onChange={(e) => handleChange('social_twitter', 'en', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={getFieldValue('social_linkedin', 'en')}
                    onChange={(e) => handleChange('social_linkedin', 'en', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={getFieldValue('social_instagram', 'en')}
                    onChange={(e) => handleChange('social_instagram', 'en', e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminBusinessInfo;
