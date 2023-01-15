import SEO from '../components/SEO';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTokenStore } from '../store/token';
import { supabase } from '../utils/supabase';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

export default function Home() {
  const router = useRouter();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const [loading, setLoading] = useState(false);

  const handleAccess = async (e) => {
    setLoading(true);
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
      if (tokens.tokens.refresh_token) {
        console.log('Upsert table');
        await supabase.from('tokens').upsert([
          {
            email: tokens.email,
            access_token: tokens.tokens.access_token,
            refresh_token: tokens.tokens.refresh_token,
          },
        ]);
      }
      setLoading(false);
      toast.success('Gmail account connected successfully');
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
      {loading ? (
        <Loader />
      ) : (
        <button onClick={handleAccess} className='access'>
          Give Access
        </button>
      )}
    </>
  );
}
