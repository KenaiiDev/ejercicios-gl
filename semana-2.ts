import fs from "fs";
import chalk from "chalk";

type Id = number;
type Name = string;
type Price = number;
type Quantity = number;

type Product = [Id, Name, Price, Quantity];

class ProductNotFoundError extends Error {
  constructor(id: Id) {
    super(`Product with id: ${id} not found.`);
    this.name = "ProductNotFoundError";
  }
}

class ProductOutOfStockWarning extends Error {
  constructor(name: Name) {
    super(`Product ${name} is out of stock.`);
    this.name = "ProductOutOfStockWarning";
  }
}

type LogSearchProps = {
  id: Id;
  success: "SUCCESS" | "WARNING" | "ERROR";
  message: string;
  logToFile?: boolean;
};

const LOG_COLOR = {
  SUCCESS: chalk.green,
  WARNING: chalk.yellow,
  ERROR: chalk.red,
};

enum SUCCESS_LOGS {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

const logSearch = ({
  id,
  success,
  message,
  logToFile = false,
}: LogSearchProps) => {
  const timestamp =
    new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
  let logMessage = `[${timestamp} ${success}: ${message}]`;

  if (logToFile) {
    fs.appendFileSync("logs.txt", logMessage + "\n");
  }

  const colorFunction = LOG_COLOR[success];

  console.log(colorFunction(logMessage));
};

const findProduct = <T extends Product>(
  inventory: T[],
  id: Id
): T | undefined => {
  const product = inventory.find((item) => item[0] === id);

  if (!product) {
    const error = new ProductNotFoundError(id);
    logSearch({
      id: 4,
      success: SUCCESS_LOGS.ERROR,
      message: error.message,
      logToFile: true,
    });
    throw error;
  }

  const [_productId, name, _price, quantity] = product;

  if (!(quantity > 0)) {
    const warning = new ProductOutOfStockWarning(name);
    logSearch({
      id: 4,
      success: SUCCESS_LOGS.WARNING,
      message: warning.message,
      logToFile: true,
    });
    throw warning;
  }

  logSearch({
    id: 4,
    success: SUCCESS_LOGS.SUCCESS,
    message: `Product found: ${name}`,
    logToFile: true,
  });
  return product;
};

const inventory: Product[] = [
  [1, "Laptop", 999.99, 10],
  [2, "Mouse", 19.99, 0],
  [3, "Keyboard", 49.99, 5],
];

try {
  const product = findProduct(inventory, 1);
  console.log(product);
} catch (error) {}

try {
  const product = findProduct(inventory, 2);
  console.log(product);
} catch (error) {}

try {
  const product = findProduct(inventory, 3);
  console.log(product);
} catch (error) {}

try {
  const product = findProduct(inventory, 4);
  console.log(product);
} catch (error) {}
