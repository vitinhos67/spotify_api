const randomNumber = (length) => {
  let number;
  const array = [];

  for (let i = 0; i < length; i++) {
    number = Math.floor(Math.random() * 20);

    if (array.indexOf(number) !== -1) randomNumber();
    if (number >= 20) randomNumber();

    array.push(number);
  }

  return { number, array };
};

module.exports = { randomNumber };
