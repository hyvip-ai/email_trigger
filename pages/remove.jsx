import Image from 'next/image';
import React from 'react';

function Remove() {
  return (
    <div className='remove'>
      <h2>Follow the instructions to remove access</h2>
      <br />
      <ul>
        <li>
          Open the{' '}
          <a href='https://myaccount.google.com/permissions'>
            Google Permission
          </a>{' '}
          page to check if you have given access to our app or not
          <br />
          <br />
        </li>
        <li>
          If you have given access to my app it will appear in this manner{' '}
          <br />
          <br />
          <Image
            src='/permissions.png'
            alt='permission_page'
            height={84}
            width={600}
          />
          <br />
          <br />
        </li>
        <li>
          Simply click on that and a dropdown like this will open up
          <br />
          <br />
          <Image
            src='/permission_remove.png'
            alt='permission_remove'
            height={257}
            width={384}
          />
          <br />
          <br />
        </li>
        <li>
          Simply click on the remove button and all the access will be revoked
          from your gmail account
          <br />
          <br />
        </li>
        <li>
          Do you know whats the best part? you can join back at any time, you
          just have to enroll in the app again and give us the access back
        </li>
      </ul>
    </div>
  );
}

export default Remove;
