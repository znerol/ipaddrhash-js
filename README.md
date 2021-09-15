ipaddrhash
==========

Implements a predictable addressing scheme for statically assigned IPv6 and
IPv4 addresses based on hostnames. Supports node and modern browsers.

The algorithm used to derive an ip is simple:

    ip = prefix + (sha256(seed) & hostmask)

Installation
------------

```
npm install ipaddrhash --save-dev
```

Usage
-----

ESM:

```javascript
import { ipaddrHash, ipaddrPrefixSize } from "ipaddrhash";
```

CommonJS:

```javascript
const { ipaddrHash, ipaddrPrefixSize } = require("ipaddrhash");
```

Example:

```javascript
const prefix = "2001:db8::/64";
const fqdn = "example.com";
const size = ipaddrPrefixSize(prefix);
if (size !== undefined && fqdn.length > 0) {
  ipaddrHash(size, prefix, fqdn).then((result) => {
    // should output:
    // 2001:db8::13d2:1255:86ce:1947
    console.log(result);
  });
}
```

License
-------

GNU General Public License v3.0 or later
