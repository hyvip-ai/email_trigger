import React, { useState } from 'react';
import OpenAI from 'openai-api';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

// TODO: use embedding for comparing text

function Email() {
  const [state, setState] = useState('');

  const handleWatch = async () => {
    await fetch('/api/watch').then((res) => res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gptResponse = await openai.complete({
      engine: 'davinci',
      prompt: `Write me a professionally sounding email\n\nDear`,
      maxTokens: 50,
      temperature: 0.7,
      top_p: 1,
      n: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      bestOf: 1,
      stream: false,
    });

    console.log(gptResponse.data.choices);
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
