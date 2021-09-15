import{b as e,i as a,s,p as l,a as t,r,w as n,c as i,d as o,e as d,v as c,F as u,o as f,f as p}from"./vendor.7288dc98.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&a(e)})).observe(document,{childList:!0,subtree:!0})}function a(e){if(e.ep)return;e.ep=!0;const a=function(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerpolicy&&(a.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?a.credentials="include":"anonymous"===e.crossorigin?a.credentials="omit":a.credentials="same-origin",a}(e);fetch(e.href,a)}}();const F=32,m=128,b=e("FFFFFFFF",16),g=e("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",16),v={[F]:b,[m]:g},h=async(l,t,r)=>{const[n,i]=((e,s)=>{let l;switch(e){case F:const e=a.IPv4CidrRange.fromCidr(s);l=[e.getFirst().getValue(),e.getPrefix().toMask().getValue()];break;case m:const t=a.IPv6CidrRange.fromCidr(s);l=[t.getFirst().getValue(),t.getPrefix().toMask().getValue()]}return l})(l,t);if(void 0!==n&&void 0!==i){const t=((e,a)=>{if(e in v)return v[e].xor(a)})(l,i),o=e(await s(r),16).and(t);return((e,s)=>{let l;switch(e){case F:l=a.IPv4.fromBigInteger(s).toString();break;case m:l=a.collapseIPv6Number(a.IPv6.fromBigInteger(s).toString())}return l})(l,n.plus(o))}},P=e=>{const s=[F,m].filter((s=>((e,s)=>{let l=!1;if(s.match(/\//))switch(e){case F:const[e]=a.Validator.isValidIPv4CidrNotation(s);l=e;break;case m:const[t]=a.Validator.isValidIPv6CidrNotation(s);l=t}return l})(s,e)));if(s.length>0)return s[0]};const y={setup(){const e=r(""),a=r(""),s=r("");return n((async()=>{const l=P(a.value);void 0!==l&&e.value.length>0?s.value=await h(l,a.value,e.value):s.value=""})),{fqdn:e,prefix:a,addr:s}}};l("data-v-79d0ff78");const I=o("header",{class:"page-header"},[o("h1",{class:"page-title"},"ipaddrhash"),o("p",{class:"page-claim"}," A predictable addressing scheme for statically assigned IPv6 and IPv4 addresses based on hostnames. ")],-1),x={class:"page-content"},V={class:"form"},k={class:"fieldset fieldset--params"},w=o("label",{class:"label label--fieldset"},[o("span",{class:"label-name"},"Parameters")],-1),N={class:"label label--input"},C=o("span",{class:"label-name"},"IP Prefix:",-1),q={class:"label label--input"},L=o("span",{class:"label-name"},"FQDN:",-1),A={class:"fieldset fieldset--results"},M=o("label",{class:"label label--fieldset"},[o("span",{class:"label-name"},"Results")],-1),R={class:"label label--input"},S=o("span",{class:"label-name"},"IP Address:",-1);t(),y.render=function(e,a,s,l,t,r){return f(),i(u,null,[I,o("main",x,[o("form",V,[o("fieldset",k,[w,o("label",N,[C,d(o("input",{class:"field field--input","onUpdate:modelValue":a[0]||(a[0]=e=>l.prefix=e),type:"text",placeholder:"2001:db8::/64 or 192.0.2.0/24"},null,512),[[c,l.prefix]])]),o("label",q,[L,d(o("input",{class:"field field--input","onUpdate:modelValue":a[1]||(a[1]=e=>l.fqdn=e),type:"text",placeholder:"hostname.example.com"},null,512),[[c,l.fqdn]])])]),o("fieldset",A,[M,o("label",R,[S,d(o("input",{class:"field field--input","onUpdate:modelValue":a[2]||(a[2]=e=>l.addr=e),type:"text"},null,512),[[c,l.addr]])])])])])],64)},y.__scopeId="data-v-79d0ff78";p(y).mount("#app");
