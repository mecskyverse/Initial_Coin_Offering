import Head from 'next/head'
import { BigNumber, Contract, providers, utils } from "ethers";
import styles from '../styles/Home.module.css'
import { useEffect, useState, useRef} from 'react'
import  Web3Modal  from "web3modal";
import {NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS}  from '../constants';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const zero = BigNumber.from(0)
  const [tokensMinted, setTokensMinted] = useState(zero)
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(zero)
  const [tokenAmount, setTokenAmount] = useState(zero)
  const [loading, setLoading] = useState(false);
  const [tokensToBeClaimed, setTokensToBeClaimed ]= useState(zero);

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
  const getBalanceOfCryptoDevTokens = async ()=> {
    try {
    const provider = await getProviderOrSigner();
  
    const contract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
    const signer = await getProviderOrSigner(true);
    const address = signer.getAddress();
    const balance = await contract.balanceOf(address);
    setBalanceOfCryptoDevTokens(balance);
    
    } catch (error) {
      
    }
  }
  const getTotalTokensMinted = async () =>{
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
      const _tokensMinted = await contract.totalSupply();
      setTokensMinted(_tokensMinted);

    } catch (err) {
      console.log(err);
    }
  }
//This will tell the user that how much nfts he can claim right now
  const getTokensToBeClaimed = async() => {
   try {
    const provider = await getProviderOrSigner();
    const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider)
    const signer = await getProviderOrSigner(true);
    const sender = await signer.getAddress(); 
    const balance =await contract.balanceOf(sender);
    let amount = 0;
    if(balance === 0){
      setTokensToBeClaimed(zero);
    }
    else{
      
      for(let i = 0;i<balance;i++){
          const tokenId = await contract.tokenOfOwnerByIndex(sender, i);
          const claimed = await tokenContract.tokenIdsClaimed(tokenId);
          if(!claimed) amount++;
      }
      setTokensToBeClaimed(BigNumber.from(amount));
    }
    console.log("amount "+ balance);
   } catch (err) {
    console.error(err)
   }
   
  }
  const claimCryptoDevTokens = async () =>{
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
      const tx = await tokenContract.claim();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      
      window.alert("successfully claimed Crypto dev token");
      await getBalanceOfCryptoDevTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (err) {
      console.log(err);
    }

  }
  const mintToken = async ()=> { 
  try {
    const signer = await getProviderOrSigner(true);
    const icoContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer );
    console.log("token amount is " + tokenAmount)
    const value = 0.001* tokenAmount;
    const tx = await icoContract.mint(tokenAmount, {
      value:utils.parseEther(value.toString()),
    })
    setLoading(true)
    await tx.wait();
    setLoading(false)

    window.alert("successfully minted Crypto Dev Token")
    await getBalanceOfCryptoDevTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
    
  } catch (err) {
    console.error(err);
  }
  }
  
  const renderButton = () =>{
    if(loading){
      return (
      <div>
          <button className={styles.button}>LOADING...</button>
      </div>
      )
    }
    if(!tokensToBeClaimed.eq(zero)){
      return(
        <div>
          <div className={styles.description}>
            {tokensToBeClaimed * 10} Tokens can be claimed!

          </div>
          <button className={styles.button} onClick = {claimCryptoDevTokens}>Claim</button>
        </div>
      )
    }
    return(
      <div style={{display:'flex-col'}}>
      <div>
        <input className={styles.input} type="number" placeholder='Amount Of Tokens' onChange={(e)=>setTokenAmount(BigNumber.from(e.target.value))}/>
        <button className={styles.button} style ={{marginLeft:'10px'}} disabled = {!(tokenAmount>0)} onClick={mintToken}>Mint Token</button>
      </div>

    </div>
    )
  }


  useEffect(()=> {
    if(!walletConnected){
        web3ModalRef.current = new Web3Modal ({
          network:'goerli',
          provider:{},
          disableInjectedProvider:false
        })
        connectWallet();
        getBalanceOfCryptoDevTokens();
        getTotalTokensMinted();
        getTokensToBeClaimed();
        
      }
  }, [walletConnected])
  
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
        {
          walletConnected ? (
            <div>
              <div className= {styles.description}>You have minted {utils.formatEther(balanceOfCryptoDevTokens)} tokens</div>
                <div>Overall {utils.formatEther(tokensMinted)}/10000 tokens have been minted</div>
                
            </div>
          ):
          <button onClick={connectWallet} className={styles.button}>Connect Wallet</button>
        }
        {renderButton()}
        </div>
        
        <img className={styles.image} src='./0.svg' />
      </main>
      
      <footer className={styles.footer}>Made with &#10084; by Crypto Devs</footer>
    </>
  )
}
