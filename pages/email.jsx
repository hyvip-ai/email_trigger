import React, { useState } from 'react';

// TODO: use embedding for comparing text

function Email() {
  const [state, setState] = useState('');

  const handleWatch = async () => {
    await fetch('/api/watch').then((res) => res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='reply'
          onChange={(e) => setState(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
      <button onClick={handleWatch}>watch</button>
    </>
  );
}

export default Email;
