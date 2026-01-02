
import React, { useState } from 'react';
import Header from './components/Header';
import ContextForm from './components/ContextForm';
import ConversationView from './components/ConversationView';
import SelectionSummary from './components/SelectionSummary';
import { ApplicationState, UserContext, ChatMessage, EditType } from './types';
import { queryCopilot } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<ApplicationState>(ApplicationState.SETUP);
  const [context, setContext] = useState<UserContext | null>(null);
  const [partialContext, setPartialContext] = useState<Partial<UserContext>>({});
  const [initialQuery, setInitialQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConsultingLoading, setIsConsultingLoading] = useState(false);
  const [editType, setEditType] = useState<EditType | null>(null);

  const handleContextComplete = (newContext: UserContext) => {
    if (appState === ApplicationState.EDITING && context) {
      const changes: string[] = [];
      if (context.language !== newContext.language) changes.push(`Language changed to ${newContext.language}`);
      if (context.district !== newContext.district || context.village !== newContext.village) {
        changes.push(`Location adjusted to ${newContext.village}, ${newContext.district}`);
      }
      if (context.intent !== newContext.intent || context.cropOrTask !== newContext.cropOrTask) {
        changes.push(`Investigation focus shifted to ${newContext.cropOrTask} (${newContext.intent})`);
      }

      const updateMsg: ChatMessage = { 
        role: 'system', 
        text: `SYSTEM UPDATE: Parameters modified. ${changes.join('. ')}`,
        isUpdate: true 
      };
      
      setMessages(prev => [...prev, updateMsg]);
      setContext(newContext);
      setAppState(ApplicationState.CONSULTING);
      
      handleFollowUp("Please provide an updated assessment based on these new parameters.");
    } else {
      setContext(newContext);
      setAppState(ApplicationState.IDLE);
    }
  };

  const handlePartialUpdate = (newPartial: Partial<UserContext>) => {
    setPartialContext(prev => ({ ...prev, ...newPartial }));
  };

  const handleFirstExecute = async () => {
    if (!initialQuery.trim() || !context) return;
    
    setAppState(ApplicationState.LOADING);
    setError(null);
    
    try {
      const userMsg: ChatMessage = { role: 'user', text: initialQuery };
      const modelMsg = await queryCopilot(initialQuery, context, []);
      
      setMessages([userMsg, modelMsg]);
      setAppState(ApplicationState.CONSULTING);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please retry.');
      setAppState(ApplicationState.IDLE);
    }
  };

  const handleFollowUp = async (query: string) => {
    if (!context || isConsultingLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setIsConsultingLoading(true);
    
    try {
      const modelMsg = await queryCopilot(query, context, messages.filter(m => m.role !== 'system'));
      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      setError(err.message || 'The network timed out. Retrying...');
    } finally {
      setIsConsultingLoading(false);
    }
  };

  const startEdit = (type: EditType) => {
    if (type === 'query' && messages.length > 0) {
      setInitialQuery(messages[0].role === 'user' ? messages[0].text : '');
      setAppState(ApplicationState.IDLE);
    } else {
      setEditType(type);
      setAppState(ApplicationState.EDITING);
    }
  };

  const resetConsultation = () => {
    setMessages([]);
    setInitialQuery('');
    setAppState(ApplicationState.IDLE);
    setError(null);
  };

  const summaryVisible = !!partialContext.language;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      <Header />
      
      {/* Persistent Selection Summary Bar */}
      <SelectionSummary 
        context={appState === ApplicationState.SETUP ? partialContext : context || {}} 
        onEdit={startEdit} 
        visible={summaryVisible}
      />

      <main className="px-4 md:px-8 pt-6 pb-12">
        {appState === ApplicationState.SETUP && (
          <ContextForm 
            onComplete={handleContextComplete} 
            onPartialUpdate={handlePartialUpdate}
            initialContext={context || undefined} 
          />
        )}

        {appState === ApplicationState.EDITING && (
          <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <h2 className="font-black text-sm uppercase tracking-widest">Adjust Parameters</h2>
                <button onClick={() => setAppState(ApplicationState.CONSULTING)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="p-8">
                <ContextForm 
                  onComplete={handleContextComplete} 
                  onPartialUpdate={handlePartialUpdate}
                  onCancel={() => setAppState(ApplicationState.CONSULTING)}
                  initialContext={context || undefined} 
                  editMode={editType || undefined}
                />
              </div>
            </div>
          </div>
        )}

        {context && (appState === ApplicationState.IDLE || appState === ApplicationState.LOADING) && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-8 md:p-12">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">🛡️</span>
                Verified {context.intent} Inquiry
              </h3>
              <textarea 
                value={initialQuery}
                onChange={(e) => setInitialQuery(e.target.value)}
                placeholder={`Ask about ${context.cropOrTask} in ${context.village}...`}
                className="w-full h-44 p-6 border-2 border-slate-100 rounded-3xl bg-slate-50 focus:border-emerald-500 focus:bg-white outline-none text-slate-700 font-bold text-lg resize-none transition-all placeholder:text-slate-300 shadow-inner"
                disabled={appState === ApplicationState.LOADING}
              />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-black border-2 border-red-100 flex items-center gap-3">
                  <span>❌</span> {error}
                </div>
              )}

              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest max-w-sm leading-relaxed text-center md:text-left">
                  Initiating evidence-grounded search for {context.village}. IMD bulletins and state data sources linked.
                </p>
                <button 
                  onClick={handleFirstExecute}
                  disabled={appState === ApplicationState.LOADING || !initialQuery.trim()}
                  className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4 text-sm tracking-widest ${
                    appState === ApplicationState.LOADING 
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {appState === ApplicationState.LOADING ? 'VERIFYING...' : 'COMMENCE VERIFICATION'}
                </button>
              </div>
            </div>

            {appState === ApplicationState.LOADING && (
              <div className="mt-12 text-center animate-pulse space-y-3">
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                </div>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Grounding Local Parameters</p>
              </div>
            )}
          </div>
        )}

        {appState === ApplicationState.CONSULTING && context && (
          <ConversationView 
            messages={messages} 
            context={context} 
            onFollowUp={handleFollowUp}
            onReset={resetConsultation}
            onEdit={startEdit}
            isLoading={isConsultingLoading}
          />
        )}
      </main>
    </div>
  );
};

export default App;
