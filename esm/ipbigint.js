import {
  collapseIPv6Number,
  IPv4,
  IPv4CidrRange,
  IPv6,
  IPv6CidrRange,
  Validator,
} from "ip-num";

/**
 * Number of bits necessary to store an IPv4 address.
 */
export const IP4SIZE = 32;

/**
 * Number of bits necessary to store an IPv6 address.
 */
export const IP6SIZE = 128;

/**
 * Largest possible value for an IPv4 address.
 */
export const IP4MAX = 0xffffffffn;

/**
 * Largest possible value for an IPv6 address.
 */
export const IP6MAX = 0xffffffffffffffffffffffffffffffffn;

/**
 * Returns a map size => largest possible IP value.
 */
export const IPMAX = {
  [IP4SIZE]: IP4MAX,
  [IP6SIZE]: IP6MAX,
};

/**
 * Formats the given IP address.
 *
 * @param {number} size Address size, either IP4SIZE or IP6SIZE.
 * @param {BigInt} ip Numeric value of an IP number as a BigInt.
 * @returns {string|undefined}
 */
export const formatAddr = (size, ip) => {
  let result = undefined;

  switch (size) {
    case IP4SIZE:
      result = IPv4.fromNumber(ip).toString();
      break;

    case IP6SIZE:
      result = collapseIPv6Number(IPv6.fromNumber(ip).toString());
      break;
  }

  return result;
};

/**
 * Return true if the given string is a valid IPv6 / IPv6 range in CIDR notation.
 *
 * @param {number} size Address size, either IP4SIZE or IP6SIZE.
 * @param {string} cidr The IPv4 or IPv6 range in CIDR notation.
 * @returns {boolean}
 */
export const validateCidr = (size, cidr) => {
  let result = false;

  if (cidr.match(/\//)) {
    switch (size) {
      case IP4SIZE:
        const [isIp4Valid] = Validator.isValidIPv4CidrNotation(cidr);
        result = isIp4Valid;
        break;

      case IP6SIZE:
        const [isIp6Valid] = Validator.isValidIPv6CidrNotation(cidr);
        result = isIp6Valid;
        break;
    }
  }

  return result;
};

/**
 * Returns a pair of bigInt.BigInteger representing the network address and the
 * netmask given an IPv4 or IPv6 range in CIDR notation.
 *
 * @param {number} size
 * @param {string} cidr
 * @returns {bigInt.BigInteger[]|undefined}
 */
export const parseCidr = (size, cidr) => {
  let result = undefined;

  switch (size) {
    case IP4SIZE:
      const ip4range = IPv4CidrRange.fromCidr(cidr);
      result = [
        ip4range.getFirst().getValue(),
        ip4range.getPrefix().toMask().getValue(),
      ];
      break;

    case IP6SIZE:
      const ip6range = IPv6CidrRange.fromCidr(cidr);
      result = [
        ip6range.getFirst().getValue(),
        ip6range.getPrefix().toMask().getValue(),
      ];
      break;
  }

  return result;
};

/**
 * Inverts the given IP mask.
 *
 * @param {number} size
 * @param {bigInt.BigInteger} mask
 * @returns {bigInt.BigInteger|undefined}
 */
export const invertMask = (size, mask) => {
  if (size in IPMAX) {
    return IPMAX[size].xor(mask);
  }
};
