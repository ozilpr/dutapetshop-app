class GetLocalTime {
  async getDate () {
    const utcTimeStamp = Date.now()
    // idk this is my laptop or the Date libs, sometimes i need to add + 7 hours to match gmt+7
    // const gmt7Offset = 7 * 60 * 60 * 1000
    const gmt7Timestamp = utcTimeStamp
    const date = new Date(gmt7Timestamp).toISOString()

    return date
  }
}

module.exports = GetLocalTime
