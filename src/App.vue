<template>
  <router-view></router-view>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  cursor: url('./assets/default.png'), auto;
}

*:active,
button:active,
.room-node:active,
[role="button"]:active,
a:active {
  cursor: url('./assets/point.png'), pointer !important;
}

button,
.room-node,
[role="button"],
a,
*[onclick],
*[class*="clickable"] {
  cursor: url('./assets/point.png'), pointer;
}
</style>