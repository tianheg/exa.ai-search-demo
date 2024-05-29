<script setup>
import { ref } from "vue";

const query = ref("");
const loading = ref(false);
const error = ref("");
const results = ref([]);
const autopromptString = ref("");

const search = async () => {
  if (query.value.trim() === "") {
    return;
  }

  loading.value = true;
  error.value = "";
  results.value = [];

  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query.value)}`,
    );
    const data = await response.json();
    results.value = data.results;
    autopromptString.value = data.autopromptString;
  } catch (e) {
    console.error("There was a problem with your request:", e);
    error.value = "Internal server error";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-4">Exa.ai Search</h1>
    <div class="flex items-center mb-4">
      <input type="text" class="input input-bordered w-full max-w-lg" v-model="query"
        placeholder="Enter your search query" @keydown.enter="search">
      <button class="btn btn-neutral ml-2" @click="search">
        Search
      </button>
    </div>
    <div v-if="loading" class="mb-4">
      Loading...
    </div>
    <div v-if="error" class="mb-4">
      {{ error }}
    </div>
    <div v-if="results.length > 0">
      <h2 class="text-2xl font-bold mb-4">
        [AutopromptString] <span class="italic text-cyan-500">{{ autopromptString }}</span>
      </h2>
      <p></p>
      <ul class="list-none">
        <li v-for="(result, index) in results" :key="index" class="mb-4">
          <a :href="result.url" target="_blank" rel="noreferrer">
            <h3 class="text-lg font-bold">{{ result.title }}</h3>
            <p>{{ result.url }}</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
