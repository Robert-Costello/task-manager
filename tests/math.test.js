const {restart} = require('nodemon');
const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add,
} = require('../src/math');

test('Should return bill plus tip', () => {
  const total = calculateTip(10, 30);
  expect(total).toBe(13);
});

test('Should return bill plus default tip', () => {
  const total = calculateTip(10);
  expect(total).toBe(12);
});

test('Should convert C to F', () => {
  const f1 = celsiusToFahrenheit(0);
  expect(f1).toBe(32);
  const f2 = celsiusToFahrenheit(20);
  expect(f2).toBe(68);
});

test('Should convert F to C', () => {
  const c1 = fahrenheitToCelsius(32);
  expect(c1).toBe(0);
  const c2 = fahrenheitToCelsius(68);
  expect(c2).toBe(20);
});

test('Async test demo', (done) => {
  setTimeout(() => {
    expect(2).toBe(2);
    done();
  }, 1000);
});

test('Should add two numbers', async () => {
  const sum = await add(2, 3);
  expect(sum).toBe(5);
  const sum2 = await add(2, sum);
  expect(sum2).toBe(7);
});
