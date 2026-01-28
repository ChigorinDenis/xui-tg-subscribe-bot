import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { randomUUID } from "crypto";

const jar = new CookieJar();

export const api = wrapper(axios.create({
  baseURL: process.env.XUI_URL,
  jar,
  withCredentials: true
}));

export async function login() {
  await api.post("/login", new URLSearchParams({
    username: process.env.XUI_USER,
    password: process.env.XUI_PASS
  }));
}

export async function getInbounds() {
  const res = await api.get("/panel/api/inbounds/list");
  return res.data.obj;
}

export async function addClient(inboundId, tgUser) {
  const client = {
    id: randomUUID(),
    flow: "",
    email: tgUser.username ?? `tg_${tgUser.id}`,
    enable: true,
    expiryTime: 0,
    limitIp: 1,
    totalGB: 0,
    tgId: "",
    subId: Math.random().toString(36).slice(2, 18),
    comment: `tg:${tgUser.id}`,
    reset: 0
  };


  await api.post(
    "/panel/api/inbounds/addClient",
    new URLSearchParams({
      id: inboundId,
      settings: JSON.stringify({ clients: [client] })
    })
  );

  return client;
}

export async function getLastOnline() {
  const res = await api.post("panel/api/inbounds/lastOnline");
  return res.data.obj;
}

export async function getOnlineClients() {
  const res = await api.post("panel/api/inbounds/onlines");
  return res.data.obj;
}
