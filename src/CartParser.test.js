import CartParser from './CartParser';
import path from 'path'

const cartCSVFilePath = path.join(__dirname, '..', 'samples', 'cart.csv');
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
		
	  test('when cart CSV data input has invalid header, validate function return array with header error', () => {
		  stringifiedCSV = parser.readFile(cartCSVFilePath);
		  stringifiedCSV = stringifiedCSV.replace('Product name', 'Upcoming unknown name')
		  const validationsArray = parser.validate(stringifiedCSV)

		  expect(validationsArray).toHaveLength(1)
		  expect(validationsArray[0].type).toEqual('header')
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