import { useState } from 'react';
import SEO from '../components/SEO';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

async function generateEmail() {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'davinci',
    prompt: 'Say this is a test',
    max_tokens: 10,
    temperature: 0.9,
  });
  console.log(response);
}

export default function Home() {
  const [emailType, setEmailType] = useState('');
  const onSubmit = (e) => {
    e.preventDefault();
    generateEmail();
  };
  return (
    <>
      <SEO />
      <h1>Email Trigger</h1>
      <form onSubmit={onSubmit}>
        <input type='text' placeholder='Enter your text here' />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
}
