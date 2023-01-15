import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { supabase } from '../utils/supabase';

function Email() {
  const router = useRouter();

  const [replyTypes, setReplyTypes] = useState([]);
  const [nickName, setNickName] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');

  const handleFetchAutomation = async () => {
    const { data } = await supabase
      .from('tokens')
      .select('nickName,replyTypes')
      .eq('email', 'rm2932002@gmail.com')
      .single();
    const modifications = Object.keys(data.replyTypes || {}).map((item) => ({
      name: item,
      subject: data.replyTypes[item].emailSubject,
      replyType: data.replyTypes[item].reply,
    }));
    setReplyTypes([...modifications]);
    setNickName(data.nickName);
  };

  const handleWatch = async () => {
    await fetch('/api/watch').then((res) => res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name can't be empty");
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/updateName', {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: { 'Content-Type': 'application/json' },
      });
      await handleWatch();
      await handleFetchAutomation();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleFetchAutomation();
  }, []);

  return (
    <>
      <div className='formContainer'>
        {nickName ? (
          <h4>Hello {nickName}</h4>
        ) : loading ? (
          <Loader />
        ) : (
          <>
            <h5>Set your name and let us handle your email</h5>
            <form onSubmit={handleSubmit}>
              <input
                id='nickName'
                type='text'
                name='reply'
                onChange={(e) => setName(e.target.value)}
                placeholder='please enter your name, that you want to attach at the end of the email (ex. regards [name])'
                style={{
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0',
                }}
                disabled={loading}
              />
              <button
                type='submit'
                style={{
                  borderTopLeftRadius: '0',
                  borderBottomLeftRadius: '0',
                }}
                disabled={loading}
              >
                Start Watching
              </button>
            </form>
          </>
        )}
      </div>
      <div className='automations'>
        <h3>Available Automations</h3>
        <table className='table table-striped table-dark'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Subject Matches to</th>
              <th>Reply Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {replyTypes.length ? (
              replyTypes.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {item.name
                      .split('_')
                      .map(
                        (item) => item.charAt(0).toUpperCase() + item.slice(1)
                      )
                      .join(' ')}
                  </td>
                  <td>{item.subject}</td>
                  <td>{item.replyType}</td>
                  <td>
                    <button className='btn btn-danger'>Delete</button>
                    &nbsp; &nbsp;
                    <button className='btn btn-info'>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className='text-center'>
                <td colSpan={5}>No Data Available</td>
              </tr>
            )}
          </tbody>
        </table>
        <button
          className='btn btn-secondary'
          onClick={() => router.push('/automation')}
        >
          Add Automation
        </button>
      </div>
      <div className='remove'>
        <h3>
          Didn&apos;t like it? want to remove all access from your gmail
          account?, click the button and follow the instructions ro remove
          access
        </h3>
        <button
          className='btn-warning btn'
          onClick={() => router.push('/remove')}
        >
          Remove Access
        </button>
      </div>
    </>
  );
}

export default Email;
