function shuffleArray(generator, array) {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = generator.nextInt(0, i - 1); // random index from 0 to i
    [ newArray[i], newArray[j] ] = [ newArray[j], newArray[i] ];
  }
  return newArray;
}

function pickNFromArray(generator, array, n) {
  if (n > array.length) {
    return shuffleArray(generator, array);
  }

  return shuffleArray(generator, array).slice(0, n);
}

module.exports = {
  shuffleArray,
  pickNFromArray,
};
