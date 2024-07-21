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
		stringifiedCSV = parser.readFile(cartCSVFilePath);
		const validationsArray = parser.validate(stringifiedCSV)
		
		expect(validationsArray).toHaveLength(0)
	});
	});
  
	describe('CartParser - integration test', () => {
	  // Add your integration test here.
	});
  });