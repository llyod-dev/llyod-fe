import '@/styles/globals.css'
import { AppContextProvider } from '@/src/context/AppContext';
import Layout from '@/layout/Layout';


export default function App({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContextProvider>
  )
}
