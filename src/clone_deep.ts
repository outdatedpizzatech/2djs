export const cloneDeep = <T>(input: T): T => {
  return JSON.parse(JSON.stringify(input)) as T;
};
