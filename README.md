# hatch

A declaration generator for Google Apps Script

## Installation

1. Authenticate to GitHub Packages and specify the GitHub Packages URL along with the namespace:

   .npmrc

   ```
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   @hemlock5738:registry=https://npm.pkg.github.com
   ```

2. Install package:

   ```sh
   npm install -D @hemlock5738/hatch
   ```

## Example

```js
import { generate } from "@hemlock5738/hatch";

const src = `
const a1 = 1;
let a2;
var a3;
function a4() {}
class a5 {}
export { a1, a2, a3, a4, a5 };

export const b1 = undefined;
export let b2;
export var b3;
export function b4() {}
export class b5 {}

const c1 = undefined;
let c2;
var c3;
function c4() {}
class c5 {}
`

const res = generate(src);
console.log(res);
/*
Object.assign(globalThis, {
  a1: _.a1,
  a2: _.a2,
  a3: _.a3,
  a4: _.a4,
  a5: _.a5
});
var a1;
var a2;
var a3;
function a4() {}
var a5;
*/
```

## License

[MIT](LICENSE)
