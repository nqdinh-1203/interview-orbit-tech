import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config()

const ALCHEMY_API_KEY = "GMGOq5IweL2FmHvrCa2v_H8ISKknDtUu";

const config: HardhatUserConfig = {
  solidity: "0.8.18",

  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/isVMJIz7j1q9D5e7_simS8hRUByh1PLn",
      accounts: [`${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: `${process.env.POLYGONSCAN_API_KEY}`
  }
};

export default config;