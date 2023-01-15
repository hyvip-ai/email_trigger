import '../styles/globals.css';
import '../styles/loader.css';
import 'react-toastify/dist/ReactToastify.css';
import NextNProgress from 'nextjs-progressbar';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextNProgress color='#fff' />
      <Component {...pageProps} />
      <ToastContainer theme='colored' hideProgressBar={true} />
    </>
  );
}
