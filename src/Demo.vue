<template>
  <div id="app">
    <datepicker
        v-model="date"
        format="M月d日 w hh:mm">
    </datepicker>
  </div>
</template>

<script>
import datepicker from './components/datepicker'
export default {
  name: 'app',
  data () {
    return {
      date: new Date()
    }
  },
  components: {
    datepicker
  }
}
</script>

<style>
</style>
