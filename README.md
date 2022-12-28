# @devmehq/react-qr-code

Simple & Advanced React component to generate [QR codes](http://en.wikipedia.org/wiki/QR_code)


[![NPM version](https://badgen.net/npm/v/@devmehq/react-qr-code)](https://npm.im/@devmehq/react-qr-code)
[![Build Status](https://github.com/devmehq/react-qr-code/workflows/CI/badge.svg)](https://github.com/devmehq/react-qr-code/actions)
[![Downloads](https://img.shields.io/npm/dm/@devmehq/react-qr-code.svg)](https://www.npmjs.com/package/@devmehq/react-qr-code)
[![UNPKG](https://img.shields.io/badge/UNPKG-OK-179BD7.svg)](https://unpkg.com/browse/@devmehq/react-qr-code@latest/)

[![Edit react-qr-code-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-qr-code-demo-ccho5l?fontsize=14&hidenavigation=1&theme=dark)
## Installation

```npm
npm install @devmehq/react-qr-code
```

```yarn
yarn install @devmehq/react-qr-code
```

## Usage

```typescript
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';

<ReactQrCode value="http://facebook.github.io/react/" />
```

```js
var React = require('react');
var { ReactQrCode } = require('@devmehq/react-qr-code');

<ReactQrCode value="http://facebook.github.io/react/" />
```

## Available Props

| prop         | type                         | default value |
|--------------|------------------------------|---------------|
| `value`      | `string`                     |               |
| `renderAs`   | `string` (`'canvas' 'svg'`)  | `'canvas'`    |
| `size`       | `number`                     | `128`         |
| `bgColor`    | `string` (CSS color)         | `"#FFFFFF"`   |
| `fgColor`    | `string` (CSS color)         | `"#000000"`   |
| `level`      | `string` (`'L' 'M' 'Q' 'H'`) | `'L'`         |
| `marginSize` | `number`                     | `false`       |
| `images`     | `array` (see below)          |               |

### `imageSettings`

| field      | type      | default value     |
|------------|-----------|-------------------|
| `src`      | `string`  |                   |
| `x`        | `number`  | none, will center |
| `y`        | `number`  | none, will center |
| `height`   | `number`  | 10% of `size`     |
| `width`    | `number`  | 10% of `size`     |
| `excavate` | `boolean` | `false`           |

## Custom Styles

`@devmehq/react-qr-code` will pass through any additional props to the underlying DOM node (`<svg>` or `<canvas>`). This allows the use of inline `style` or custom `className` to customize the rendering. One common use would be to support a responsive layout.

**Note:** In order to render QR Codes in `<canvas>` on high density displays, we scale the canvas element to contain an appropriate number of pixels and then use inline styles to scale back down. We will merge any additional styles, with custom `height` and `width` overriding our own values. This allows scaling to percentages *but* if scaling beyond the `size`, you will encounter blurry images. I recommend detecting resizes with something like [react-measure](https://github.com/souporserious/react-measure) to detect and pass the appropriate size when rendering to `<canvas>`.

<img src="https://github.com/devmehq/react-qr-code/raw/master/examples/qrcode-demo.png" alt="qrcode-demo">


## TODO
- Add Image Ref
- Add Corner Images and Center Image
- Add Examples to wifi password, 2fa, and other QR codes
- ADD SSR Rendering Support
- Add Download / Share QR Code
- Add Test
- Add codesandbox

## LICENSE [MIT](LICENSE.md)
