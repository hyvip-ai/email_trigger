import React from 'react';

function Email() {
  const handleWatch = async () => {
    await fetch('/api/watch').then((res) => res.json());
  };

  const handleDraft = async () => {
    const res = await fetch('/api/mostRecent').then((res) => res.json());
    console.log(res);
  };

  return (
    <>
      <button onClick={handleWatch}>watch</button>
      {/* <button onClick={handleDraft}>Draft</button> */}
      <button onClick={handleDraft}>Draft</button>
    </>
  );
}

export default Email;
