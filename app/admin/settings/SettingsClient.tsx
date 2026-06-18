'use client';

import React, { useState } from 'react';
import { Settings, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { updateContent } from '@/app/actions/updateContent';
import { uploadImage } from '@/app/actions/uploadImage';
import toast from 'react-hot-toast';

export default function SettingsClient({ content = [] }: { content?: any[] }) {
  const findValue = (key: string) => content.find(c => c.key === key)?.value || '';

  const [settings, setSettings] = useState({
    global_company_logo: findValue('global_company_logo'),
    global_contact_phone: findValue('global_contact_phone'),
    global_location_address: findValue('global_location_address'),
    global_social_facebook: findValue('global_social_facebook'),
    global_social_instagram: findValue('global_social_instagram'),
    global_social_twitter: findValue('global_social_twitter'),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadImage(formData);
    
    if (result.success && result.url) {
      handleChange('global_company_logo', result.url);
      toast.success('Logo uploaded!');
    } else {
      toast.error(result.error || 'Failed to upload image');
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          updateContent('global', key, value)
        )
      );
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-nanohana" />
            Global Settings
          </h1>
          <p className="text-cream/60">Manage global website settings like logo, contact info, and social links.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-nanohana text-earth font-bold hover:bg-nanohana/90 transition-all shadow-lg disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-10 space-y-8">
        
        {/* Logo Section */}
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-4">Brand Logo</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
              {settings.global_company_logo ? (
                <img src={settings.global_company_logo} alt="Company Logo" className="object-contain w-full h-full p-2" />
              ) : (
                <ImageIcon className="w-10 h-10 text-white/20" />
              )}
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Upload New Logo</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  Choose File
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <span className="text-xs text-white/40">PNG, JPG, SVG up to 2MB</span>
              </div>
              <p className="text-xs text-white/40 mt-2 max-w-sm">This logo will be displayed in the header and footer of your website.</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Contact Information */}
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Contact Phone</label>
              <input
                type="text"
                value={settings.global_contact_phone}
                onChange={(e) => handleChange('global_contact_phone', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Location Address</label>
              <input
                type="text"
                value={settings.global_location_address}
                onChange={(e) => handleChange('global_location_address', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors"
                placeholder="123 Lodge Road, Mountain View"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-6">Social Media Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Facebook URL</label>
              <input
                type="text"
                value={settings.global_social_facebook}
                onChange={(e) => handleChange('global_social_facebook', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Instagram URL</label>
              <input
                type="text"
                value={settings.global_social_instagram}
                onChange={(e) => handleChange('global_social_instagram', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Twitter / X URL</label>
              <input
                type="text"
                value={settings.global_social_twitter}
                onChange={(e) => handleChange('global_social_twitter', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
