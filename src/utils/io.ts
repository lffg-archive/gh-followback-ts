import { createInterface } from 'readline';
import * as chalk from 'chalk';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Asks for the user input.
 */
export function gets(message: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(message, (response) => {
      resolve(response.trim());
    });
  });
}

/**
 * Prints a normalized warning to the standard error.
 * The consumer must provide a level (error or warn).
 */
export function warn(level: 'error' | 'warning', message: string): void {
  const color = level === 'error' ? 'red' : 'yellow';
  console.error(chalk`{${color} ${level}} ${message}`);
}

/**
 * Prints a message (or a array of messages) to the standard output.
 */
export function puts(data?: string | string[]): void {
  const list = Array.isArray(data) ? data : [data || ''];
  for (const elm of list) {
    console.log(elm);
  }
}

/**
 * Clears the console.
 */
export function cls() {
  console.clear();
}

interface YesNoOptions {
  defaultResponse: 'yes' | 'no';
}

/**
 * Prompts the user with a yes/no (boolean) question.
 * Returns true if the user selects `yes` and false if the user selects `no`.
 */
export async function getsBoolean(
  message: string,
  options: YesNoOptions
): Promise<boolean> {
  const indicator = options.defaultResponse === 'yes' ? '[Y/n]' : '[y/N]';

  while (true) {
    const response =
      // eslint-disable-next-line no-await-in-loop
      (await gets(`${message} ${indicator} `)).toLowerCase() ||
      (options.defaultResponse === 'yes' ? 'y' : 'n');

    if (response !== 'y' && response !== 'n') {
      puts();
      warn('error', chalk`You may only select "{cyan y}" or "{cyan n}".`);
      continue;
    }

    return response === 'y';
  }
}

/**
 * Clears the terminal and registers the current step.
 * Returns the given step.
 */
export function registerStep<T extends Record<string, string>>(steps: T): T {
  cls();
  for (const [label, value] of Object.entries(steps)) {
    puts(chalk`{green >} ${label} {green ${value}}`);
  }
  puts();
  return steps;
}
