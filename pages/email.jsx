import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

function Email() {
  const [returnTypes, setReturnTypes] = useState(null);

  const handleFetchAutomation = async () => {
    const {
      data: { replyTypes },
    } = await supabase
      .from('tokens')
      .select('replyTypes')
      .eq('email', 'rm2932002@gmail.com')
      .single();
    setReturnTypes(replyTypes);
  };

  const handleWatch = async () => {
    await fetch('/api/watch').then((res) => res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setNickname for the user
  };

  useEffect(() => {
    handleFetchAutomation();
  }, []);

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
