import React from 'react';

function Automation() {
  return (
    <form className='automation_form'>
      <div>
        <label htmlFor='name'>Automation Name</label>
        <input type='text' id='name' />
      </div>
      <div>
        <label htmlFor='subject'>For emails that are about</label>
        <input type='text' id='subject' />
      </div>
      <div>
        <label htmlFor='reply'>Reply With</label>
        <textarea id='reply' />
      </div>
    </form>
  );
}

export default Automation;
