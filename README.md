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
|props|类型|默认值|说明|可选值|
|:---|:---|:---|:---|:---|
|value|null/Date/String/Number|-|默认显示日期
|type|String|datetime|显示类型|datetime/date
|limitRangeYear|Object|-|设置选择范围的年限eg.{from: number, to: munber}|
|format|String|yyyy-MM-dd|显示在输入框中的格式|见日期格式
|minuteStep|Number|1|分钟显示的间隔数
|disabledDate|Function|-|设置不可选状态，必须返回Boolean
|calendarStyle|Object|-|自定义时间选择面板样式，主要是设置位置
|inputStyle|Object|-|自定义时间显示input框样式
|placeholder|String|选择日期时间|占位内容

## 日期格式
#### 使用format设置输入框格式。以2018年8月9日 05:06:03 星期四为例格式化
|格式|含义|说明|举例
|:--|:--|:--|:--|
yyyy|年|-|2018
yy|年-2000|年缩写|18
M|月|不补0|8
MM|月|-|08
d|日|不补0|8
dd|日|-|08
h|小时|不补0|5
hh|小时|-|05
m|分钟|不补0|6
mm|分钟|-|06
s|秒|不补0|3
ss|秒|-|03
w|周|-|周四
ww|星期|-|星期四


**选择后emit selected方法，传递参数date**

![效果预览](https://github.com/prebra/web-datepicker/blob/master/src/assets/review.png)
