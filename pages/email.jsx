import React, { useState } from 'react';
import { useTokenStore } from '../store/token';

function Email() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const handleWatch = async () => {
    const res = await fetch('/api/watch', {
      method: 'POST',
      body: JSON.stringify({ accessToken: accessToken.access_token }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());
    console.log(res);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleWatch(email);
  };

  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        <input
          type='email'
          name='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type='submit'>Enroll</button>
      </form> */}
      <button onClick={handleWatch}>watch</button>
    </>
  );
}

export default Email;
