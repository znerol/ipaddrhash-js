import {
  formatAddr,
  invertMask,
  IP4SIZE,
  IP6SIZE,
  parseCidr,
  validateCidr,
} from "./ipbigint.js";
import { sha256 } from "crypto-hash";

/**
 * Returns an IP address derived from cidr and seed using the following
 * algorithm:
 *
 *     ip = prefix + (sha256(seed) & hostmask)
 *
 * @param {number} size Address size, either IP4SIZE or IP6SIZE.
 * @param {string} cidr IPv4 or IPv6 prefix in CIDR form.
 * @param {string} seed Seed for hash function (hostname).
 * @returns {string}
 */
export const ipaddrHash = async (size, cidr, seed) => {
  const [network, netmask] = parseCidr(size, cidr);

  if (network !== undefined && netmask !== undefined) {
    const hostmask = invertMask(size, netmask);
    const hostaddr = BigInt(`0x${(await sha256(seed))}`) & hostmask;
    return formatAddr(size, network + hostaddr);
  }
};

/**
 * Returns either IP$SIZE or IP6SIZE if the given prefix in CIDR form is valid,
 * or undefined if it isnt.
 *
 * @param {string} cidr IPv4 or IPv6 prefix in CIDR form.
 * @returns {number|undefined}
 */
export const ipaddrPrefixSize = (cidr) => {
  const sizes = [IP4SIZE, IP6SIZE].filter((s) => validateCidr(s, cidr));
  if (sizes.length > 0) {
    return sizes[0];
  }
};
