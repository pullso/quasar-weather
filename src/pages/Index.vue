<template>
  <q-page class="flex column" :class="bgClass">
    <div class="col q-pt-lg q-px-md">
      <q-input
        v-model="city" dark borderless
        placeholder="Search"
        @keyup.enter="getWeatherBySearchString"
      >
        <template v-slot:before @click="getLocation">
          <q-icon name="my_location"/>
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:append>
          <q-btn round dense flat icon="search" @click="getWeatherBySearchString"/>
        </template>
      </q-input>
    </div>
    <template v-if="weatherData">
      <div class="col text-white text-center">
        <div class="text-h4 text-weight-light">
          {{ weatherData.name }}
        </div>
        <div class="text-h6 text-weight-light">
          {{ weatherData.weather[0].main }}
        </div>
        <div class="text-h1 text-weight-thin q-my-lg relative-position">
          <span>{{ Math.round(weatherData.main.temp) }}</span>
          <span class="text-h4 relative-position degree">&deg;C</span>
        </div>
      </div>
      <div class="col text-center">
        <img :src="`https://openweathermap.org/img/wn/${ weatherData.weather[0].icon }@2x.png`" alt="city">
      </div>
    </template>
    <template v-else>
      <div class="col column text-center text-white">
        <div class="col text-h2 text-weight-thin">
          Quasar <br/>
          Weather
        </div>
        <q-btn flat class="col" @click="getLocation">
          <q-icon left size="3em" name="my_location"/>
          <div>Find My Location</div>
        </q-btn>
      </div>
    </template>
    <div class="col city-img"></div>
  </q-page>
</template>

<script>
import {defineComponent, ref, computed} from 'vue';
import {getWeatherByCoords, getWeatherBySearch} from '../api/weather.api';
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const city = ref(null)
    const weatherData = ref(null)
    const $q = useQuasar()

    function getLocation() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        $q.loading.show()
        weatherData.value = await getWeatherByCoords({lat: position.coords.latitude, lon: position.coords.longitude})
        $q.loading.hide()
      })
    }

    async function getWeatherBySearchString() {
      $q.loading.show()
      if (!city.value) return
      weatherData.value = await getWeatherBySearch(city.value)
      $q.loading.hide()
    }

    const bgClass = computed(() => weatherData.value && weatherData.value.weather[0].icon.endsWith('n')
      ? 'bg-night'
      : 'bg-day')

    return {
      city,
      weatherData,
      getLocation,
      getWeatherBySearchString,
      bgClass
    }
  },
})
</script>

<style lang="sass">
.q-page
  &.bg-night
    background: linear-gradient(to right, #232526, #414345)

  &.bg-day
    background: linear-gradient(to right, #2193b0, #6dd5ed)

.degree
  top: -44px

.city-img
  flex: 0 0 100px
  background: url(../assets/city.png)
  background-size: contain
  background-position: center 10px
  background-repeat: repeat-x
</style>
