/**
 * Code Templates for the Secure Sandbox
 *
 * Provides pre-built templates for different languages, frameworks,
 * and use cases to help users get started quickly.
 */

import type { CodeTemplate, SupportedLanguage } from './types';
export type { CodeTemplate } from './types';

// JavaScript Templates
const javascriptTemplates: CodeTemplate[] = [
  {
    id: 'js-blank',
    name: 'Blank Template',
    description: 'Start with a clean slate',
    language: 'javascript',
    code: `// JavaScript Playground
// Write your code here

console.log('Hello, World!');
`,
    category: 'basic',
  },
  {
    id: 'js-stellar-account',
    name: 'Create Stellar Account',
    description: 'Generate a new Stellar keypair',
    language: 'javascript',
    code: `// Create a new Stellar account
const StellarSdk = require('stellar-sdk');

// Create a completely new and unique pair of keys
const pair = StellarSdk.Keypair.random();

console.log('=== New Stellar Account ===');
console.log('Public Key:', pair.publicKey());
console.log('Secret Key:', pair.secret());
console.log('');
console.log('⚠️ In production, never share your secret key!');
console.log('💡 Fund this account on testnet using Friendbot');
`,
    category: 'blockchain',
  },
  {
    id: 'js-stellar-balance',
    name: 'Check Stellar Balance',
    description: 'Query account balances on Stellar',
    language: 'javascript',
    code: `// Check account balance on Stellar network
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Public key of the account to check
const publicKey = 'GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD';

async function checkBalance() {
  console.log('Loading account:', publicKey);

  const account = await server.loadAccount(publicKey);

  console.log('\\n=== Account Balances ===');
  for (const balance of account.balances) {
    if (balance.asset_type === 'native') {
      console.log(\`XLM: \${balance.balance}\`);
    } else {
      console.log(\`\${balance.asset_code}: \${balance.balance}\`);
    }
  }
}

checkBalance();
`,
    category: 'blockchain',
  },
  {
    id: 'js-stellar-payment',
    name: 'Send Stellar Payment',
    description: 'Create and submit a payment transaction',
    language: 'javascript',
    code: `// Send a payment on Stellar network
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Source account (sender)
const sourceSecret = 'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4';
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);

// Destination account (receiver)
const destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

async function sendPayment() {
  console.log('=== Sending Stellar Payment ===');

  // Load source account
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  // Build transaction
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: destinationId,
      asset: StellarSdk.Asset.native(),
      amount: '10'
    }))
    .setTimeout(30)
    .build();

  // Sign transaction
  transaction.sign(sourceKeypair);

  // Submit transaction
  const result = await server.submitTransaction(transaction);
  console.log('\\n✅ Payment successful!');
  console.log('Transaction hash:', result.hash);
}

sendPayment();
`,
    category: 'blockchain',
  },
  {
    id: 'js-array-methods',
    name: 'Array Methods',
    description: 'Common JavaScript array operations',
    language: 'javascript',
    code: `// JavaScript Array Methods Demo

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('Original array:', numbers);

// map - transform each element
const doubled = numbers.map(n => n * 2);
console.log('\\nDoubled:', doubled);

// filter - keep elements that match condition
const evens = numbers.filter(n => n % 2 === 0);
console.log('Even numbers:', evens);

// reduce - combine all elements into single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);

// find - get first matching element
const firstOver5 = numbers.find(n => n > 5);
console.log('First number > 5:', firstOver5);

// some - check if any element matches
const hasNegative = numbers.some(n => n < 0);
console.log('Has negative?', hasNegative);

// every - check if all elements match
const allPositive = numbers.every(n => n > 0);
console.log('All positive?', allPositive);

// Chaining methods
const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 3)
  .reduce((acc, n) => acc + n, 0);
console.log('\\nEven numbers × 3, then sum:', result);
`,
    category: 'basic',
  },
  {
    id: 'js-async-await',
    name: 'Async/Await Patterns',
    description: 'Working with asynchronous JavaScript',
    language: 'javascript',
    code: `// Async/Await Patterns Demo

// Simulated API call
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: \`User \${id}\`, email: \`user\${id}@example.com\` });
    }, 500);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'First Post', userId },
        { id: 2, title: 'Second Post', userId },
      ]);
    }, 300);
  });
}

// Sequential async operations
async function sequential() {
  console.log('=== Sequential Execution ===');
  const user = await fetchUser(1);
  console.log('User:', user);

  const posts = await fetchPosts(user.id);
  console.log('Posts:', posts);
}

// Parallel async operations
async function parallel() {
  console.log('\\n=== Parallel Execution ===');
  const [user1, user2, user3] = await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3)
  ]);
  console.log('Users loaded:', [user1.name, user2.name, user3.name]);
}

// Run demos
async function main() {
  await sequential();
  await parallel();
  console.log('\\n✅ All done!');
}

main();
`,
    category: 'basic',
  },
  {
    id: 'js-fibonacci',
    name: 'Fibonacci Sequence',
    description: 'Classic algorithm implementation',
    language: 'javascript',
    code: `// Fibonacci Sequence Implementations

// 1. Recursive (simple but slow for large n)
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// 2. Iterative (efficient)
function fibIterative(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// 3. Memoized (efficient for repeated calls)
function fibMemoized() {
  const cache = new Map();
  return function fib(n) {
    if (cache.has(n)) return cache.get(n);
    if (n <= 1) return n;
    const result = fib(n - 1) + fib(n - 2);
    cache.set(n, result);
    return result;
  };
}

// 4. Generator (memory efficient for sequences)
function* fibGenerator() {
  let prev = 0, curr = 1;
  while (true) {
    yield prev;
    [prev, curr] = [curr, prev + curr];
  }
}

// Demo
console.log('=== Fibonacci Sequence ===\\n');

console.log('First 10 Fibonacci numbers:');
const gen = fibGenerator();
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${gen.next().value}\`);
}

console.log('\\nLarger values (iterative):');
[20, 30, 40].forEach(n => {
  console.log(\`F(\${n}) = \${fibIterative(n)}\`);
});
`,
    category: 'algorithm',
  },
];

