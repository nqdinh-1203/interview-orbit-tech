import React, { useState } from "react";
import { ethers, Contract } from 'ethers';
import { TransactionResponse } from "@ethersproject/abstract-provider";

import bankAbi from "../contracts/abis/Bank.json";
import tokenAbi from "../contracts/abis/Token.json";

declare var window: any;

interface IWalletInfor {
  address: string,
  amount: number
}

export interface IRecap {
  from: string,
  to: string,
  amount: number,
  time: Date
}

const tokenAddress = "0xDef5cD882f776f9f909b17f5fC5c0c7036d1dcBD";
const bankAddress = "0x23AB0d60342B5042f7F56774Cac3bD569196FAB5";


export default function Home() {
  const [wallet, setWallet] = useState<IWalletInfor>({ address: "", amount: 0 });
  const [web3Provider, setWeb3Provider] = useState<ethers.providers.Web3Provider>();
  const [addressTo, setAddressTo] = useState<string>('');
  const [amount, setAmount] = useState<number>();
  const [approved, setApproved] = useState<boolean>(false);
  const [sended, setSended] = useState<boolean>(false);
  const [history, setHistory] = useState<IRecap[]>([]);

  const handleTransactionRespone = async (tx: TransactionResponse) => {
    try {
      const recept = await tx.wait();
      return recept.transactionHash;
    } catch (error: any) {
      throw new Error(error?.reason || `${error}`);
    }
  }

  const getHistory = async () => {
    try {
      if (!web3Provider)
        return;

      const bankContract: Contract = new ethers.Contract(bankAddress, bankAbi, web3Provider);
      const rawHistory = await bankContract.getHistoryList();

      const list: IRecap[] = [];
      rawHistory.forEach((recap: any) => {
        list.push({ from: recap.from, to: recap.to, amount: Number.parseFloat(ethers.utils.formatEther(recap.amount)), time: new Date(Number.parseInt(recap.time)) });
      });

      setHistory(list);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const handleConnectWallet = async () => {
    try {
      console.log("...connecting");

      const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
      await provider.send("eth_requestAccounts", []);

      setWeb3Provider(provider);

      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const myTokenContract: Contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
      const bigBalance = await myTokenContract.balanceOf(address);
      const ethBalance = Number.parseFloat(ethers.utils.formatEther(bigBalance));

      setWallet({ address, amount: ethBalance });

      console.log("...connected web3");
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const handleApprove = async () => {
    if (!web3Provider || !amount || amount <= 0) {
      console.log("Khong approve dc ne");
      return;
    }

    const myTokenContract: Contract = new ethers.Contract(tokenAddress, tokenAbi, web3Provider);

    const signer = web3Provider.getSigner();
    const mtContractWithSigner = myTokenContract.connect(signer);

    const approvedAmount = amount + (amount * 5 / 100);
    const tokenAmount = ethers.utils.parseEther(approvedAmount.toString());
    const tx: TransactionResponse = await mtContractWithSigner.approve(bankAddress, tokenAmount);
    const txHash = await handleTransactionRespone(tx);

    alert(txHash);

    setApproved(prev => !prev);
  }

  const handleSend = async () => {
    try {
      console.log("...sending");
      if (!web3Provider || !amount || amount <= 0 || !addressTo || addressTo == "" || !approved) {
        console.log("Khong approve dc ne");
        return;
      }

      // const myTokenContract: Contract = new ethers.Contract(tokenAddress, tokenAbi, web3Provider);
      const bankContract: Contract = new ethers.Contract(bankAddress, bankAbi, web3Provider);
      const signer = web3Provider.getSigner();
      const bankContractWithSigner = bankContract.connect(signer);

      const tokenAmount = ethers.utils.parseEther(amount.toString());
      const tx: TransactionResponse = await bankContractWithSigner.send(addressTo, tokenAmount);
      const txHash = await handleTransactionRespone(tx);

      alert(txHash);

      setSended(true);
      console.log("send successfully");
    } catch (error: any) {
      console.log(error.message);
    }
  }

  React.useEffect(() => {
    getHistory()
  }, [getHistory]);


  return (
    <>
      {
        wallet.address != "" ?
          <button>{wallet.address}, {wallet.amount} Mumbai</button> :
          <button onClick={handleConnectWallet}>Connect Wallet</button>
      }

      <br />
      <label>Input amount send: </label>
      <input type="text" onChange={(e) => { setAmount(parseFloat(e.target.value)) }} />
      {
        approved ?
          <button>Approved</button> :
          <button onClick={handleApprove}>Approve</button>
      }

      {approved ?
        <div>
          <label>Input address sended: </label>
          <input type="text" onChange={(e) => { setAddressTo(e.target.value) }} />
          <button onClick={handleSend}>Send Token</button>
        </div> :
        <div></div>}

      <div>
        <label>HISTORY</label>
        <ul>
          {
            history.map((recap, index) => (<li key={index}>{recap.from}, {recap.to}, {recap.amount}, {recap.time.toDateString()}</li>))
          }
        </ul>
      </div>
    </>
  )
}
