export * from './modifiers';

/**
 * Modifiers are expected to be used to "modify" a base value, for example to oscilate around a certain
 * number, you could use a modifer that would give a value between 0..1 that would change in an expected
 * way that correlated with time to multiply times a base value.
 */
export type TimedModifier = (time: number) => number;

/**
 * Values are the next step in using modifiers. For example, if you wanted to return a value that oscillated
 * as described above, you could create an implementation that returns a TimedValue function which under the covers
 * uses modifers to create that value. TODO: perhaps this could be interface instead, as may want many different
 * "getValue" type functions that pass different single parameters.
 */
export type SimpleValue = () => number;
export type TimedValue = (time: number) => number;