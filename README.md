# @devmehq/react-qr-code

A React component to generate [QR codes](http://en.wikipedia.org/wiki/QR_code).

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

React.render(
  <ReactQrCode value="http://facebook.github.io/react/" />,
  mountNode
);
```

```js
var React = require('react');
var { ReactQrCode } = require('@devmehq/react-qr-code');

React.render(
  <ReactQrCode value="http://facebook.github.io/react/" />,
  mountNode
);
```

## Available Props

| prop            | type                         | default value |
|-----------------|------------------------------|---------------|
| `value`         | `string`                     |               |
| `renderAs`      | `string` (`'canvas' 'svg'`)  | `'canvas'`    |
| `size`          | `number`                     | `128`         |
| `bgColor`       | `string` (CSS color)         | `"#FFFFFF"`   |
| `fgColor`       | `string` (CSS color)         | `"#000000"`   |
| `level`         | `string` (`'L' 'M' 'Q' 'H'`) | `'L'`         |
| `includeMargin` | `boolean`                    | `false`       |
| `imageSettings` | `object` (see below)         |               |

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

<img src="qrcode.png" height="256" width="256">


## LICENSE [MIT](LICENSE)
