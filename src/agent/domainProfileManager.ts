const KEY_PROFILES = 'domainProfiles';
const KEY_ACTIVE = 'activeProfileName';

export interface DomainProfile {
  id: string;
  display_name: string;
  domain_pattern: string;
  default_schema?: object;
  system_prompt_addendum?: string;
  hints?: string;
  enabled: boolean;
}

export function globToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const regexStr = escaped
    .replace(/\*\*/g, '___DOUBLE___')
    .replace(/\*/g, '.*')
    .replace(/___DOUBLE___/g, '.*');
  return new RegExp(`^${regexStr}(/.*)?$`, 'i');
}

export function matchProfile(url: string, profiles: DomainProfile[]): DomainProfile | null {
  let target: string;
  try {
    const parsed = new URL(url);
    target = parsed.hostname + parsed.pathname;
  } catch {
    return null;
  }
  for (const profile of profiles) {
    if (!profile.enabled) continue;
    if (globToRegex(profile.domain_pattern).test(target)) {
      return profile;
    }
  }
  return null;
}

export class DomainProfileManager {
  private static instance: DomainProfileManager | null = null;

  static getInstance(): DomainProfileManager {
    if (!DomainProfileManager.instance) {
      DomainProfileManager.instance = new DomainProfileManager();
    }
    return DomainProfileManager.instance;
  }

  async saveProfile(profile: DomainProfile): Promise<void> {
    const profiles = await this._loadAll();
    const idx = profiles.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      profiles[idx] = profile;
    } else {
      profiles.push(profile);
    }
    await chrome.storage.local.set({ [KEY_PROFILES]: profiles });
  }

  async getProfile(id: string): Promise<DomainProfile | null> {
    const profiles = await this._loadAll();
    return profiles.find(p => p.id === id) ?? null;
  }

  async listProfiles(): Promise<DomainProfile[]> {
    return this._loadAll();
  }

  async deleteProfile(id: string): Promise<void> {
    const profiles = await this._loadAll();
    await chrome.storage.local.set({ [KEY_PROFILES]: profiles.filter(p => p.id !== id) });
  }

  async matchProfileForUrl(url: string): Promise<DomainProfile | null> {
    const profiles = await this._loadAll();
    return matchProfile(url, profiles);
  }

  async setActiveProfileName(name: string | null): Promise<void> {
    await chrome.storage.local.set({ [KEY_ACTIVE]: name ?? '' });
  }

  async getActiveProfileName(): Promise<string | null> {
    const result = await chrome.storage.local.get(KEY_ACTIVE);
    return (result[KEY_ACTIVE] as string) || null;
  }

  private async _loadAll(): Promise<DomainProfile[]> {
    const result = await chrome.storage.local.get(KEY_PROFILES);
    return (result[KEY_PROFILES] as DomainProfile[]) ?? [];
  }
}
