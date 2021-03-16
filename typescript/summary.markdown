# TS 学习记录

## keyof

`keyof` 与 `Object.keys` 略有相似，只不过 `keyof` 取 `interface` 的键

```typescript
interface Point {
    x: number;
    y: number;
}

// type keys = "x" | "y"
type keys = keyof Point;
```

## Partial & Pick

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  id: number;
  age: number;
  name: string;
};

// 相当于: type PartialUser = { id?: number; age?: number; name?: string; }
type PartialUser = Partial<User>

// 相当于: type PickUser = { id: number; age: number; }
type PickUser = Pick<User, "id" | "age">

```

## Condition Type

```typescript
T extends U ? X : Y

type isTrue<T> = T extends true ? true : false
// 相当于 type t = false
type t = isTrue<number>

// 相当于 type t = false
type t1 = isTrue<false>

```

## typeof

`typeof` 代表取某个值的 type

```typescript
import logger from './logger'
import utils from './utils'

interface Context extends KoaContect {
  logger: typeof logger,
  utils: typeof utils
}

app.use((ctx: Context) => {
  ctx.logger.info('hello, world')

  // 会报错，因为 logger.ts 中没有暴露此方法，可以最大限度的避免拼写错误
  ctx.loger.info('hello, world')
})
```
