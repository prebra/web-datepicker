<template>
    <div class="web-datepicker">
        <div class="web-datepicker-input-wrapper" @click="showCalendar = true">
            <input class="web-datepicker-input"
                disabled="disabled"
                :style="inputStyle"
                :placeholder="placeholder"
                :value="displayValue">
        </div>
        <div class="mask" v-if="showCalendar" @click="showCalendar=false"></div>
        <div class="web-datepicker-panel" v-if="showCalendar" :style="calendarStyle">
            <div class="web-datepicker-header" v-if="type==='datetime'">
                <span class="web-datepicker-date" :class="{'current-tab': curTab === 1}" @click="switchTab(1)">{{selectedDateStr}}</span>
                <span class="web-datepicker-time" :class="{'current-tab': curTab === 2}" @click="switchTab(2)"> {{selectedTimeStr}}</span>
            </div>
            <div class="web-datepicker-container">
                <!-- 日历 -->
                <div class="calendar-panel" v-if="curTab === 1 && showPanel === 1">
                    <div class="panel-header">
                        <i class="arrow double-arrow" @click="previousYear">&lt;&lt;</i>
                        <i class="arrow single-arrow" @click="previousMonth">&lt;</i>
                        <p class="picker-date">
                            <span class="year-tab" @click="selectYearPanel">{{pageDate.getFullYear()}}年</span>
                            <span class="month-tab" @click="showPanel = 3"> {{pageDate.getMonth() + 1}}月</span>
                        </p>
                        <i class="arrow single-arrow" @click="nextMonth">&gt;</i>
                        <i class="arrow double-arrow" @click="nextYear">&gt;&gt;</i>
                    </div>
                    <ul class="calendar-content">
                        <li class="cell day-header" v-for="day in daysOfWeek" :key="day">{{day}}</li>
                        <li class="cell"
                            v-for="day in showDays"
                            :key="day.timestamp"
                            :class="dayClasses(day)"
                            @click="selectDate(day)">{{day.isToday ? '今天' : day.date}}
                        </li>
                    </ul>
                </div>
                <!-- 时分 -->
                <div class="time-panel" v-if="curTab === 2">
                    <ul class="item-list" ref="hours">
                        <li class="item"
                            v-for="index in 24"
                            :key="index"
                            :class="{selected: new Date(selectedDate).getHours() === index - 1 }"
                            @click="selectHours(index - 1)">
                            {{index - 1}}
                        </li>
                    </ul>
                    <ul class="item-list" ref="minutes">
                        <li class="item"
                            v-for="index in (Math.floor(60 / minuteStep))"
                            :key="index"
                            :class="{selected: new Date(selectedDate).getMinutes() === (index - 1) * minuteStep }"
                            @click="selectMinutes((index - 1) * minuteStep, index)">
                            {{(index - 1) * minuteStep}}
                        </li>
                    </ul>
                </div>
                <!-- 选年 -->
                <div class="year-panel" v-if="curTab === 1 && showPanel === 2">
                    <div class="panel-header">
                        <i class="arrow double-arrow" @click="switchYearList(-1)">&lt;&lt;</i>
                        <p class="picker-date">
                            <span> {{rangeYear}} </span>
                        </p>
                        <i class="arrow double-arrow" @click="switchYearList(1)">>></i>
                    </div>
                    <ul class="panel-list">
                        <li class="panel-list-item" v-for="year in yearList" :key="year">
                            <span class="item"
                                :class="{'selected': year == new Date(selectedDate).getFullYear()}"
                                @click="selectYear(year)">
                                {{year}}
                            </span>
                        </li>
                    </ul>
                </div>
                <!-- 选月 -->
                <div class="month-panel" v-if="curTab === 1 && showPanel === 3">
                    <div class="panel-header">
                        <i class="arrow double-arrow" @click="previousYear">&lt;</i>
                        <p class="picker-date">
                            <span> {{pageDate.getFullYear()}}年 </span>
                        </p>
                        <i class="arrow double-arrow" @click="nextYear">&gt;</i>
                    </div>
                    <ul class="panel-list">
                        <li class="panel-list-item" v-for="(val, index) in monthVal" :key="index">
                            <span class="item"
                                @click="selectMonth(index)"
                                :class="{'selected': index === new Date(selectedDate).getMonth() && pageDate.getFullYear() === new Date(selectedDate).getFullYear()}">
                                {{val}}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import util from '../utils'
const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六']
const monthVal = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const CELL_HEIGHT = 32

