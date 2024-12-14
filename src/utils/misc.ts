export const formatString = (str: string, maxLength: number) => {
  str = str.charAt(0).toUpperCase() + str.slice(1);

  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }

  return str;
};
