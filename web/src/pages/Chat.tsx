import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, MessageSquare } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

interface Contact {
  userId: string;
  name: string;
  role: string;
  avatarLetter: string;
}

export const Chat = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.userId);
      // Basic polling for demo purposes
      const interval = setInterval(() => {
        fetchMessages(selectedContact.userId);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      // Fetch both students and teachers
      const [studentsRes, teachersRes] = await Promise.all([
        apiClient.get('/students'),
        apiClient.get('/teachers')
      ]);

      const formattedContacts: Contact[] = [];
      
      studentsRes.data.forEach((s: any) => {
        if (s.userId && s.user && s.user.id !== user?.id) {
          formattedContacts.push({
            userId: s.userId,
            name: `${s.user.profile?.firstName || 'Unknown'} ${s.user.profile?.lastName || ''}`,
            role: 'Student',
            avatarLetter: s.user.profile?.firstName?.[0] || 'S'
          });
        }
      });

      teachersRes.data.forEach((t: any) => {
        if (t.userId && t.user && t.user.id !== user?.id) {
          formattedContacts.push({
            userId: t.userId,
            name: `${t.user.profile?.firstName || 'Unknown'} ${t.user.profile?.lastName || ''}`,
            role: 'Teacher',
            avatarLetter: t.user.profile?.firstName?.[0] || 'T'
          });
        }
      });

      setContacts(formattedContacts);
    } catch (e) {
      console.error('Failed to fetch contacts', e);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchMessages = async (contactUserId: string) => {
    try {
      const res = await apiClient.get(`/chat/conversation/${contactUserId}`);
      setMessages(res.data);
    } catch (e) {
      console.error('Failed to fetch messages', e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const content = newMessage;
    setNewMessage(''); // optimistic clear
    
    // Optimistic update
    const optimisticMessage = {
      id: Date.now().toString(),
      content,
      senderId: user?.id,
      receiverId: selectedContact.userId,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      await apiClient.post('/chat/send', {
        receiverId: selectedContact.userId,
        content
      });
      // Fetch fresh to get real DB IDs
      fetchMessages(selectedContact.userId);
    } catch (e) {
      console.error('Failed to send message', e);
      // Handle revert if necessary
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '24px' }}>
      
      {/* Sidebar: Contacts */}
      <div className="glass" style={{ width: '320px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--brand-500)" />
            Messages
          </h3>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loadingContacts ? (
            <div style={{ textAlign: 'center', color: 'var(--text-500)', padding: '20px' }}>Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-500)', padding: '20px' }}>No contacts found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contacts.map(contact => (
                <div 
                  key={contact.userId}
                  onClick={() => setSelectedContact(contact)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '12px', 
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedContact?.userId === contact.userId ? 'var(--brand-50)' : 'transparent',
                    border: selectedContact?.userId === contact.userId ? '1px solid var(--brand-200)' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: selectedContact?.userId === contact.userId ? 'var(--brand-500)' : 'var(--brand-100)', color: selectedContact?.userId === contact.userId ? 'white' : 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600 }}>
                    {contact.avatarLetter}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-900)' }}>{contact.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-500)' }}>{contact.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        {selectedContact ? (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600 }}>
                {selectedContact.avatarLetter}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-900)' }}>{selectedContact.name}</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-500)' }}>{selectedContact.role}</span>
              </div>
            </div>
            
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#fdfdfd', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-400)', marginTop: '40px' }}>
                  No messages yet. Say hi to {selectedContact.name.split(' ')[0]}!
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id || idx} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '70%', 
                        padding: '12px 16px', 
                        borderRadius: '16px', 
                        borderBottomRightRadius: isMine ? '4px' : '16px',
                        borderBottomLeftRadius: !isMine ? '4px' : '16px',
                        backgroundColor: isMine ? 'var(--brand-500)' : 'var(--surface-100)',
                        color: isMine ? 'white' : 'var(--text-900)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ wordBreak: 'break-word', lineHeight: '1.5' }}>{msg.content}</div>
                        <div style={{ fontSize: '11px', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid var(--surface-200)', backgroundColor: 'var(--surface-50)' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '14px 20px', borderRadius: '30px', border: '1px solid var(--surface-300)', outline: 'none', fontSize: '15px' }}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  style={{ 
                    width: '50px', height: '50px', borderRadius: '50%', border: 'none', 
                    backgroundColor: newMessage.trim() ? 'var(--brand-500)' : 'var(--surface-300)', 
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  <Send size={20} style={{ marginLeft: '2px' }} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-400)' }}>
            <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', margin: '0 0 8px', color: 'var(--text-600)' }}>Your Messages</h3>
            <p style={{ margin: 0 }}>Select a contact to start chatting</p>
          </div>
        )}
      </div>
      
    </div>
  );
};