export default {
    data () {
        let date = this.value ? new Date(util.normalizeDate(this.value)) : new Date()
        let selectedDate = new Date(date)
        let pageTimestamp = date.setDate(1)
        return {
            util: util,
            // 1 显示日历 2 显示事件
            curTab: 1,
            userInput: null,
            daysOfWeek,
            monthVal,
            // 时间戳
            pageTimestamp,
            selectedDate,
            // 1 显示日历 2 显示选年 3 显示选月
            showPanel: 1,
            rangeYear: '',
            yearList: [],
            showCalendar: false,
            curPanelStartYear: 0,
            curPanelEndYear: 0
        }
    },
    props: {
        value: {
            validator: (val) => {
                return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number'
            }
        },
        type: {
            type: String,
            default: 'date'
        },
        limitRangeYear: {
            type: Object,
            default () {
                return {}
            }
        },
        format: {
            type: String,
            default: 'yyyy-MM-dd'
        },
        minuteStep: {
            type: Number,
            default: 1
        },
        disabledDate: Function,
        calendarStyle: {
            type: Object
        },
        inputStyle: {
            type: Object
        },
        placeholder: {
            type: String,
            default: '选择日期时间'
        }
    },
    computed: {
        pageDate () {
            return new Date(this.pageTimestamp)
        },

        displayValue () {
            if (this.value) {
                // 先正常化时间，Safari不支持‘yyyy-MM-dd hh:mm:ss’格式
                let normDate = util.normalizeDate(this.value)
                return util.format(new Date(normDate), this.format)
            } else if (this.userInput) {
                return util.format(this.userInput, this.format)
            }
            return ''
        },
        selectedDateStr () {
            return util.format(this.selectedDate, 'yyyy-MM-dd ww')
        },
        selectedTimeStr () {
            return util.format(this.selectedDate, 'hh:mm')
        },
        fillPreMonthDays () {
            let days = []
            let d = new Date(this.pageTimestamp)
            let sum = util.getPreMonthDays(d)
            let preMonthDate = util.getPreMonthDate(d)
            let pageMonthFirstday = util.getFirstDay(d)
            for (let i = 0; i < pageMonthFirstday; i++) {
                let date = new Date(new Date(preMonthDate).setDate(sum - i))
                days.unshift(this._normalizeDay(date))
            }
            return days
        },
        fillNextMonthDays () {
            let days = []
            let d = new Date(this.pageTimestamp)
            let nextMonthDate = util.getNextMonthDate(d)
            let day = util.getLastDay(d)
            for (let i = 0; i < 6 - day; i++) {
                let date = new Date(new Date(nextMonthDate).setDate(i + 1))
                days.push(this._normalizeDay(date))
            }
            return days
        },
        // 根据选择时间获取当月日历
        days () {
            let days = []
            let d = new Date(this.pageTimestamp)
            let daysInMonth = util.daysInMonth(d.getFullYear(), d.getMonth())
            for (let i = 0; i < daysInMonth; i++) {
                let date = new Date(d.getFullYear(), d.getMonth(), i + 1)
                days.push(this._normalizeDay(date))
            }
            return days
        },
        // 上下个月补充空白日期与当前月合并
        showDays () {
            return [...this.fillPreMonthDays, ...this.days, ...this.fillNextMonthDays]
        }
    },
    watch: {
        curTab (val) {
            if (val === 2) {
                setTimeout(() => {
                    let min = this.selectedDate.getMinutes()
                    this._scrollAnima(this.$refs.hours, this.selectedDate.getHours(), false, 30)
                    // 分钟是minuteStep的倍数才选中状态
                    if (min % this.minuteStep === 0) {
                        this._scrollAnima(this.$refs.minutes, min / this.minuteStep, false, (60 / this.minuteStep) * 2)
                    }
                }, 20)
            }
        },
        showCalendar (val) {
            if (!val) {
                this.resetPanel()
            }
        }
    },
    created () {
        console.log(this.value)
    },
    methods: {
        dayClasses (day) {
            return {
                selected: day.isSelected,
                today: day.isToday,
                disabled: day.isDisabled,
                gray: !day.isPageMonth
            }
        },

        switchTab (flag) {
            this.curTab = flag
            if (flag === 1) {
                this.showPanel = 1
            }
        },

        previousMonth () {
            this.changeMonth(this.pageDate.getMonth() - 1)
        },

        nextMonth () {
            this.changeMonth(this.pageDate.getMonth() + 1)
        },

        changeMonth (month) {
            let date = this.pageDate
            date.setMonth(month)
            this.setPageDate(date)
        },

        previousYear () {
            if (this.limitRangeYear.from && this.pageDate.getFullYear() <= this.limitRangeYear.from) {
                return
            }
            this.changeYear(this.pageDate.getFullYear() - 1)
        },

        nextYear () {
            if (this.limitRangeYear.to && this.pageDate.getFullYear() >= this.limitRangeYear.to) {
                return
            }
            this.changeYear(this.pageDate.getFullYear() + 1)
        },
        changeYear (year) {
            let date = this.pageDate
            date.setYear(year)
            this.setPageDate(date)
        },

        setPageDate (date) {
            this.pageTimestamp = date.setDate(1)
        },

        setDate (date) {
            let newDate = new Date(date)
            this.pageTimestamp = +newDate
            this.selectedDate = newDate
            this.$emit('input', date)
            this.$emit('selected', date)
            this.userInput = date
        },

        resetPanel () {
            this.curTab = 1
            this.showPanel = 1
        },

        selectDate (day) {
            if (day.isDisabled) {
                return
            }
            let { timestamp } = day
            this.selectedDate = new Date(util.setDate(this.selectedDate, timestamp))
            if (this.type === 'datetime') {
                this.curTab = 2
            } else if (this.type === 'date') {
                this.setDate(this.selectedDate)
                this.showCalendar = false
            }
        },

        selectYearPanel () {
            this.showPanel = 2
            this._calculateYear(this.pageDate.getFullYear())
        },

        switchYearList (flag) {
            let { start, end } = util.queryTenYearRange(this.curPanelStartYear)
            if (flag === -1 && (this.limitRangeYear.from > start || this.curPanelStartYear <= this.limitRangeYear.from)) {
                return
            }
            if (flag === 1 && (this.limitRangeYear.to < end || this.curPanelEndYear >= this.limitRangeYear.to)) {
                return
            }
            this._calculateYear(this.curPanelStartYear + flag * 10)
        },

        selectYear (year) {
            this.changeYear(year)
            this.showPanel = 3
        },

        selectMonth (month) {
            this.changeMonth(month)
            this.showPanel = 1
        },

        selectHours (hours) {
            this.selectedDate = new Date(this.selectedDate.setHours(hours))
            let el = this.$refs.hours
            this._scrollAnima(el, hours)
        },

        selectMinutes (min, index) {
            this.selectedDate = new Date(this.selectedDate.setMinutes(min))
            let el = this.$refs.minutes
            this._scrollAnima(el, index - 1, true, 60 / this._scrollAnima)
            this.setDate(this.selectedDate)
            this.showCalendar = false
        },

        _isDisabledDate (date) {
            return typeof this.disabledDate === 'function' && this.disabledDate(date)
        },

        _scrollAnima (el, dis, isAnimal = true, step = 10) {
            let curTop = el.scrollTop
            let threshold = CELL_HEIGHT * dis - curTop
            var distance = 0
            if (!window.requestAnimationFrame || !isAnimal) {
                el.scrollTop = threshold + curTop
                return
            }
            let scroll = function () {
                distance += step
                el.scrollTop = distance + curTop
                if (distance <= threshold - step) {
                    window.requestAnimationFrame(scroll)
                } else {
                    el.scrollTop = threshold + curTop
                }
            }
            scroll()
        },

        _calculateYear (year) {
            let { start, end } = util.queryTenYearRange(year)
            if (this.limitRangeYear.from > start) {
                start = this.limitRangeYear.from
            }
            if (this.limitRangeYear.to < end) {
                end = this.limitRangeYear.to
            }
            this.curPanelStartYear = start
            this.curPanelEndYear = end
            this.rangeYear = `${start}年-${end}年`
            this.yearList = []
            for (let i = 0; i < (end - start + 1); i++) {
                this.yearList.push(start + i)
            }
        },

        _normalizeDay (date) {
            return {
                date: date.getDate(),
                timestamp: date.getTime(),
                isToday: util.compareDates(date, new Date()),
                isSelected: util.compareDates(date, this.selectedDate),
                isDisabled: this._isDisabledDate(date),
                isPageMonth: date.getMonth() === this.pageDate.getMonth()
            }
        }
    }
}
</script>
<style lang="less">
@primaryColor: #e63;
ul, div, p {
    padding: 0;
    margin: 0;
}
.web-datepicker {
    position: relative;
    .mask {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0);
        z-index: 999;
    }
    .web-datepicker-input-wrapper {
        .web-datepicker-input {
            border-radius: 4px;
            -webkit-appearance: none;
            background-color: #fff;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            height: 40px;
            line-height: 40px;
            outline: none;
            padding: 0 15px
        }
    }
    .web-datepicker-panel {
        overflow: hidden;
        position: absolute;
        width: 272px;
        padding: 15px 28px;
        box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.04),0px 2px 4px 0px rgba(0,0,0,0.12);
        border-radius: 2px;
        background: #fff;
        z-index: 999;
        color: #606266;
        border: 1px solid #e4e7ed;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        background: #fff;
        border-radius: 4px;
        margin: 5px 0;
        .item {
            height: 28px;
            width: 60px;
            margin-top: 4px;
            display: inline-block;
            line-height: 28px;
            font-size: 14px;
            color: #475669;
            text-align: center;
            cursor: pointer;
            &.selected {
                color: #fff;
                background: @primaryColor;
                border-radius:28px;
            }
            &:hover {
                background: #E5E9F2;
                border-radius:28px;
            }
        }
        .web-datepicker-header {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 27px;
            color: #475669;
            font-size: 16px;
            font-weight: bold;
            .web-datepicker-date {
                display: inline-block;
                cursor: pointer;
                &:hover {
                    color: @primaryColor;
                }
            }
            .web-datepicker-time {
                display: inline-block;
                margin-left: 20px;
                cursor: pointer;
                &:hover {
                    color: @primaryColor;
                }
            }
            .current-tab {
                position: relative;
                color: @primaryColor;
                &::after {
                    content: "";
                    position: absolute;
                    display: inline-block;
                    bottom: -7px;
                    left: 10%;
                    width: 80%;
                    height: 3px;
                    background: @primaryColor;
                    border-radius: 3px;
                }
            }
        }
        .web-datepicker-container {
            min-height: 300px;
            .panel-header {
                display: flex;
                margin: 10px 0 10px;
                .picker-date {
                    flex: 1;
                    text-align: center;
                    font-size: 14px;
                    color: #475669;
                    .year-tab {
                        padding-right: 10px;
                    }
                }
                .arrow {
                    width: 22px;
                    font-style: normal;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: lighter;
                    text-align: center;
                    letter-spacing: -3px;
                    transform: scaleY(1.9);
                    -webkit-transform: scaleY(1.9);
                    &:hover {
                        color: @primaryColor;
                    }
                }
            }
            .calendar-panel {
                .picker-date {
                    span:hover {
                        cursor: pointer;
                        color: @primaryColor;
                    }
                }
                .calendar-content {
                    margin: 0 -10px;
                    .cell {
                        display: inline-block;
                        position: relative;
                        width: 37px;
                        height: 37px;
                        margin-top: 4px;;
                        border: 2px solid #fff;
                        text-align: center;
                        font-size: 14px;
                        color: #475669;
                        line-height: 37px;;
                        cursor: pointer;
                        &.today {
                            color: @primaryColor;
                        }
                        &:hover {
                            background: #E5E9F2;
                            color: #475669;
                            border-radius: 50%;
                        }
                    }
                    .selected {
                        background: @primaryColor;
                        color: #fff !important;
                        border-radius: 50%;
                    }
                    .disabled, .gray {
                        color: #C2CBD0 !important;
                    }
                    .disabled:hover {
                        cursor: not-allowed;
                        background: #fff;
                        color: #C2CBD0;
                    }
                    .day-header {
                        font-size: 12px;
                        color: #8492A6;
                        cursor: inherit;
                        &:hover {
                            background: #fff;
                            color: #8492A6;
                        }
                    }
                }
            }
            .time-panel {
                display: flex;
                margin: 22px 36px 0;
                .item-list {
                    flex: 1;
                    height: 268px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    text-align: center;
                    .item {
                        margin-left: 2px;
                    }
                    // display: flex;
                    // flex-direction: column;
                    // align-items: center;
                }
            }
            .panel-list-item {
                width: 33.33%;
                margin-top: 25px;
                display: inline-block;
                text-align: center;
            }
        }
    }
}
/*自定义滚动条样式*/
::-webkit-scrollbar {
    overflow: visible;
    width: 2px;
    height: 8px;
}

::-webkit-scrollbar-button {
    width: 0;
    height: 0;
}

::-webkit-scrollbar-thumb {
    min-height: 28px;
    padding: 100px 0 0;
    border: solid transparent;
    border-width: 1px;
    background-color:#A1AAB7;
    /* background-clip: padding-box; */
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:horizontal {
    padding: 0 0 0 100px;
    border-width: 2px 1px 1px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #86909F;
}

::-webkit-scrollbar-thumb:active {
    background-color: #6A7483;
}

::-webkit-scrollbar-corner {
    background: transparent;
    /* background-color: #f00; */
}
</style>
