const modifyNames = (namesObj: { string: string }) => {
  return Object.entries(namesObj).map(([abv, name]) => ({ abv, name }));
};

export default modifyNames;
