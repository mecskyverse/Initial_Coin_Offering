import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  useEffect(()=> {

  }, [])
  return (
    <>
      <Head>
        <title>Token Dapp</title>
        <meta name="description" content="Initial Coin Offering" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs ICO</h1>
          <div className={styles.description}>This is a Decentralized token allocation dapp</div>
        </div>
      </main>
    </>
  )
}
