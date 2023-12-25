<script setup>
import { onMounted, ref } from "vue";

const modes = [
  { name: "Manual", id: "manual" },
  { name: "Config", id: "config" },
];

const mode = ref("manual");
const objContext = ref({});
const error = ref("");

const successHandler = (data) => {
  console.log(data);
  if (data.success) {
    switch (data.type) {
      case "context":
        objContext.value = data.data;
      case "export":
        objContext.value.exportRunning = false;
    }
  }
};

const failureHandler = (e) => {
  error.value = e.message;
  if (objContext.value.exportRunning) {
    objContext.value.exportRunning = false;
  }
};

const getContext = async () => {
  google.script.run
    .withSuccessHandler(successHandler)
    .withFailureHandler(failureHandler)
    .getContext();
};

const triggerExport = () => {
  objContext.value.exportRunning = true;
  google.script.run
    .withSuccessHandler(successHandler)
    .withFailureHandler(failureHandler)
    .startExport(objContext.value.selectedConfig);
};

const selectConfig = (selected) => {
  objContext.value.selectedConfig = selected;
  objContext.value.currentConfig = objContext.value.configs[selected];
};

onMounted(async () => {
  await getContext();
});
</script>

<template>
  <!-- error -->
  <div v-if="error != ''" class="bg-red rounded-xl p-2 text-sm mb-4">
    <div
      class="pointer-events-auto flex items-center justify-between gap-x-6 bg-gray-900 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5"
    >
      <p class="text-sm leading-6 text-white">
        <a href="#">
          {{ error }}
        </a>
      </p>
      <button type="button" class="-m-1.5 flex-none p-1.5" @click="error = ''">
        x
      </button>
    </div>
  </div>

  <div class="flex content-center items-center mb-4">
    <span class="grow text-sm">Select Mode</span>
    <span class="isolate inline-flex rounded-full shadow-sm">
      <button
        v-for="m in modes"
        :key="m.id"
        @click="mode = m.id"
        type="button"
        class="relative inline-flex items-center first:rounded-l-full last:rounded-r-full text-sm bg-white px-4 py-1 hover:bg-surface ring-1 ring-gray ring-inset first:translate-x-px"
        :class="m.id == mode ? 'bg-accent' : ''"
      >
        {{ m.name }}
      </button>
    </span>
  </div>

  <!-- manual -->
  <div v-if="mode == 'manual'" class="bg-surface rounded-xl p-3 text-sm">
    Comming soon
  </div>

  <!-- config -->
  <div v-if="mode == 'config'" class="bg-surface rounded-xl p-3 text-sm">
    <div v-if="Object.keys(objContext).length == 0" class="text-center">
      loading...
    </div>
    <fieldset v-else>
      <div class="space-y-5">
        <div
          v-for="(c, cK) in objContext.configs"
          :key="cK"
          class="relative flex items-start"
        >
          <div class="flex h-6 items-center">
            <input
              :id="cK"
              :checked="cK === objContext.selectedConfig"
              :value="cK"
              type="radio"
              @input="(event) => selectConfig(event.target.value)"
              class="h-4 w-4 border-gray focus:ring-accent"
            />
          </div>
          <div class="ml-3 text-sm leading-6">
            <label :for="cK" class="font-medium">
              {{ c.name }}
            </label>
            <p :id="`${cK}-description`">
              {{ c.description }}
            </p>
          </div>
        </div>
      </div>
    </fieldset>
  </div>

  <button
    type="submit"
    class="mt-4 flex w-full justify-center rounded-full bg-surface px-3 py-1.5 text-sm leading-6 text-white shadow-sm"
    :class="
      objContext.exportRunning || !objContext.selectedConfig
        ? ''
        : 'hover:bg-accent'
    "
    @click="triggerExport"
    :disabled="objContext.exportRunning || !objContext.selectedConfig"
  >
    <svg
      class="animate-spin mr-4"
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 -960 960 960"
      width="24"
      v-if="objContext.exportRunning"
    >
      <path
        d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"
      />
    </svg>
    Export
  </button>
</template>

<style scoped></style>
