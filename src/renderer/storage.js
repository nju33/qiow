import pify from 'pify';
import _storage from 'electron-json-storage';

const storage = pify(_storage);

export async function getConfig() {
  const config = await storage.get('config');

  if (Object.keys(config).length === 0) {
    return {};
  }
  return config;
}