// TypeScript Templates
const typescriptTemplates: CodeTemplate[] = [
  {
    id: 'ts-blank',
    name: 'Blank Template',
    description: 'Start with TypeScript',
    language: 'typescript',
    code: `// TypeScript Playground
// Note: TypeScript is executed as JavaScript in the sandbox

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
};

console.log('Hello, TypeScript!');
console.log('User:', user);
`,
    category: 'basic',
  },
  {
    id: 'ts-generics',
    name: 'TypeScript Generics',
    description: 'Working with generic types',
    language: 'typescript',
    code: `// TypeScript Generics Demo

// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic interface
interface Container<T> {
  value: T;
  getValue(): T;
}

// Generic class
class Box<T> implements Container<T> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}

// Usage examples
console.log('=== TypeScript Generics ===\\n');

const numBox = new Box(42);
console.log('Number box:', numBox.getValue());

const strBox = new Box('Hello');
console.log('String box:', strBox.getValue());

const mappedBox = numBox.map(n => n.toString()).map(s => s + '!');
console.log('Mapped box:', mappedBox.getValue());

// Generic constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(\`Length: \${item.length}\`);
}

logLength('Hello'); // string has length
logLength([1, 2, 3]); // array has length
`,
    category: 'basic',
  },
];

// Python Templates
const pythonTemplates: CodeTemplate[] = [
  {
    id: 'py-blank',
    name: 'Blank Template',
    description: 'Start with Python',
    language: 'python',
    code: `# Python Playground
# Write your code here

print("Hello, Python!")

# Try help_sandbox() to see available features
`,
    category: 'basic',
  },
  {
    id: 'py-list-comprehension',
    name: 'List Comprehensions',
    description: 'Python list comprehension examples',
    language: 'python',
    code: `# Python List Comprehensions

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print("Original:", numbers)

# Basic comprehension
squares = [x**2 for x in numbers]
print("\\nSquares:", squares)

# With condition (filter)
evens = [x for x in numbers if x % 2 == 0]
print("Evens:", evens)

# With transformation and condition
even_squares = [x**2 for x in numbers if x % 2 == 0]
print("Even squares:", even_squares)

# Nested comprehension (2D grid)
grid = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print("\\nMultiplication grid:")
for row in grid:
    print(row)

# Dictionary comprehension
square_dict = {x: x**2 for x in range(1, 6)}
print("\\nSquare dictionary:", square_dict)

# Set comprehension
unique_lengths = {len(word) for word in ["hello", "world", "python", "code"]}
print("Unique word lengths:", unique_lengths)
`,
    category: 'basic',
  },
  {
    id: 'py-classes',
    name: 'Python Classes',
    description: 'Object-oriented programming in Python',
    language: 'python',
    code: `# Python Classes and OOP

class Animal:
    """Base class for animals"""

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def speak(self):
        raise NotImplementedError("Subclass must implement")

    def __str__(self):
        return f"{self.__class__.__name__}(name={self.name}, age={self.age})"


class Dog(Animal):
    """Dog class inheriting from Animal"""

    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed

    def speak(self):
        return f"{self.name} says: Woof!"

    def fetch(self):
        return f"{self.name} is fetching the ball!"


class Cat(Animal):
    """Cat class inheriting from Animal"""

    def speak(self):
        return f"{self.name} says: Meow!"

    def purr(self):
        return f"{self.name} is purring..."


# Create instances
print("=== Python OOP Demo ===\\n")

dog = Dog("Buddy", 3, "Golden Retriever")
cat = Cat("Whiskers", 5)

print(dog)
print(cat)

print()
print(dog.speak())
print(dog.fetch())
print()
print(cat.speak())
print(cat.purr())

# Polymorphism
print("\\n=== Polymorphism ===")
animals = [dog, cat]
for animal in animals:
    print(animal.speak())
`,
    category: 'basic',
  },
  {
    id: 'py-fibonacci',
    name: 'Fibonacci Sequence',
    description: 'Multiple implementations of Fibonacci',
    language: 'python',
    code: `# Fibonacci Sequence in Python

# 1. Recursive (simple but slow)
def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)

# 2. Iterative (efficient)
def fib_iterative(n):
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr

# 3. Memoized with decorator
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memoized(n):
    if n <= 1:
        return n
    return fib_memoized(n - 1) + fib_memoized(n - 2)

# 4. Generator (memory efficient)
def fib_generator():
    prev, curr = 0, 1
    while True:
        yield prev
        prev, curr = curr, prev + curr

# Demo
print("=== Fibonacci Sequence ===\\n")

print("First 10 Fibonacci numbers:")
gen = fib_generator()
for i in range(10):
    print(f"F({i}) = {next(gen)}")

print("\\nLarger values (memoized):")
for n in [20, 30, 40]:
    print(f"F({n}) = {fib_memoized(n)}")
`,
    category: 'algorithm',
  },
  {
    id: 'py-sorting',
    name: 'Sorting Algorithms',
    description: 'Common sorting algorithm implementations',
    language: 'python',
    code: `# Sorting Algorithms in Python
import random

# Bubble Sort - O(n²)
def bubble_sort(arr):
    arr = arr.copy()
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Quick Sort - O(n log n) average
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Merge Sort - O(n log n)
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Demo
print("=== Sorting Algorithms Demo ===\\n")

# Create random array
original = [random.randint(1, 100) for _ in range(10)]
print("Original array:", original)

print("\\nBubble Sort:", bubble_sort(original))
print("Quick Sort:", quick_sort(original))
print("Merge Sort:", merge_sort(original))
print("Built-in Sort:", sorted(original))
`,
    category: 'algorithm',
  },
  {
    id: 'py-data-structures',
    name: 'Data Structures',
    description: 'Python data structure implementations',
    language: 'python',
    code: `# Python Data Structures

from collections import deque

# Stack (LIFO) using list
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop() if self.items else None

    def peek(self):
        return self.items[-1] if self.items else None

    def is_empty(self):
        return len(self.items) == 0

    def __str__(self):
        return f"Stack({self.items})"


# Queue (FIFO) using deque
class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        return self.items.popleft() if self.items else None

    def front(self):
        return self.items[0] if self.items else None

    def is_empty(self):
        return len(self.items) == 0

    def __str__(self):
        return f"Queue({list(self.items)})"


# Demo
print("=== Stack Demo ===")
stack = Stack()
for i in range(1, 4):
    stack.push(i)
    print(f"Pushed {i}: {stack}")

print(f"\\nPeek: {stack.peek()}")
print(f"Pop: {stack.pop()}")
print(f"After pop: {stack}")

print("\\n=== Queue Demo ===")
queue = Queue()
for i in range(1, 4):
    queue.enqueue(i)
    print(f"Enqueued {i}: {queue}")

print(f"\\nFront: {queue.front()}")
print(f"Dequeue: {queue.dequeue()}")
print(f"After dequeue: {queue}")
`,
    category: 'data-structure',
  },
];

