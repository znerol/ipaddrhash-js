import { expect } from "chai";

import { ipaddrPrefixSize, ipaddrHash } from "../esm/ipaddrhash.js";
import { IP4SIZE, IP6SIZE } from "../esm/ipbigint.js";

const args = [
  {
    size: IP6SIZE,
    prefix: "2001:db8::/64",
    seed: "example.com",
    expect: "2001:db8::13d2:1255:86ce:1947",
  },
  {
    size: IP6SIZE,
    prefix: "2001:db8:f7a3:5152:4c87:f238:1618:3bd8/64",
    seed: "www.example.org",
    expect: "2001:db8:f7a3:5152:7b0:87fb:3758:c7d3",
  },
  {
    size: IP6SIZE,
    prefix: "2001:db8::/32",
    seed: "example.com",
    expect: "2001:db8:9f2d:30ab:13d2:1255:86ce:1947",
  },
  {
    size: IP6SIZE,
    prefix: "2001:db8:f7a3:5152:4c87:f238:1618:3bd8/32",
    seed: "www.example.org",
    expect: "2001:db8:b468:5b35:7b0:87fb:3758:c7d3",
  },
  {
    size: IP4SIZE,
    prefix: "10.0.0.0/8",
    seed: "example.com",
    expect: "10.206.25.71",
  },
  {
    size: IP4SIZE,
    prefix: "10.1.2.3/8",
    seed: "www.example.org",
    expect: "10.88.199.211",
  },
];

describe("ipaddrhash", () => {
  describe("#ipaddrHash()", () => {
    for (const { size, prefix, seed, expect: expected } of args) {
      it(`should generate ${expected} if prefix is ${prefix} and seed is ${seed}`, async () => {
        expect(await ipaddrHash(size, prefix, seed)).to.equal(expected);
      });
    }
  });

  describe("#ipaddrPrefixSize", () => {
    for (const { prefix } of args.filter(({ size }) => size === IP6SIZE)) {
      it(`should return IP6SIZE for prefix ${prefix}`, () => {
        expect(ipaddrPrefixSize(prefix)).to.equal(IP6SIZE);
      });
    }

    for (const { prefix } of args.filter(({ size }) => size === IP4SIZE)) {
      it(`should return IP4SIZE for prefix ${prefix}`, () => {
        expect(ipaddrPrefixSize(prefix)).to.equal(IP4SIZE);
      });
    }

    for (const prefix of ["2001: db8::", "192.0.2.0", "::/129", "0.0.0.0/33"]) {
      it(`should return undefined for invalid prefix ${prefix}`, () => {
        expect(ipaddrPrefixSize(prefix)).to.be.undefined;
      });
    }
  });
});
