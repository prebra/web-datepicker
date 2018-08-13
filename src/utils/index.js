const util = {
    /**
     * Alternative get total number of days in month
     * @param {Number} year
     * @param {Number} m
     * @return {Number}
     */
    daysInMonth (year, month) {
        return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31
    },

    /**
     * 获取传入时间的上个月天数
     * @param {*} date
     */
    getPreMonthDays (date) {
        return this.daysInMonth(date.getFullYear(), date.getMonth() - 1)
    },

    /**
     * 获取当前月份的前一个月的第一天
     *
     * @param {*} date
     * @returns
     */
    getPreMonthDate (date) {
        return new Date(date.getFullYear(), date.getMonth() - 1, 1)
    },

    /**
     * 获取传入时间的下个月的天数
     * @param {*} date
     * @returns
     */
    getNextMonthDays (date) {
        return this.daysInMonth(date.getFullYear(), date.getMonth() + 1)
    },

    /**
     * 获取当前月份的下个月的第一天
     *
     * @param {*} date
     * @returns
     */
    getNextMonthDate (date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1)
    },

    /**
     *获取当前月的第一天是周几
     * @param {*} date
     * @returns Number
     */
    getFirstDay (date) {
        date.setDate(1)
        return date.getDay()
    },

    /**
     * 获取当前月的最后一天是周几
     * @param {*} date
     * @returns Number
     */
    getLastDay (date) {
        let days = this.daysInMonth(date.getFullYear(), date.getMonth())
        date.setDate(days)
        return date.getDay()
    },

    /**
     * 比较两个时间是不是同一天
     * @param {*} date1
     * @param {*} date2
     * @returns
     */
    compareDates (date1, date2) {
        const d1 = new Date(date1.getTime())
        const d2 = new Date(date2.getTime())
        d1.setHours(0, 0, 0, 0)
        d2.setHours(0, 0, 0, 0)
        return d1.getTime() === d2.getTime()
    },

    /**
     * 设置date1的年月日
     * @param {date} date1
     * @param {timestamp} date2
     * @returns
     */
    setDate (date1, date2) {
        let dateTime = new Date(date2)
        let hours = date1.getHours()
        let minutes = date1.getMinutes()
        dateTime.setHours(hours)
        dateTime.setMinutes(minutes)
        return dateTime
    },

    /**
     * 取传入年份的十年整范围
     * @param {*} year
     * @returns
     */
    queryTenYearRange (year) {
        let start = Math.floor(year / 10) * 10
        return {
            start: start,
            end: start + 9
        }
    },

    /**
     * 格式化时间
     * @param {Date} dateTime
     * @param {String} format
     * @returns
     */
    format (dateTime, format) {
        let year
        let month
        let date
        let hour
        let minute
        let second
        let day
        if (!format) {
            return dateTime.getTime()
        }

        year = dateTime.getFullYear()
        month = dateTime.getMonth() + 1
        date = dateTime.getDate()
        hour = dateTime.getHours()
        minute = dateTime.getMinutes()
        second = dateTime.getSeconds()
        day = dateTime.getDay()

        const dayObj = ['日', '一', '二', '三', '四', '五', '六']
        let rule = {
            'yy': year - 2000,
            'yyyy': year,
            'M': month,
            'MM': month < 10 ? '0' + month : month,
            'd': date,
            'dd': date < 10 ? '0' + date : date,
            'h': hour,
            'hh': hour < 10 ? '0' + hour : hour,
            'm': minute,
            'mm': minute < 10 ? '0' + minute : minute,
            's': second,
            'ss': second < 10 ? '0' + second : second,
            'w': '周' + dayObj[day],
            'ww': '星期' + dayObj[day]
        }
        let reg = /y{2,4}|M{1,2}|d{1,2}|h{1,2}|m{1,2}|s{1,2}|w{1,2}/g
        let afterFormat = format.replace(reg, function ($) {
            if ($ in rule) {
                return rule[$]
            }
        })

        return afterFormat
    },
    /**
     * Safari Dateh实例化不支持‘yyyy-MM-dd hh:mm:ss’形式的参数需要转换成‘yyyy/MM/dd hh:mm:ss’
     * @param {*} dateStr 
     */
    normalizeDate (dateStr) {
        if (typeof dateStr !== 'string') {
            return dateStr
        }
        return dateStr.trim().replace(/\-/g, '\/')
    }
}
export default util
