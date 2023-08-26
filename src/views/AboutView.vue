<template>
  <div class="about">
    <p>This is a passion project created to save me time and clicks when I forget the syntax to a
      specific command. Thanks for visiting.</p>
    <div id="social-buttons">
      <a href="https://github.com/derekology/" target="_blank">
        <IconGithub />
      </a>
      <a href="https://linkedin.com/in/derekology/" target="_blank">
        <IconLinkedin />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconLinkedin from '@/components/partials/IconLinkedin.vue';
import IconGithub from '@/components/partials/IconGithub.vue'; import { useHead } from '@unhead/vue';

useHead({
  title: `about > cmdpedia`
});
</script>

<style>
.about {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 2em;
  text-align: center;
}

#social-buttons {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1em;
}

#social-buttons a {
  margin: 0px 7px;
}
</style>
