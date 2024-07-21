import CartParser from './CartParser';
import path from 'path'
import cart from '../samples/cart.json'
import * as idGenerator from 'uuid';

const cartCSVFilePath = path.join(__dirname, '..', 'samples', 'cart.csv');
const allValidationErrorsCSVFilePath = path.join(__dirname, '..', 'samples', 'all-validate-errors-cart.csv');
let parser;
let stringifiedCSV;
let allValidationErrorsCartCSV;

describe('All CartParser tests with +65 coverage expected', () => {
	beforeEach(() => {
	  parser = new CartParser();
	});
  
	describe('CartParser - unit tests', () => {
	  beforeEach(() => {
		stringifiedCSV = parser.readFile(cartCSVFilePath);
		allValidationErrorsCartCSV = parser.readFile(allValidationErrorsCSVFilePath);
	  });
  
	  test('when CSV data input, readFile returns a string from CSV', () => {
		expect(stringifiedCSV).toContain('Mollis consequat,9.00,3');
	  });
	  test('idGenerator v4 function returns a diferent 36 length string each time', () => {
		const id1= idGenerator.v4();
		const id2 = idGenerator.v4();
		  
		expect(typeof id1).toBe("string")
		expect(typeof id2).toBe("string")
		expect(id1).toHaveLength(36)
		expect(id2).toHaveLength(36)
		expect(id1).toHaveLength(36)
		expect(id1).not.toEqual(id2)
	  });
		
	  test('when cart CSV data input has header error, validate function return array with proper type', () => {
		  const validationsArray = parser.validate(allValidationErrorsCartCSV)

		  expect(validationsArray).toHaveLength(4)
		  expect(validationsArray[0].type).toEqual('header')
	  });
		
	  test('when cart CSV data input has row error, validate function return array with proper type', () => {
		  const validationsArray = parser.validate(allValidationErrorsCartCSV)

		  expect(validationsArray).toHaveLength(4)
		  expect(validationsArray[1].type).toEqual('row')

	  });
		
	  test('when cart CSV data input has cell error, validate function return array with proper type and empty message error', () => {
		  const validationsArray = parser.validate(allValidationErrorsCartCSV)

		  expect(validationsArray).toHaveLength(4)
		  expect(validationsArray[2].type).toEqual('cell')
		  expect(validationsArray[2].message).toContain('Expected cell to be a nonempty string but received')
	  });
		
	  test('when cart CSV data input has cell error, validate function return array with proper type and negative message error', () => {
		  const validationsArray = parser.validate(allValidationErrorsCartCSV)

		  expect(validationsArray).toHaveLength(4)
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
			cartSerialized.items.forEach((item, index) => {
				expect(item.name).toEqual(cart.items[index].name);
				expect(item.price).toEqual(cart.items[index].price);
				expect(item.quantity).toEqual(cart.items[index].quantity);
  			});
		})
	});
  });