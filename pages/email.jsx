import React, { useState } from 'react';

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
          placeholder='please enter your name, that you want to attach at the end of the email (ex. regards [name])'
        />
        <button type='submit'>Submit</button>
      </form>
      <button onClick={handleWatch}>watch</button>
    </>
  );
}

export default Email;