// All templates combined
export const codeTemplates: CodeTemplate[] = [
  ...javascriptTemplates,
  ...typescriptTemplates,
  ...pythonTemplates,
];

/**
 * Get templates by language
 */
export function getTemplatesByLanguage(
  language: SupportedLanguage,
): CodeTemplate[] {
  return codeTemplates.filter((t) => t.language === language);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: CodeTemplate['category'],
): CodeTemplate[] {
  return codeTemplates.filter((t) => t.category === category);
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): CodeTemplate | undefined {
  return codeTemplates.find((t) => t.id === id);
}

/**
 * Get the default template for a language
 */
export function getDefaultTemplate(language: SupportedLanguage): CodeTemplate {
  const defaults: Record<SupportedLanguage, string> = {
    javascript: 'js-blank',
    typescript: 'ts-blank',
    python: 'py-blank',
  };

  return getTemplateById(defaults[language]) || codeTemplates[0];
}

/**
 * Get all template categories
 */
export function getTemplateCategories(): CodeTemplate['category'][] {
  return ['basic', 'blockchain', 'algorithm', 'data-structure', 'web3'];
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(
  category: CodeTemplate['category'],
): string {
  const names: Record<CodeTemplate['category'], string> = {
    basic: 'Basic',
    blockchain: 'Blockchain',
    algorithm: 'Algorithms',
    'data-structure': 'Data Structures',
    web3: 'Web3',
  };
  return names[category];
}
