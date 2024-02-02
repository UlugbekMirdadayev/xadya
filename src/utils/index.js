// Initialize the result array
export const arraySplicer = (array, splicer) => {
  const subarraySizes = Array.from({
    length: Math.ceil(array.length / splicer),
  });

  return subarraySizes.reduce((acc, size) => {
    const subarray = array.splice(0, splicer);
    acc.push(subarray);
    return acc;
  }, []);
};
