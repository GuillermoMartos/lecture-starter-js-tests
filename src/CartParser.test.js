import CartParser from './CartParser';
import path from 'path'

const cartCSVFilePath = path.join(__dirname, '..', 'samples', 'cart.csv');
const allValidationErrorsCSVFilePath = path.join(__dirname, '..', 'samples', 'all-validate-errors-cart.csv');
let parser;
let stringifiedCSV;

describe('All CartParser tests with +65 coverage expected', () => {
	beforeEach(() => {
	  parser = new CartParser();
	});
  
	describe('CartParser - unit tests', () => {
	  beforeEach(() => {
		stringifiedCSV = parser.readFile(cartCSVFilePath);
	  });
  
	  test('when CSV data input, readFile returns a string from CSV', () => {
		expect(stringifiedCSV).toContain('Mollis consequat,9.00,3');
	  });
		
	  test('when cart CSV data input has each invalid error type, validate function return array with each error type', () => {
		  stringifiedCSV = parser.readFile(allValidationErrorsCSVFilePath);
		  const validationsArray = parser.validate(stringifiedCSV)

		  expect(validationsArray).toHaveLength(4)
		  expect(validationsArray[0].type).toEqual('header')
		  expect(validationsArray[1].type).toEqual('row')
		  expect(validationsArray[2].type).toEqual('cell')
		  expect(validationsArray[2].message).toContain('Expected cell to be a nonempty string but received')
		  expect(validationsArray[3].type).toEqual('cell')
		  expect(validationsArray[3].message).toContain('Expected cell to be a positive number but received')
	  });
		
	  test('when cart CSV data input is ok, validate function return empty array', () => {
		const validationsArray = parser.validate(stringifiedCSV)
		
		expect(validationsArray).toHaveLength(0)
	});

	  test('when a cart line is input, parseLine function return proper item with id', () => {
		const item = parser.parseLine(stringifiedCSV.split(/\n/)[1])
		const { id } = item

		expect(typeof id).toBe("string")
		expect(item).toEqual({"id": id, "name": "Mollis consequat", "price": 9, "quantity": 3})
	});

	  test('when an array of items is input, calcTotal function return proper total each price * qty', () => {
		const items1 = [{price: 3, quantity:4}]
		const items2 = [{price: 3, quantity:4}, {price: 5, quantity:1}]
		const total = parser.calcTotal(items1)
		const total2 = parser.calcTotal(items2)
		  
		expect(total).toEqual(12)
		expect(total2).toEqual(17)
	});
	});
  
	describe('CartParser - integration test', () => {
	  // Add your integration test here.
	  test('when invalid card input, parse function throws Validation failed! instance of Error', () => {
		expect(() => parser.parse(allValidationErrorsCSVFilePath)).toThrow(
			new Error('Validation failed!')
		  );
	  })
		
		test('when valid card input, parse function return serialized cart', () => {
			const cartSerialized = parser.parse(cartCSVFilePath)

			expect(cartSerialized.items).toHaveLength(5)
			expect(cartSerialized.total).toEqual(400.44)
		})
		
	});
  });