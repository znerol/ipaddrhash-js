import bigInt from "big-integer";
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
        bigInt("20010db800000000000000000000cafe", 16)
      );
      expect(ip6DocNet).to.equal("2001:db8::cafe");
      const ip4TestNet1 = formatAddr(IP4SIZE, bigInt("c000023f", 16));
      expect(ip4TestNet1).to.equal("192.0.2.63");

      const ip6min = formatAddr(IP6SIZE, bigInt());
      expect(ip6min).to.equal("::");
      const ip4min = formatAddr(IP4SIZE, bigInt());
      expect(ip4min).to.equal("0.0.0.0");

      const ip6max = formatAddr(IP6SIZE, IP6MAX);
      expect(ip6max).to.equal("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
      const ip4max = formatAddr(IP4SIZE, IP4MAX);
      expect(ip4max).to.equal("255.255.255.255");
    });

    it("should fail to format address if integer is out of range", () => {
      expect(() => formatAddr(IP6SIZE, bigInt(-1))).to.throw();
      expect(() => formatAddr(IP4SIZE, bigInt(-1))).to.throw();

      expect(() => formatAddr(IP6SIZE, IP6MAX.add(bigInt(1)))).to.throw();
      expect(() => formatAddr(IP4SIZE, IP4MAX.add(bigInt(1)))).to.throw();
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
      expect(ip6DocNetwork.eq(bigInt("20010db8000000000000000000000000", 16)))
        .to.be.true;
      expect(ip6DocNetmask.eq(bigInt("ffffffff000000000000000000000000", 16)))
        .to.be.true;

      const [ip4TestNet1Network, ip4TestNet1Netmask] = parseCidr(
        IP4SIZE,
        "192.0.2.63/24"
      );
      expect(ip4TestNet1Network.eq(bigInt("c0000200", 16))).to.be.true;
      expect(ip4TestNet1Netmask.eq(bigInt("ffffff00", 16))).to.be.true;
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
      const ip6Slash48Netmask = bigInt("ffffffffffff00000000000000000000", 16);
      const ip6Slash48Hostmask = bigInt("000000000000ffffffffffffffffffff", 16);
      expect(invertMask(IP6SIZE, ip6Slash48Netmask).eq(ip6Slash48Hostmask)).to
        .be.true;
      expect(
        invertMask(IP6SIZE, invertMask(IP6SIZE, ip6Slash48Netmask)).eq(
          ip6Slash48Netmask
        )
      ).to.be.true;

      const ip4Slash8Netmask = bigInt("ff000000", 16);
      const ip4Slash8Hostmask = bigInt("00ffffff", 16);
      expect(invertMask(IP4SIZE, ip4Slash8Netmask).eq(ip4Slash8Hostmask)).to.be
        .true;
      expect(
        invertMask(IP4SIZE, invertMask(IP4SIZE, ip4Slash8Netmask)).eq(
          ip4Slash8Netmask
        )
      ).to.be.true;

      expect(invertMask(IP6SIZE, IP6MAX).eq(bigInt())).to.be.true;
      expect(invertMask(IP4SIZE, IP4MAX).eq(bigInt())).to.be.true;

      expect(invertMask(IP6SIZE, bigInt()).eq(IP6MAX)).to.be.true;
      expect(invertMask(IP4SIZE, bigInt()).eq(IP4MAX)).to.be.true;
    });
  });
});
