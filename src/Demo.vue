<template>
  <div id="app">
    <div class="demo">
      <h3>默认设置</h3>
      <datepicker></datepicker>
    </div>
    <div class="demo">
      <h3>日期时间选择 初始化日期</h3>
      <datepicker
          v-model="date"
          type="datetime"
          @selected="selected"
          format="yyyy年MM月dd日 hh:mm">
      </datepicker>
    </div>
    <div class="demo">
      <h3>设置分钟step</h3>
      <datepicker
          type="datetime"
          :minuteStep="5"
          :limitRangeYear="rangeYear"
          format="yyyy年MM月dd日 hh:mm"
          placeholder="选择日期时间">
      </datepicker>
    </div>
    <div class="demo">
      <h3>设置日期不可选日期</h3>
      <datepicker
          :disabledDate="disabledDate"
          @selected="selected"
          placeholder="选择日期">
      </datepicker>
    </div>
    <div class="demo">
      <h3>设置选择范围，只可设置年限范围</h3>
      <datepicker
          :limitRangeYear="rangeYear"
          placeholder="选择日期">
      </datepicker>
    </div>
  </div>
</template>

<script>
import datepicker from './components/datepicker'
export default {
  name: 'app',
  data () {
    return {
      date: new Date(),
      disabledDate (time) {
        return time.getTime() < Date.now()
      },
      rangeYear: {
          from: 2003,
          to: 2050
      }
    }
  },
  methods: {
    selected (date) {
      console.log(date)
    }
  },
  components: {
    datepicker
  }
}
</script>

<style>
.demo {
  margin: 20px;
}
h3 {
    margin-top: 40px;
    font-weight: 400;
    color: #1f2f3d;
}
</style>
