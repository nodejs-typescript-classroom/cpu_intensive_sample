export const heavilyJob = (totalCount = 20_000_000_000): number => {
  let count = 0;
  console.log({ totalCount });
  for (let i = 0; i < totalCount; i++) {
    count++;
  }
  return count;
};
