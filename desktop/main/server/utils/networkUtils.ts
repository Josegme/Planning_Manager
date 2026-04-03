import { networkInterfaces } from 'os';

export interface NetworkInterface {
  address: string;
  family: string;
  internal: boolean;
}

/**
 * Obtiene la IP local de la máquina (primera IP IPv4 no interna)
 */
export function getLocalIP(): string | null {
  const interfaces = networkInterfaces();
  
  if (!interfaces) {
    return null;
  }

  // Buscar la primera IP IPv4 que no sea localhost ni interna
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (!nets) continue;

    for (const net of nets) {
      // Ignorar interfaces internas y no IPv4
      if (net.internal || net.family !== 'IPv4') {
        continue;
      }
      
      // Retornar la primera IP válida encontrada
      return net.address;
    }
  }

  return null;
}

/**
 * Obtiene todas las IPs locales disponibles
 */
export function getAllLocalIPs(): string[] {
  const interfaces = networkInterfaces();
  const ips: string[] = [];

  if (!interfaces) {
    return ips;
  }

  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (!nets) continue;

    for (const net of nets) {
      if (!net.internal && net.family === 'IPv4') {
        ips.push(net.address);
      }
    }
  }

  return ips;
}

/**
 * Valida si una IP es válida para conexión local
 */
export function isValidLocalIP(ip: string): boolean {
  // Validar formato básico de IP
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) {
    return false;
  }

  // Verificar que no sea localhost
  if (ip === '127.0.0.1' || ip === 'localhost') {
    return false;
  }

  // Verificar que esté en rango de red local
  const parts = ip.split('.').map(Number);
  if (parts[0] === 192 && parts[1] === 168) {
    return true; // 192.168.x.x
  }
  if (parts[0] === 10) {
    return true; // 10.x.x.x
  }
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true; // 172.16.x.x - 172.31.x.x
  }

  return false;
}
