import React, { useState, useEffect } from 'react';

export function ProfileIndicator() {
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get('activeProfileName', (result) => {
      setProfileName((result['activeProfileName'] as string) || null);
    });

    const handler = (changes: Record<string, chrome.storage.StorageChange>) => {
      if ('activeProfileName' in changes) {
        setProfileName((changes['activeProfileName'].newValue as string) || null);
      }
    };
    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }, []);

  if (!profileName) return null;

  return (
    <div
      className="text-xs text-gray-500 px-3 py-1 flex items-center gap-1"
      data-testid="profile-indicator"
    >
      <span>📍</span>
      <span>{profileName}</span>
    </div>
  );
}
