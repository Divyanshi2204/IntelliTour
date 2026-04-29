import { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Send, MessageCircle, Lightbulb, AlertTriangle, Star, Info, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

const ExpertModal = ({ trip, onClose }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await api.post('/travel/ask-expert', {
        question: question.trim(),
        destination: trip.destination,
      });
      setResponse(res.data.data);
    } catch {
      toast.error('Expert unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100 shrink-0">
          <div className="p-2 bg-brand-50 rounded-xl">
            <Sparkles className="h-5 w-5 text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900">Travel Expert</h3>
            <p className="text-xs text-slate-400 truncate">Ask anything about {trip.destination}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!response && !isLoading && (
            <div className="text-center py-10">
              <div className="h-16 w-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-brand-400" />
              </div>
              <p className="text-slate-600 text-sm">
                Ask me anything about <strong>{trip.destination}</strong>
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Visa, customs, safety, best spots, local etiquette…
              </p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3 py-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-20 w-full mt-4" />
              <Skeleton className="h-4 w-3/6" />
            </div>
          )}

          {response && !isLoading && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-700 text-sm leading-relaxed">{response.answer}</p>
              </div>

              {response.tips?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-amber-500" /> Tips
                  </h4>
                  <ul className="space-y-1.5">
                    {response.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <Star className="h-3.5 w-3.5 shrink-0 mt-0.5 text-brand-400" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {response.warnings?.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <h4 className="font-semibold text-red-700 text-sm mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Warnings
                  </h4>
                  <ul className="space-y-1">
                    {response.warnings.map((w, i) => (
                      <li key={i} className="text-sm text-red-600">{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {response.recommendations?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">Recommendations</h4>
                  <div className="flex flex-wrap gap-2">
                    {response.recommendations.map((rec, i) => (
                      <span key={i} className="bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 rounded-full">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {response.note && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {response.note}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 flex gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask about ${trip.destination}…`}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpertModal;
