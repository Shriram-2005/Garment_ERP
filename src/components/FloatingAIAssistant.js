"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const supabase = createClient();

  useEffect(() => {
    // Welcome message
    setMessages([
      { role: "assistant", content: "Hello! I am your AI assistant. How can I help you today?" }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Get session to pass auth to API
      const { data: { session } } = await supabase.auth.getSession();
      
      // Filter out the initial welcome message from the history to avoid Gemini API errors
      // since Gemini requires history to start with a 'user' message or be empty.
      const apiHistory = messages.filter((msg, idx) => !(idx === 0 && msg.role === 'assistant'));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ message: userMessage, history: apiHistory }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error while processing your request." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              width: '380px',
              height: '500px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--card-shadow)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-tertiary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>auto_awesome</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: 'var(--text-primary)' }}>Garment AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-primary)' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: msg.role === 'user' ? '#000' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                  border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                  maxWidth: '85%',
                  fontSize: '0.95rem',
                  lineHeight: '1.4'
                }}>
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--accent)', fontSize: '0.9rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite', fontSize: '18px' }}>sync</span>
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  style={{ 
                    flex: 1, 
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '24px',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    opacity: loading || !input.trim() ? 0.5 : 1
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          border: 'none',
          boxShadow: 'var(--card-shadow)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
          {isOpen ? 'close' : 'auto_awesome'}
        </span>
      </button>
    </div>
  );
}
