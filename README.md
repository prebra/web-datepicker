# web-datepicker

> 基于web端的时间选择控件

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## props
|props|类型|默认值|说明|
|:---|:---|:---|:---|
|value|null/Date/String/Number|-|默认显示日期
|rangeStart|null/Date/String/Number|-|选择范围的开始日期 只限制年 月|
|rangeEnd|null/Date/String/Number|-|选择范围的结束日期 只限制年 月|
|format|String|yyyy-MM-dd|显示在输入框中的格式
|minuteStep|Number|1|分钟显示的间隔数
|disabledRange|Object|-|不可选日期范围 eg.{from: date\|timestamp, to: date\|timestamp}
|calendarStyle|Object|-|自定义时间选择面板样式，主要是设置位置
|inputStyle|Object|-|自定义时间显示input框样式
|placeholder|String|选择日期时间|占位内容

**选择后emit selected方法，传递参数date**
