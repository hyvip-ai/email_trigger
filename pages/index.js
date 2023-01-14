import SEO from '../components/SEO';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTokenStore } from '../store/token';
import { supabase } from '../utils/supabase';

export default function Home() {
  const router = useRouter();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth').then((res) => res.json());
    router.push(res.url);
  };

  const handleTokens = useCallback(
    async (code) => {
      const tokens = await fetch('/api/tokens', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json());
      console.log(tokens);
      setAccessToken({ ...tokens.tokens });
      await supabase.from('tokens').insert([
        {
          email: tokens.email,
          access_token: tokens.tokens.access_token,
          refresh_token: tokens.tokens.refresh_token,
        },
      ]);
      router.push(`/email`);
    },
    [router, setAccessToken]
  );

  useEffect(() => {
    if (router.query.code) {
      handleTokens(router.query.code);
    }
  }, [router, handleTokens]);

  return (
    <>
      <SEO />
      <h1 className='app_name'>Email Trigger</h1>
      <form onSubmit={handleSubmit}>
        <button type='submit' className='access'>
          Give Access
        </button>
      </form>
    </>
  );
}
