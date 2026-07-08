import React, { useEffect, useState } from 'react';
import { DollarSign, Plus } from 'lucide-react';
import { apiClient } from '../api/client';
import { Modal } from '../components/Modal';
import './DataTable.css';

export const Fees = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Form States
  const [issueData, setIssueData] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'CASH',
    reference: ''
  });

  const fetchData = async () => {
    try {
      const [invRes, stuRes] = await Promise.all([
        apiClient.get('/fees'),
        apiClient.get('/students')
      ]);
      setInvoices(invRes.data);
      setStudents(stuRes.data);
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/fees/invoice', {
        studentId: issueData.studentId,
        amount: parseFloat(issueData.amount),
        dueDate: issueData.dueDate,
        description: issueData.description
      });
      setIsIssueModalOpen(false);
      setIssueData({ studentId: '', amount: '', dueDate: '', description: '' });
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to issue invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/fees/payment', {
        invoiceId: selectedInvoice.id,
        amount: parseFloat(paymentData.amount),
        method: paymentData.method,
        reference: paymentData.reference
      });
      setIsPayModalOpen(false);
      setSelectedInvoice(null);
      setPaymentData({ amount: '', method: 'CASH', reference: '' });
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    const amountPaid = invoice.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    const remaining = invoice.amount - amountPaid;
    setPaymentData({ ...paymentData, amount: remaining.toString() });
    setIsPayModalOpen(true);
  };

  return (
    <div>
      <div className="table-container glass">
        <div className="table-header-actions">
          <h2>Fee Invoices</h2>
          <button className="primary-btn" onClick={() => setIsIssueModalOpen(true)}>
            <Plus size={18} /> Issue Invoice
          </button>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const amountPaid = invoice.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
              const isPaid = invoice.status === 'PAID';
              
              return (
                <tr key={invoice.id}>
                  <td>
                    <div className="user-name">
                      {invoice.student?.user?.profile?.firstName} {invoice.student?.user?.profile?.lastName}
                    </div>
                    <div className="user-email">{invoice.student?.admissionNo}</div>
                  </td>
                  <td>{invoice.description}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600' }}>
                    ${invoice.amount} 
                    {amountPaid > 0 && !isPaid && <span style={{fontSize: '0.75rem', color: '#64748b', display: 'block'}}>Paid: ${amountPaid}</span>}
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                      backgroundColor: isPaid ? '#dcfce7' : '#fef9c3',
                      color: isPaid ? '#166534' : '#854d0e'
                    }}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    {!isPaid && (
                      <button 
                        onClick={() => openPaymentModal(invoice)}
                        style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Record Payment
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue New Invoice">
        <form onSubmit={handleIssueInvoice}>
          <div className="form-group">
            <label>Select Student</label>
            <select 
              required 
              value={issueData.studentId} 
              onChange={e => setIssueData({...issueData, studentId: e.target.value})}
              style={{ padding: '10px 14px', border: '1px solid var(--surface-200)', borderRadius: 'var(--radius-md)' }}
            >
              <option value="">-- Choose Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.user?.profile?.firstName} {s.user?.profile?.lastName} ({s.admissionNo})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description (e.g., Term 1 Tuition)</label>
            <input required value={issueData.description} onChange={e => setIssueData({...issueData, description: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input required type="number" step="0.01" value={issueData.amount} onChange={e => setIssueData({...issueData, amount: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input required type="date" value={issueData.dueDate} onChange={e => setIssueData({...issueData, dueDate: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Issuing...' : 'Issue Invoice'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Record Payment">
        <form onSubmit={handleRecordPayment}>
          <div className="form-group">
            <label>Payment Amount ($)</label>
            <input required type="number" step="0.01" value={paymentData.amount} onChange={e => setPaymentData({...paymentData, amount: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select 
              required 
              value={paymentData.method} 
              onChange={e => setPaymentData({...paymentData, method: e.target.value})}
              style={{ padding: '10px 14px', border: '1px solid var(--surface-200)', borderRadius: 'var(--radius-md)' }}
            >
              <option value="CASH">Cash</option>
              <option value="CHECK">Check</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Reference Note (Optional)</label>
            <input value={paymentData.reference} onChange={e => setPaymentData({...paymentData, reference: e.target.value})} placeholder="Check #12345" />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
