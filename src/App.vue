<template>
  <header class="page-header">
    <h1 class="page-title">ipaddrhash</h1>

    <p class="page-claim">
      A predictable addressing scheme for statically assigned IPv6 and IPv4
      addresses based on hostnames.
    </p>
  </header>

  <main class="page-content">
    <form class="form">
      <fieldset class="fieldset fieldset--params">
        <label class="label label--fieldset">
          <span class="label-name">Parameters</span>
        </label>

        <label class="label label--input">
          <span class="label-name">IP Prefix:</span>
          <input class="field field--input" v-model="prefix" type="text" placeholder="2001:db8::/64 or 192.0.2.0/24" />
        </label>

        <label class="label label--input">
          <span class="label-name">FQDN:</span>
          <input class="field field--input" v-model="fqdn" type="text" placeholder="hostname.example.com"/>
        </label>
      </fieldset>

      <fieldset class="fieldset fieldset--results">
        <label class="label label--fieldset">
          <span class="label-name">Results</span>
        </label>

        <label class="label label--input">
          <span class="label-name">IP Address:</span>
          <input class="field field--input" v-model="addr" type="text" />
        </label>
      </fieldset>
    </form>
  </main>
</template>

<script>
import { ref, watchEffect } from "vue";
import { ipaddrPrefixSize, ipaddrHash } from "../esm/ipaddrhash.js";

export default {
  setup() {
    const fqdn = ref("");
    const prefix = ref("");
    const addr = ref("");

    watchEffect(async () => {
      const size = ipaddrPrefixSize(prefix.value);
      if (size !== undefined && fqdn.value.length > 0) {
        addr.value = await ipaddrHash(size, prefix.value, fqdn.value);
      } else {
        addr.value = "";
      }
    });

    return {
      fqdn,
      prefix,
      addr,
    };
  },
};
</script>

<style>
@import-normalize;
@import-sanitize;

html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

html {
  font-family: Helvetica, Arial, sans;
}
</style>

<style scoped>
.page-header {
  margin: 2rem auto;
  padding: 0 1rem;
  max-width: 48rem;
}

.page-content {
  margin: 2rem auto;
  padding: 0 1rem;
  max-width: 48rem;
}

.fieldset {
  display: contents;
}

.label {
  display: contents;
}

.label-name {
  font-size: 0.8rem;
  font-weight: bold;
}

.label--fieldset .label-name {
  font-size: 1rem;
}

.form {
  display: grid;
  max-width: 24rem;
  column-gap: 0.25rem;
  row-gap: 0.25rem;
  align-items: end;
  grid-template-columns: max-content auto;
}

.form .label-name {
  grid-column: 1;
}

.form .label--input .label-name {
  padding-bottom: 0.5rem;
}

.form .label--fieldset .label-name {
  grid-column: 1 / 3;
}

.form .field {
  grid-column: 2;
}
</style>
