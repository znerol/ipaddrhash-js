import { expect } from "chai";

import {
  formatAddr,
  invertMask,
  IP4SIZE,
  IP6SIZE,
  IP4MAX,
  IP6MAX,
  parseCidr,
  validateCidr,
} from "./../esm/ipbigint.js";

describe("ipbigint", () => {
  describe("#formatAddr()", () => {
    it("should format address correctly if integer is within acceptable range", () => {
      const ip6DocNet = formatAddr(
        IP6SIZE,
        0x20010db800000000000000000000cafen
      );
      expect(ip6DocNet).to.equal("2001:db8::cafe");
      const ip4TestNet1 = formatAddr(IP4SIZE, 0xc000023fn);
      expect(ip4TestNet1).to.equal("192.0.2.63");

      const ip6min = formatAddr(IP6SIZE, 0n);
      expect(ip6min).to.equal("::");
      const ip4min = formatAddr(IP4SIZE, 0n);
      expect(ip4min).to.equal("0.0.0.0");

      const ip6max = formatAddr(IP6SIZE, IP6MAX);
      expect(ip6max).to.equal("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
      const ip4max = formatAddr(IP4SIZE, IP4MAX);
      expect(ip4max).to.equal("255.255.255.255");
    });

    it("should fail to format address if integer is out of range", () => {
      expect(() => formatAddr(IP6SIZE, -1n)).to.throw();
      expect(() => formatAddr(IP4SIZE, -1n)).to.throw();

      expect(() => formatAddr(IP6SIZE, IP6MAX.add(BigInt(1)))).to.throw();
      expect(() => formatAddr(IP4SIZE, IP4MAX.add(BigInt(1)))).to.throw();
    });
  });

  describe("#validateCidr()", () => {
    it("should accept valid ip range in CIDR notation", () => {
      expect(validateCidr(IP6SIZE, "2001:db8::/64")).to.be.true;
      expect(validateCidr(IP4SIZE, "192.0.2.0/24")).to.be.true;

      expect(validateCidr(IP6SIZE, "::/0")).to.be.true;
      expect(validateCidr(IP4SIZE, "0.0.0.0/0")).to.be.true;

      expect(
        validateCidr(IP6SIZE, "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff/128")
      ).to.be.true;
      expect(validateCidr(IP4SIZE, "255.255.255.255/32")).to.be.true;
    });

    it("should reject ip range in invalid CIDR notation", () => {
      expect(validateCidr(IP6SIZE, "2001:db8::")).to.be.false;
      expect(validateCidr(IP4SIZE, "192.0.2.0")).to.be.false;

      expect(validateCidr(IP6SIZE, "::/129")).to.be.false;
      expect(validateCidr(IP4SIZE, "0.0.0.0/33")).to.be.false;
    });
  });

  describe("#parseCidr()", () => {
    it("should parse valid ip range in CIDR notation", () => {
      const [ip6DocNetwork, ip6DocNetmask] = parseCidr(
        IP6SIZE,
        "2001:db8::cafe/32"
      );
      expect(ip6DocNetwork).to.equal(0x20010db8000000000000000000000000n);
      expect(ip6DocNetmask).to.equal(0xffffffff000000000000000000000000n);

      const [ip4TestNet1Network, ip4TestNet1Netmask] = parseCidr(
        IP4SIZE,
        "192.0.2.63/24"
      );
      expect(ip4TestNet1Network).to.equal(0xc0000200n);
      expect(ip4TestNet1Netmask).to.equal(0xffffff00n);
    });

    it("should reject ip range in invalid CIDR notation", () => {
      expect(() => parseCidr(IP6SIZE, "2001:db8::")).to.throw();
      expect(() => parseCidr(IP4SIZE, "192.0.2.0")).to.throw();

      expect(() => parseCidr(IP6SIZE, "::/129")).to.throw();
      expect(() => parseCidr(IP4SIZE, "0.0.0.0/33")).to.throw();
    });
  });

  describe("#invertMask()", () => {
    it("should flip the bits of a given ip mask", () => {
      const ip6Slash48Netmask = 0xffffffffffff00000000000000000000n;
      const ip6Slash48Hostmask = 0x000000000000ffffffffffffffffffffn;
      expect(invertMask(IP6SIZE, ip6Slash48Netmask)).to.equal(
        ip6Slash48Hostmask
      );
      expect(
        invertMask(IP6SIZE, invertMask(IP6SIZE, ip6Slash48Netmask))
      ).to.equal(ip6Slash48Netmask);

      const ip4Slash8Netmask = 0xff000000n;
      const ip4Slash8Hostmask = 0x00ffffffn;
      expect(invertMask(IP4SIZE, ip4Slash8Netmask)).to.equal(ip4Slash8Hostmask);
      expect(
        invertMask(IP4SIZE, invertMask(IP4SIZE, ip4Slash8Netmask))
      ).to.equal(ip4Slash8Netmask);

      expect(invertMask(IP6SIZE, IP6MAX)).to.equal(0n);
      expect(invertMask(IP4SIZE, IP4MAX)).to.equal(0n);

      expect(invertMask(IP6SIZE, 0n)).to.equal(IP6MAX);
      expect(invertMask(IP4SIZE, 0n)).to.equal(IP4MAX);
    });
  });
});
