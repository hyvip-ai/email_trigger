import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Automation() {
  const [replyData, setReplyData] = useState({
    automation_name: '',
    subject: '',
    reply: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let modifiedData = {};
    modifiedData = {
      [replyData.automation_name
        .split(' ')
        .map((item) => item.toLowerCase())
        .join('_')]: {
        emailSubject: replyData.subject,
        reply: replyData.reply,
      },
    };
    console.log(modifiedData);
    setTimeout(() => {
      toast.success('New automation created successfully');
    }, 1000);
  };
  return (
    <div className='automation_form_container'>
      <h2>Create new automation</h2>
      <form className='automation_form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Automation Name</label>
          <input
            type='text'
            id='name'
            onBlur={(e) =>
              setReplyData((prev) => ({
                ...prev,
                automation_name: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label htmlFor='subject'>For emails that are about</label>
          <input
            type='text'
            id='subject'
            onBlur={(e) =>
              setReplyData((prev) => ({
                ...prev,
                subject: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label htmlFor='reply'>Reply With</label>
          <textarea
            id='reply'
            rows={6}
            onBlur={(e) =>
              setReplyData((prev) => ({
                ...prev,
                reply: e.target.value,
              }))
            }
          />
        </div>
        <button type='submit'>Create Automation</button>
      </form>
    </div>
  );
}

export default Automation;
