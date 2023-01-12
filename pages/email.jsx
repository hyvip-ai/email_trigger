import React from 'react';
import { useTokenStore } from '../store/token';

function Email() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const handleWatch = async () => {
    const res = await fetch('/api/watch', {
      method: 'POST',
      body: JSON.stringify({ accessToken: accessToken.access_token }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());
  };

  return (
    <>
      <button onClick={handleWatch}>watch</button>
    </>
  );
}

export default Email;
