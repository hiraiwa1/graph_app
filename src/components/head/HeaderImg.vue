<script setup>
const { headImage } = defineProps(["headImage"]);
</script>

<template>
  <header :class="headImage.cls">
    <div class="header__inner">
      <img
        src="/images/title.svg"
        width="headImage.width"
        height="headImage.height"
        alt="流入ワード推移チェック"
        loading="lazy"
      />
    </div>
  </header>
</template>

<style scoped>
header {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  display: grid;
  grid-auto-flow: column;
  place-content: center;
  place-items: center;
  padding-inline: 40px;
  width: 100%;
  min-width: 1000px;
}

img {
  filter: drop-shadow(5.88px 0.12px rgba(59, 93, 196, 0.004));
  object-fit: contain;
}

.top {
  background-image: url(/images/parts/step1-title-bg.png),
    linear-gradient(90deg, #ade3f1, #aee0ec 100%);
  padding-block: 30px;
}
.top img {
  width: 368px;
  height: 30px;
}
.graph {
  background-image: url(/images/parts/step2-title-bg.jpg),
    linear-gradient(90deg, #5275f1, #aee0ec 100%);
  padding-block: 16px;
  place-content: start;
  place-items: center;
}
.graph img {
  width: 280px;
  height: 30px;
}
</style>
