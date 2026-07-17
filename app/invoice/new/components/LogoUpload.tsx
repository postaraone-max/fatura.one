'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/auth';

interface LogoUploadProps {
  onLogoUpdate?: (url: string | null) => void;
}

export default function LogoUpload({ onLogoUpdate }: LogoUploadProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  useEffect(() => {
    if (session?.user?.logoUrl) {
      setLogoUrl(session.user.logoUrl);
    }
  }, [session]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setLogoUrl(data.logoUrl);
      onLogoUpdate?.(data.logoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload/logo', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove logo');
      }

      setLogoUrl(null);
      onLogoUpdate?.(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {logoUrl ? (
          <div className="relative h-20 w-20">
            <Image
              src={logoUrl}
              alt="Company Logo"
              fill
              className="object-contain rounded border"
            />
          </div>
        ) : (
          <div className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center text-gray-400">
            Logo
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleUpload}
              className="hidden"
              disabled={loading}
            />
            <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm disabled:opacity-50">
              {loading ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
            </span>
          </label>
          
          {logoUrl && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
            >
              Remove Logo
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="text-sm text-gray-500">
        <p>Supported formats: PNG, JPG, SVG (max 2MB)</p>
      </div>
    </div>
  );
}