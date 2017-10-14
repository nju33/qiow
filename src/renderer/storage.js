// import R from 'ramda';
import pify from 'pify';
import _storage from 'electron-json-storage';
// import Street from './records/street';
import {pickTagId} from './helpers';
import {remote} from 'electron';

const storage = pify(_storage);

export async function loadConfig() {
  const config = await storage.get('config');

  if (Object.keys(config).length === 0) {
    return {};
  }
  return config;
}

export async function loadData() {
  const data = await storage.get('data');

  if (Object.keys(data).length === 0) {
    return {};
  }
  return data;
  // return R.map(item => new Street(item), data);
}

export async function saveData(data) {
  try {
    await storage.set('data', data);
  } catch (err) {
    throw new Error(err);
  }
}

export async function loadToken() {
  const {token} = await storage.get('token');
  return token || undefined;
}

export async function saveToken(token) {
  try {
    await storage.set('token', {token});
  } catch (err) {
    throw new Error(err);
  }
}
