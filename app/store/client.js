import axios from "axios";
// const axios = require('axios').default;
// 10.22.129.62
// https://goblue-back.onrender.com

// https:blue-admin:3500/api/v1
// https://blue-admin-kat9.onrender.com/
// http://localhost:7500/

// https://goblue-back.onrender.com/api/v1
export const blueClient = axios.create({
  baseURL: "http://localhost:7500/api/v1",
  timeout: 10000,
});
