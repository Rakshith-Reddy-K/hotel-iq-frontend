import React from 'react';
import ConciergeChat from '../components/ConciergeChat';

const ConciergePage = () => {
  // In production, these would come from your backend/API/context
  // For now, you can use these as defaults or fetch from your admin system
  const guestData = {
    name: 'Mr. Guest',
    roomNumber: '304',
    checkInStatus: 'checked-in' // 'pending' | 'checked-in' | 'checked-out'
  };

  return (
    <ConciergeChat 
      guestName={guestData.name}
      roomNumber={guestData.roomNumber}
      checkInStatus={guestData.checkInStatus}
    />
  );
};

export default ConciergePage;