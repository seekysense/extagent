import {
  addAttachedTab,
  removeAttachedTab,
  isTabAttached,
  setTabClosedHandler,
  setTabReloadedHandler,
  handleTabClosed,
  handleTabReloaded,
} from '../../../src/background/tabManager';

jest.mock('playwright-crx', () => ({
  crx: { start: jest.fn().mockResolvedValue({ addListener: jest.fn(), close: jest.fn() }) },
}));

jest.mock('../../../src/agent/PageContextManager', () => ({
  setCurrentPage: jest.fn(),
  resetPageContext: jest.fn(),
}));

jest.mock('../../../src/background/utils', () => ({
  logWithTimestamp: jest.fn(),
  handleError: jest.fn(),
}));

describe('tabManager - handleTabClosed / handleTabReloaded', () => {
  beforeEach(() => {
    setTabClosedHandler(null as any);
    setTabReloadedHandler(null as any);
  });

  it('handleTabClosed rimuove il tab dal set degli allegati e chiama il handler', () => {
    const closedHandler = jest.fn();
    setTabClosedHandler(closedHandler);

    addAttachedTab(999);
    expect(isTabAttached(999)).toBe(true);

    handleTabClosed(999);

    expect(isTabAttached(999)).toBe(false);
    expect(closedHandler).toHaveBeenCalledWith(999);
  });

  it('handleTabClosed non fa nulla se il tab non è allegato', () => {
    const closedHandler = jest.fn();
    setTabClosedHandler(closedHandler);

    handleTabClosed(12345);

    expect(closedHandler).not.toHaveBeenCalled();
  });

  it('handleTabReloaded chiama il handler se il tab è allegato', () => {
    const reloadedHandler = jest.fn();
    setTabReloadedHandler(reloadedHandler);

    addAttachedTab(888);
    handleTabReloaded(888);

    expect(reloadedHandler).toHaveBeenCalledWith(888);

    // cleanup
    removeAttachedTab(888);
  });
});
