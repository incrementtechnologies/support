export default {
  data: {
    timeInMilliSeconds: {
      year: 31556952000,
      month: 2592000000,
      week: 604800000,
      day: 86400000,
      hour: 3600000,
      minute: 60000
    }
  },
  getticketTimePassed(difference){
    let dividend = difference
    let result = []
    let year = this.data.timeInMilliSeconds.year
    let month = this.data.timeInMilliSeconds.month
    let week = this.data.timeInMilliSeconds.week
    let day = this.data.timeInMilliSeconds.day
    let hour = this.data.timeInMilliSeconds.hour
    let minute = this.data.timeInMilliSeconds.minute
    if(dividend >= year){
      let res = this.YearTimeIntervalWithExcessTime(dividend)
      result.push({
        unit: 'year',
        interval: res
      })
      dividend = res.excessTimeInterval
      if(dividend >= month){
        result.push({
          unit: 'month',
          interval: this.MonthTimeInterval(dividend)
        })
      }
      return result
    }
    if(dividend >= month){
      result.push({
        unit: 'month',
        interval: this.MonthTimeInterval(dividend)
      })
      return result
    }
    if(dividend >= week){
      result.push({
        unit: 'week',
        interval: this.WeekTimeInterval(dividend)
      })
      return result
    }
    if(dividend >= day){
      result.push({
        unit: 'day',
        interval: this.dayTimeInterval(dividend)
      })
      return result
    }
    if(dividend >= hour){
      result.push({
        unit: 'hour',
        interval: this.hourTimeInterval(dividend)
      })
      return result
    }
    if(dividend >= minute){
      result.push({
        unit: 'minute',
        interval: this.minuteTimeInterval(dividend)
      })
      return result
    }
  },
  YearTimeInterval(dividend){
    let year = this.data.timeInMilliSeconds.year
    let res = this.getInterval(dividend, year)
    return res
  },
  YearTimeIntervalWithExcessTime(dividend){
    let year = this.data.timeInMilliSeconds.year
    let res = {
      result: this.getInterval(dividend, year),
      excessTimeInterval: this.getExcessInterval(dividend, year)
    }
    return res
  },
  MonthTimeInterval(dividend){
    let month = this.data.timeInMilliSeconds.month
    let res = this.getInterval(dividend, month)
    return res
  },
  WeekTimeInterval(dividend){
    let week = this.data.timeInMilliSeconds.week
    let res = this.getInterval(dividend, week)
    return res
  },
  dayTimeInterval(dividend){
    let day = this.data.timeInMilliSeconds.day
    let res = this.getInterval(dividend, day)
    return res
  },
  hourTimeInterval(dividend){
    let hour = this.data.timeInMilliSeconds.hour
    let res = this.getInterval(dividend, hour)
    return res
  },
  minuteTimeInterval(dividend){
    let minute = this.data.timeInMilliSeconds.minute
    let res = this.getInterval(dividend, minute)
    return res
  },
  getInterval(dividend, divisor){
    let res = Math.floor(dividend / divisor)
    return res
  },
  getExcessInterval(dividend, divisor){
    let res = dividend % divisor
    return res
  }
}
