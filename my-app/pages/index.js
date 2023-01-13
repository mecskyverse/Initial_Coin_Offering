import Head from 'next/head'
import { BigNumber, Contract, providers, utils } from "ethers";
import styles from '../styles/Home.module.css'
import { useEffect, useState, useRef} from 'react'
import  Web3Modal  from "web3modal";


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const zero = BigNumber.from(0)
  const [tokensMinted, setTokensMinted] = useState(zero);
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(zero)
  const web3ModalRef = useRef();

  const getProviderOrSigner = async(needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    if(chainId !== 5){
      window.alert("Change the network to Goerli");
      throw new Error("Change the network to Goerli")
    }
    if(needSigner){
      const signer = web3Provider.getSigner();
      return signer;  
    }
    return web3Provider;
  }
  const connectWallet = async () => {
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
    }
    catch(err){
      console.error(err)
    }
  }



  useEffect(()=> {
    if(!walletConnected){
        web3ModalRef.current = new Web3Modal ({
          network:'goerli',
          provider:{},
          disableInjectedProvider:false
        })
        connectWallet();
      }
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
        {
          walletConnected ? (
            <div>
              <div className= {styles.description}>You have minted {utils.formatEther(balanceOfCryptoDevTokens)} tokens</div>
                <div>Overall {utils.formatEther(tokensMinted)}/10000 tokens have been minted</div>
                {renderButton()}
            </div>
          ):
          <button onClick={connectWallet} className={styles.button}>Connect Wallet</button>
          
        }
      </main>
    </>
  )
}
