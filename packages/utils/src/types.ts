export type Nullable<T> = T | null | undefined;
export type PartialBy<T, K extends keyof T = never> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type Point = { x: number; y: number };
export type Size = { w: number; h: number };
export type Circle = Point & { r: number };
export type Rectangle = Point & Size;
export type Boundaries<T = number> = { min: T; max: T };
export type Range = Boundaries<number>;
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
export type Matrix<T> = T[][];
export type AnyObject = { [key: string]: any };
export type AnyFunction = (...args: any[]) => any;
export type Values<T> = T[keyof T];
export type Override<A, B> = Omit<A, keyof B> & B;
export type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key];
};
export type Constructor<T = AnyObject> = new (...args: any[]) => T;
export type AnyConstructor = Constructor<AnyObject>;
export type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;
