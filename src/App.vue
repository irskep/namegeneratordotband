<script setup lang="ts">
import { reactive } from "vue";
import generators from "./generators";

function makeNames(): string[] {
  const result = new Array<string>();
  for (let i = 0; i < 100; i++) {
    result.push(generators.bandName.generate());
  }
  return result;
}

const state = reactive<{ names: string[]; copiedName: string | null }>({
  names: makeNames(),
  copiedName: null,
});

function onMorePlease() {
  state.names = makeNames();
}

function onFrontpersonChange(e: Event) {
  generators.bandName.replacePersons([(e.target as HTMLInputElement).value]);
}

function onResetFrontperson() {
  generators.bandName.replacePersons(null);
}

function onClickBandName(name: string) {
  state.copiedName = name;
  navigator.clipboard.writeText(name);
}
</script>

<template>
  <div class="App">
    <form>
      <label for="personname">Name of your frontperson, if you have one:</label>
      <div>
        <input id="personname" type="text" @change="onFrontpersonChange" />
        <button @click="onResetFrontperson">Reset</button>
      </div>
    </form>
    <div>
      <button @click="onMorePlease">Generate more</button>
    </div>
    <ul>
      <li
        v-for="name in state.names"
        :key="name"
        @click="onClickBandName(name)"
      >
        {{ name }}
        <aside class="m-copied" v-if="name === state.copiedName">copied</aside>
        <aside v-if="name !== state.copiedName">copy</aside>
      </li>
    </ul>
    <div>
      <button @click="onMorePlease">Generate more</button>
    </div>
  </div>
</template>

<style scoped lang="css">
.App {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.App > * {
  margin-bottom: 1rem;
}

.App form label {
  display: block;
  margin-bottom: 0.5rem;
}

.App input {
  margin-right: 0.5rem;
}
.App ul {
  margin: 0 0 1rem 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-start;
}

.App li {
  position: relative;

  display: block;
  list-style-type: none;
  padding: 0;
  text-decoration: none;

  width: 15rem;
  padding: 0.25rem;

  border-radius: 4px;
}

.App li aside {
  transition-duration: 3s;
  opacity: 1;

  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.8rem;
  color: gray;

  display: block;
  float: right;

  visibility: hidden;
}
.App li aside.m-copied,
.App li:hover aside {
  visibility: visible;
}

.App li:hover {
  cursor: pointer;

  background-color: var(--bg-2);
}
</style>
