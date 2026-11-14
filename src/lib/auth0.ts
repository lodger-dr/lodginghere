import dns from 'node:dns';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Ensure IPv4 resolution takes precedence over IPv6 to prevent connect timeouts on Auth0 domains
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

export const auth0 = new Auth0Client();
