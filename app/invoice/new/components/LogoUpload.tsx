'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface LogoUploadProps {
  onLogoUpdate?: (url: string | null) => void;
}

interface SessionUser {
  logoUrl?: string | null;
  name?: string | null;
  email?: string | null;
}

export default function LogoUpload({ onLogoUpdate }: LogoUploadProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    const user = session?.user as SessionUser;
    if (user?.logoUrl) {
      setLogoUrl(user.logoUrl);
    }
  }, [session]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Only PNG, JPG, and SVG files are allowed');
      return;
    }

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
      
      await updateSession({
        user: {
          ...session?.user,
          logoUrl: data.logoUrl,
        },
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!logoUrl) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/upload/logo', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove logo');
      }

      setLogoUrl(null);
      onLogoUpdate?.(null);
      
      await updateSession({
        user: {
          ...session?.user,
          logoUrl: null,
        },
      });

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
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
              src={logoUrl}
              alt="Company Logo"
              fill
              className="object-contain rounded border border-gray-200"
            />
          </div>
        ) : (
          <div className="h-20 w-20 flex-shrink-0 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 bg-gray-50">
            <span className="text-xs">Logo</span>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <label className="cursor-pointer inline-block">
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleUpload}
              className="hidden"
              disabled={loading}
            />
            <span className={`px-4 py-2 text-sm rounded transition-colors ${
              loading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
            }`}>
              {loading ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
            </span>
          </label>
          
          {logoUrl && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                loading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Remove Logo
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {error}
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>Supported formats: PNG, JPG, SVG (max 2MB)</p>
      </div>
    </div>
  );
}