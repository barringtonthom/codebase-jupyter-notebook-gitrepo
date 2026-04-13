import { useState } from 'react';
import { Send, Copy, Check, Mail, Sparkles, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function EmailWriterApp() {
  const [rawThoughts, setRawThoughts] = useState('');
  const [tone, setTone] = useState('professional');
  const [contextEmail, setContextEmail] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showContext, setShowContext] = useState(false);

  const tones = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'warm', label: 'Warm', emoji: '🤝' },
    { value: 'concise', label: 'Concise', emoji: '⚡' },
    { value: 'formal', label: 'Formal', emoji: '🎩' },
    { value: 'assertive', label: 'Assertive', emoji: '🎯' },
    { value: 'persuasive', label: 'Persuasive', emoji: '🔥' },
  ];

  // Context presets relevant to Barrington's actual use cases
  const quickContexts = [
    { label: 'IT Job Follow-up', text: 'Following up on a job application or interview for an IT/sysadmin role in Broward County or remote.' },
    { label: 'Client – I Art Manny', text: 'Communicating with a client or prospect for I Art Manny LLC.' },
    { label: 'Melody Curls Outreach', text: 'Reaching out to a retailer, influencer, or partner for Melody Curls beauty brand.' },
    { label: 'Vendor / Contractor', text: 'Corresponding with a vendor, supplier, or contractor.' },
  ];

  const generateEmail = async () => {
    if (!rawThoughts.trim()) return;
    setIsLoading(true);
    try {
      const ctxPart = contextEmail.trim()
        ? `\n\nContext / email being replied to:\n"${contextEmail}"\n`
        : '';

      const prompt = `You are an expert email writer helping Barrington, an IT professional, entrepreneur (I Art Manny LLC, Melody Curls), and military veteran based in Broward County, FL.

Transform his raw thoughts into a polished email with a ${tone} tone.

Raw thoughts: "${rawThoughts}"${ctxPart}

Rules:
- Write ONLY the email body (no subject line, no labels, no meta-commentary)
- Tone: ${tone}
- Keep it tight, purposeful, and authentic to a results-oriented professional
- No filler phrases like "I hope this email finds you well"`;

      const response = await window.claude.complete(prompt);
      setGeneratedEmail(response.trim());
    } catch (e) {
      setGeneratedEmail('Error generating email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generateEmail();
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid #21262d', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#58a6ff,#a371f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>MailForge</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#8b949e', background: '#161b22', border: '1px solid #30363d', borderRadius: 20, padding: '2px 10px' }}>
          I Art Manny LLC
        </span>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* LEFT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Thoughts */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MessageSquare size={15} color="#58a6ff" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9' }}>Brain Dump</span>
            </div>
            <textarea
              value={rawThoughts}
              onChange={e => setRawThoughts(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Just write what you need to say — rough is fine. ⌘↵ to generate."
              style={{
                width: '100%', height: 130, background: '#0d1117', border: '1px solid #30363d',
                borderRadius: 8, padding: '10px 12px', color: '#e6edf3', fontSize: 13,
                resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6
              }}
            />
          </div>

          {/* Tone */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Sparkles size={15} color="#a371f7" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9' }}>Tone</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {tones.map(t => (
                <button key={t.value} onClick={() => setTone(t.value)} style={{
                  padding: '8px 6px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  border: tone === t.value ? '1px solid #58a6ff' : '1px solid #30363d',
                  background: tone === t.value ? 'rgba(88,166,255,0.12)' : '#0d1117',
                  color: tone === t.value ? '#58a6ff' : '#8b949e',
                  transition: 'all 0.15s'
                }}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Context Presets */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
            <button onClick={() => setShowContext(!showContext)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', cursor: 'pointer', color: '#c9d1d9', padding: 0
            }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Context (optional)</span>
              {showContext ? <ChevronUp size={14} color="#8b949e" /> : <ChevronDown size={14} color="#8b949e" />}
            </button>

            {showContext && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {quickContexts.map(q => (
                    <button key={q.label} onClick={() => setContextEmail(q.text)} style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                      border: '1px solid #30363d', background: '#0d1117', color: '#8b949e',
                      transition: 'all 0.15s'
                    }}
                      onMouseEnter={e => { e.target.style.borderColor = '#58a6ff'; e.target.style.color = '#58a6ff'; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#30363d'; e.target.style.color = '#8b949e'; }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={contextEmail}
                  onChange={e => setContextEmail(e.target.value)}
                  placeholder="Paste the email you're replying to, or describe the situation..."
                  style={{
                    width: '100%', height: 90, background: '#0d1117', border: '1px solid #30363d',
                    borderRadius: 8, padding: '10px 12px', color: '#e6edf3', fontSize: 12,
                    resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6
                  }}
                />
              </div>
            )}
          </div>

          {/* Generate */}
          <button onClick={generateEmail} disabled={isLoading || !rawThoughts.trim()} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: rawThoughts.trim() ? 'pointer' : 'not-allowed',
            background: rawThoughts.trim() ? 'linear-gradient(135deg,#238636,#2ea043)' : '#21262d',
            color: rawThoughts.trim() ? '#fff' : '#484f58',
            fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'opacity 0.2s', opacity: isLoading ? 0.7 : 1
          }}>
            {isLoading
              ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Generating...</>
              : <><Send size={14} /> Generate Email</>
            }
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* RIGHT PANEL – Output */}
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={15} color="#3fb950" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9' }}>Output</span>
            </div>
            {generatedEmail && (
              <button onClick={copyToClipboard} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                borderRadius: 6, border: '1px solid #30363d', background: '#0d1117',
                color: copied ? '#3fb950' : '#8b949e', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s'
              }}>
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            )}
          </div>

          {generatedEmail ? (
            <div style={{
              background: '#0d1117', border: '1px solid #30363d', borderRadius: 8,
              padding: '14px 16px', flex: 1, overflowY: 'auto'
            }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.75, color: '#c9d1d9', margin: 0 }}>
                {generatedEmail}
              </pre>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#484f58', gap: 10 }}>
              <Mail size={40} strokeWidth={1} />
              <span style={{ fontSize: 13 }}>Your email will appear here</span>
              <span style={{ fontSize: 11, color: '#30363d' }}>Draft your thoughts → pick a tone → generate</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
