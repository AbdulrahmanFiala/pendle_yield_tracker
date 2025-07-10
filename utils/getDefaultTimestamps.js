function getDefaultTimestamps(timestamp_start, timestamp_end, days = 5) {
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  if (!timestamp_end) {
    timestamp_end = Math.floor(todayUTC.getTime() / 1000);
  }
  if (!timestamp_start) {
    const daysAgo = new Date(todayUTC.getTime() - days * 24 * 60 * 60 * 1000);
    timestamp_start = Math.floor(daysAgo.getTime() / 1000);
  }
  // Convert to ISO date strings for Pendle API
  const tsStartDate = new Date(Number(timestamp_start) * 1000);
  const tsEndDate = new Date(Number(timestamp_end) * 1000);
  const pendleTimestampStart = tsStartDate.toISOString().slice(0, 10);
  const pendleTimestampEnd = tsEndDate.toISOString().slice(0, 10);

  return {
    pendleTimestampStart,
    pendleTimestampEnd,
  };
}

module.exports = getDefaultTimestamps;
