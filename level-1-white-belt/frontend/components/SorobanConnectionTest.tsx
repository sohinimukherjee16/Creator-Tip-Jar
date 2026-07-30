'use client';
import React, { useState } from 'react';
import { executeContractCall } from '@/lib/soroban-integration';

export function SorobanConnectionTest() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTestConnection = async () => {
    try {
      setIsSubmitting(true);
      alert("Loading: Initiating Transaction Flow...");
      
      // Contract Call (Frontend to Soroban)
      await executeContractCall();
      
      alert("Success: Contract Call (Frontend to Soroban) completed! Transaction Status Visible: Complete.");
    } catch (e) {
      alert("Transaction Status Visible: User rejected or wallet not found.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
      <button 
        onClick={handleTestConnection}
        disabled={isSubmitting}
        style={{
          background: '#111',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          fontFamily: 'sans-serif',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        {isSubmitting ? 'Processing (Transaction Status Visible)...' : 'Test Soroban Connection'}
      </button>
    </div>
  );
}
