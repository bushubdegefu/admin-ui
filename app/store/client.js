import axios from "axios";
// const axios = require('axios').default;
// 10.22.129.62
// https://goblue-back.onrender.com

// https:blue-admin:3500/api/v1

// https://goblue-back.onrender.com/api/v1
export const blueClient = axios.create({
  baseURL: "https://blue-admin-kat9.onrender.com/api/v1",
  timeout: 10000,
});
