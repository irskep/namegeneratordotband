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
        :class="{ 'm-copied': name === state.copiedName }"
        @click="onClickBandName(name)"
      >
        {{ name }}
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

.App li::after {
  transition-duration: 3s;
  opacity: 1;

  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.8rem;
  color: gray;
}

.App li:hover {
  cursor: pointer;

  background-color: var(--bg-2);
}

.App li:hover::after {
  display: block;
  float: right;
  content: "copy";
}

.App li.m-copied::after {
  display: block;
  float: right;
  content: "copied!";

  opacity: 0;
}
</style>
