import React, { useState, useEffect, useRef } from 'react';
import { ConfigManager } from '../background/configManager';
import { useLang } from '../i18n';
import { TokenTrackingService } from '../tracking/tokenTrackingService';
import { ApprovalRequest } from './components/ApprovalRequest';
import { MessageDisplay } from './components/MessageDisplay';
import { OutputHeader } from './components/OutputHeader';
import { PromptForm } from './components/PromptForm';
import { ProviderSelector } from './components/ProviderSelector';
import { TabStatusBar } from './components/TabStatusBar';
import { useChromeMessaging } from './hooks/useChromeMessaging';
import { useMessageManagement } from './hooks/useMessageManagement';
import { useTabManagement } from './hooks/useTabManagement';
import { QuickActions } from './components/QuickActions';
import { TaskHistory } from './components/TaskHistory';
import { useTaskHistory } from './hooks/useTaskHistory';

export function SidePanel() {
  const { t } = useLang();

  // State for tab status
  const [tabStatus, setTabStatus] = useState<'attached' | 'detached' | 'unknown' | 'running' | 'idle' | 'error'>('unknown');

  // State for approval requests
  const [approvalRequests, setApprovalRequests] = useState<Array<{
    requestId: string;
    toolName: string;
    toolInput: string;
    reason: string;
  }>>([]);

  // State to track if any LLM providers are configured
  const [hasConfiguredProviders, setHasConfiguredProviders] = useState<boolean>(false);

  // Check if any providers are configured when component mounts
  useEffect(() => {
    const checkProviders = async () => {
      const configManager = ConfigManager.getInstance();
      const providers = await configManager.getConfiguredProviders();
      setHasConfiguredProviders(providers.length > 0);
    };

    checkProviders();

    // Listen for storage changes directly — more reliable than runtime messages in MV3
    const handleStorageChange = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'sync' && (
        'openaiCompatibleApiKey' in changes ||
        'openaiCompatibleBaseUrl' in changes ||
        'modelProfiles' in changes
      )) {
        checkProviders();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Keep runtime message listener as fallback
    const handleMessage = (message: any) => {
      if (message.action === 'providerConfigChanged') {
        checkProviders();
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Use custom hooks to manage state and functionality
  const {
    tabId,
    windowId,
    tabTitle,
    setTabTitle
  } = useTabManagement();

  const {
    messages,
    streamingSegments,
    isStreaming,
    isProcessing,
    setIsProcessing,
    outputRef,
    addMessage,
    addSystemMessage,
    updateStreamingChunk,
    finalizeStreamingSegment,
    startNewSegment,
    completeStreaming,
    clearMessages,
    currentSegmentId
  } = useMessageManagement();

  const { history: taskHistory, addTask, clearHistory: clearTaskHistory } = useTaskHistory();

  // Heartbeat interval for checking agent status
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      // Request agent status
      chrome.runtime.sendMessage({
        action: 'checkAgentStatus',
        tabId,
        windowId
      });
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [isProcessing, tabId, windowId]);

  // Handlers for approval requests
  const handleApprove = (requestId: string) => {
    // Send approval to the background script
    approveRequest(requestId);
    // Remove the request from the list
    setApprovalRequests(prev => prev.filter(req => req.requestId !== requestId));
    // Add a system message to indicate approval
    addSystemMessage(`✅ Approved action: ${requestId}`);
  };

  const handleReject = (requestId: string) => {
    // Send rejection to the background script
    rejectRequest(requestId);
    // Remove the request from the list
    setApprovalRequests(prev => prev.filter(req => req.requestId !== requestId));
    // Add a system message to indicate rejection
    addSystemMessage(`❌ Rejected action: ${requestId}`);
  };

  // Set up Chrome messaging with callbacks
  const {
    executePrompt,
    cancelExecution,
    clearHistory,
    approveRequest,
    rejectRequest
  } = useChromeMessaging({
    tabId,
    windowId,
    onUpdateOutput: (content) => {
      const msg: Parameters<typeof addMessage>[0] = { ...content, isComplete: true };
      if (content.type === 'llm') {
        try {
          msg.structuredResult = JSON.parse(content.content);
        } catch {
          // not JSON — no structured result
        }
      }
      addMessage(msg);
    },
    onUpdateStreamingChunk: (content) => {
      updateStreamingChunk(content.content);
    },
    onFinalizeStreamingSegment: (id, content) => {
      finalizeStreamingSegment(id, content);
    },
    onStartNewSegment: (id) => {
      startNewSegment(id);
    },
    onStreamingComplete: () => {
      completeStreaming();
    },
    onUpdateLlmOutput: (content) => {
      addMessage({ type: 'llm', content, isComplete: true });
    },
    onRateLimit: () => {
      addSystemMessage("⚠️ Rate limit reached. Retrying automatically...");
      // Ensure the UI stays in processing mode
      setIsProcessing(true);
      // Update the tab status to running
      setTabStatus('running');
    },
    onFallbackStarted: (message) => {
      addSystemMessage(message);
      // Ensure the UI stays in processing mode
      setIsProcessing(true);
      // Update the tab status to running
      setTabStatus('running');
    },
    onUpdateScreenshot: (content) => {
      addMessage({ ...content, isComplete: true });
    },
    onProcessingComplete: () => {
      setIsProcessing(false);
      completeStreaming();
      // Also update the tab status to idle to ensure the UI indicator changes
      setTabStatus('idle');
    },
    onRequestApproval: (request) => {
      // Add the request to the list
      setApprovalRequests(prev => [...prev, request]);
    },
    setTabTitle,
    // New event handlers for tab events
    onTabStatusChanged: (status, _tabId) => {
      // Update the tab status state
      setTabStatus(status);
    },
    onTargetChanged: (_tabId, _url) => {
      // We don't need to do anything here as TabStatusBar handles this
    },
    onActiveTabChanged: (oldTabId, newTabId, title, url) => {
      // Update the tab title when the agent switches tabs
      console.log(`SidePanel: Active tab changed from ${oldTabId} to ${newTabId}`);
      setTabTitle(title);

      // Add a system message to indicate the tab change
      addSystemMessage(`Switched to tab: ${title} (${url})`);
    },
    onPageDialog: (tabId, dialogInfo) => {
      // Add a system message about the dialog
      addSystemMessage(`📢 Dialog: ${dialogInfo.type} - ${dialogInfo.message}`);
    },
    onPageError: (tabId, error) => {
      // Add a system message about the error
      addSystemMessage(`❌ Page Error: ${error}`);
    },
    onAgentStatusUpdate: (status, lastHeartbeat) => {
      // Log agent status updates for debugging
      console.log(`Agent status update: ${status}, lastHeartbeat: ${lastHeartbeat}, diff: ${Date.now() - lastHeartbeat}ms`);

      // Update the tab status based on agent status
      if (status === 'running' || status === 'idle' || status === 'error') {
        setTabStatus(status);
      }

      // If agent is running, ensure UI is in processing mode
      if (status === 'running') {
        setIsProcessing(true);
      }

      // If agent is idle, ensure UI is not in processing mode
      if (status === 'idle') {
        setIsProcessing(false);
      }
    }
  });

  // Handle form submission
  const handleSubmit = async (prompt: string) => {
    addTask(prompt);
    setIsProcessing(true);
    // Update the tab status to running
    setTabStatus('running');

    // Add a system message to indicate a new prompt
    addSystemMessage(`New prompt: "${prompt}"`);

    try {
      await executePrompt(prompt);
    } catch (error) {
      console.error('Error:', error);
      addSystemMessage('Error: ' + (error instanceof Error ? error.message : String(error)));
      setIsProcessing(false);
      // Update the tab status to error
      setTabStatus('error');
    }
  };

  // Ref so the executeSkillPrompt listener always calls the latest handleSubmit
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; });

  useEffect(() => {
    const listener = (message: any) => {
      if (message.action === 'executeSkillPrompt' && message.skillTitle) {
        handleSubmitRef.current(`esegui la skill "${message.skillTitle}"`);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  // Handle cancellation - also reject any pending approval requests
  const handleCancel = () => {
    // If there are any pending approval requests, reject them all
    if (approvalRequests.length > 0) {
      // Add a system message to indicate that approvals were rejected due to cancellation
      addSystemMessage(`❌ Cancelled execution - all pending approval requests were automatically rejected`);

      // Reject each pending approval request
      approvalRequests.forEach(req => {
        rejectRequest(req.requestId);
      });

      // Clear the approval requests
      setApprovalRequests([]);
    }

    // Cancel the execution
    cancelExecution();

    // Update the tab status to idle
    setTabStatus('idle');
  };

  // Handle clearing history
  const handleClearHistory = () => {
    clearMessages();
    clearHistory();
    clearTaskHistory();

    // Reset token tracking
    const tokenTracker = TokenTrackingService.getInstance();
    tokenTracker.reset();
  };

  // Handle reflect and learn
  const handleReflectAndLearn = () => {
    // Send message to background script to trigger reflection
    chrome.runtime.sendMessage({
      action: 'reflectAndLearn',
      tabId
    });

    // Add a system message to indicate reflection is happening
    addSystemMessage("🧠 Reflecting on this session to learn useful patterns...");
  };

  // Function to navigate to the options page
  const navigateToOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-base-200">
      <header className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">{t('app.title')}</h1>
        <TabStatusBar
          tabId={tabId}
          tabTitle={tabTitle}
          tabStatus={tabStatus}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
          {t('sidepanel.tagline')}
        </p>
      </header>

      {hasConfiguredProviders ? (
        <>
          <div className="flex flex-col flex-grow gap-4 overflow-hidden md:flex-row shadow-sm">
            <div className="card bg-base-100 shadow-md flex-1 flex flex-col overflow-hidden">
              <OutputHeader
                onClearHistory={handleClearHistory}
                onReflectAndLearn={handleReflectAndLearn}
                isProcessing={isProcessing}
              />
              <div
                ref={outputRef}
                className="card-body p-3 overflow-auto bg-base-100 flex-1"
              >
                <MessageDisplay
                  messages={messages}
                  streamingSegments={streamingSegments}
                  isStreaming={isStreaming}
                />
              </div>
            </div>
          </div>

          {/* Display approval requests */}
          {approvalRequests.map(req => (
            <ApprovalRequest
              key={req.requestId}
              requestId={req.requestId}
              toolName={req.toolName}
              toolInput={req.toolInput}
              reason={req.reason}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}

          <TaskHistory history={taskHistory} onRerun={handleSubmit} />
          <PromptForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isProcessing={isProcessing}
            tabStatus={tabStatus}
          />
          <QuickActions
            executePrompt={executePrompt}
            isProcessing={isProcessing}
          />
          <ProviderSelector isProcessing={isProcessing} />
        </>
      ) : (
        <div className="flex flex-col flex-grow items-center justify-center">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">{t('sidepanel.noProvider')}</h2>
            <p className="text-gray-600 mb-4">
              {t('sidepanel.noProviderDesc')}
            </p>
            <button
              onClick={navigateToOptions}
              className="btn btn-primary"
            >
              {t('sidepanel.configureProvider')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
