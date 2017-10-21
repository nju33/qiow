// import R from 'ramda';
import pify from 'pify';
import _storage from 'electron-json-storage';
// import Street from './records/street';
import {pickTagId} from './helpers';
import {remote} from 'electron';

const storage = pify(_storage);


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

export async function loadTheme() {
  const {theme} = await storage.get('theme');
  return theme || 'light';
}

export async function saveTheme(theme) {
  console.log('00000', theme)
  try {
    await storage.set('theme', {theme});
  } catch (err) {
    throw new Error(err);
  }
}
