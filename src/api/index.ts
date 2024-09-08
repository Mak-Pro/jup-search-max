import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export const userAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: headers,
});

export const tradeHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export const tradeAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TRADE_API,
  headers: tradeHeaders,
});
