import * as dotenv from 'dotenv'
dotenv.config();
import {
    GuildWarsInventory,
    GuildWarsInventoryItem,
    GuildWarsItem,
  } from "../../../types/guildwars.types.js";
  import axios from "axios";
import { Log } from '../../../logger.js';

  const amountAccounts = parseInt(process.env.GUILDWARS_AMOUNT as string);

  const accounts: Array<any> = [];
  
  const noKeyApi = axios.create({
    baseURL: "https://api.guildwars2.com/v2/",
  });
  
  noKeyApi.interceptors.request.use((request) => {
    if (request.url && request.url.includes("?")) {
      request.url += "&";
    } else {
      request.url += "?";
    }
    request.url += `lang=DE`;
    return request;
  });
  
  for (let i = 0; i < amountAccounts; i++) {
    const account = {
      api: axios.create({
        baseURL: "https://api.guildwars2.com/v2/",
      }),
  
      getInventory: function () {
        return this.api.get("account/inventory");
      },
  
      getCharacters: function () {
        return this.api.get("characters");
      },
  
      getBank: function () {
        return this.api.get("account/bank");
      },
  
      getMaterials: function () {
        return this.api.get("account/materials");
      },
  
      getCharactersInventory: function (name: string) {
        return this.api.get(`characters/${name}/inventory`);
      },
    };
  
    account.api.interceptors.request.use((request) => {
      if (request.url && request.url.includes("?")) {
        request.url += "&";
      } else {
        request.url += "?";
      }
      request.url += `lang=DE&access_token=${
        process.env[`GUILDWARS_API_KEY${i + 1}`]
      }`;
      return request;
    });
    accounts.push(account);
  }
  
  export const getCharacters = async () => {
    const response: Array<Array<string>> = [];
    Log.info(`load characters`)
    try {
      for (let i = 0; i < amountAccounts; i++) {
        const characterResponse = await accounts[i].getCharacters();
        response[i] = characterResponse.data;
      }
    } catch (err) {
      throw new Error();
    }
    Log.info(`characters loaded`)
    return response;
  };
  
  export const getItems = async (ids: Array<number>) => {
    if (ids.length === 0) return null;
    let idString = "?ids=";
  
    ids.forEach((id) => {
      idString += id.toString() + ",";
    });
  
    idString = idString.slice(0, -1);
  
    let items: Array<GuildWarsItem> = [];
    try {
      const itemResponse = await noKeyApi.get("items" + idString);
      items = itemResponse.data;
    } catch (err) {
      throw new Error();
    }
  
    return items;
  };
  
  export const getCharactersInventory = async (value: {name: string, account: number}) => {
    let response: GuildWarsInventory = { bags: [] };
    console.log(encodeURI(value.name))
    try {
      Log.info(`load ${value.name} inventory`)
      const inventoryResponse = await accounts[value.account].getCharactersInventory(
        encodeURI(value.name)
      );
      Log.info(`finished ${value.name} inventory`)
      response = inventoryResponse.data;
    } catch (err) {
      throw new Error();
    }
  
    return response;
  };
  
  export const getBank = async () => {
    const response: Array<Array<GuildWarsInventoryItem | null>> = [];
    try {
      for (let i = 0; i < amountAccounts; i++) {
        const bankResponse = await accounts[i].getBank();
        bankResponse.data.forEach((item: GuildWarsInventoryItem | null) => {
          if (item) item.owner = `Bank_${i + 1}`;
        });
        response[i] = bankResponse.data;
      }
    } catch (err) {
      throw new Error();
    }
    return response;
  };
  
  export const getMaterials = async () => {
    const response: Array<Array<GuildWarsInventoryItem | null>> = [];
    try {
      for (let i = 0; i < amountAccounts; i++) {
        const bankResponse = await accounts[i].getMaterials();
        bankResponse.data.forEach((item: GuildWarsInventoryItem | null) => {
          if (item) item.owner = `Bank_${i + 1}`;
        });
        response[i] = bankResponse.data;
      }
    } catch (err) {
      throw new Error();
    }
    return response;
  };
  