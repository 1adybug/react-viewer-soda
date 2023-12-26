# react-viewer-soda

[![NPM version](https://img.shields.io/npm/v/react-viewer-soda.svg?style=flat)](https://npmjs.org/package/react-viewer-soda)
[![NPM downloads](https://img.shields.io/npm/dm/react-viewer-soda)](https://npmjs.org/package/react-viewer-soda)

🥤 [viewerjs](https://npmjs.org/package/viewerjs) component for react. Automatically detect changes in internal images.

## Usage

### Image

type:

```typescript
export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    /** You can get the instance of the viewer by passing a ref to the viewer property in props. */
    viewer?: ForwardedRef<Viewer>
    /** options for viewer */
    options?: ViewerOptions
}
```

Using it is just like a normal `img` element:

```typescript
import { FC } from "react"
import { Image } from "react-viewer-soda"
import Viewer from "viewerjs" 

const App: FC = () => {
    const viewer = useRef<Viewer>(null)

    return (
        <div>
            <Image viewer={viewer} src="https://images.unsplash.com/photo-1608037521244-f1c6c7635194" width={640} />
        </div>
    )
}

export default App
```

### ImageGroup

type:

```typescript
export interface ImageGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** You can get the instance of the viewer by passing a ref to the viewer property in props. */
    viewer?: ForwardedRef<Viewer>
    /** You can specify the mode for filtering images.
     * When the mode is 'exclude', img elements with 'data-no-rvs' will not be previewed.
     * When the mode is 'include', only img elements with 'data-rvs' will be previewed.
     * The default value is 'exclude'. */
    filterMode?: "exclude" | "include"
    /** options for viewer */
    options?: ViewerOptions
    /** Whether to automatically detect changes in the internal images.
     * The default value is true. */
    autoUpdate?: boolean
}
```

Using it is just like a normal `div` element:

```typescript
import { FC, useRef } from "react"
import { ImageGroup } from "react-viewer-soda"
import Viewer from "viewerjs" 

const App: FC = () => {
    const viewer = useRef<Viewer>(null)

    return (
        <ImageGroup viewer={viewer}>
            <img src="https://w.wallhaven.cc/full/4o/wallhaven-4oggo9.jpg" width={640} />
            <img src="https://w.wallhaven.cc/full/nr/wallhaven-nrz77q.jpg" width={640} />
            {/* The image below will not be previewed */}
            <img data-no-rvs src="https://w.wallhaven.cc/full/4d/wallhaven-4d666l.jpg" width={640} />
        </ImageGroup>
    )
}

export default App
```

### Tips

1. You can provide the `data-rvs-url` on the `img` element to change the image for the preview:

    ```typescript
    <img src="small.jpg" data-rvs-url="large.jpg" />    
    ```

2. `ImageGroup` has an `autoUpdate` property with a default value of `true`. When enabled, it detects changes in the internal images and automatically calls `viewer.update`. If your `img` elements are not going to change, you can set it to `false`. Only these changes will be detected:

    1. The addition or deletion of `img` elements.
    2. The `data-rvs` and `data-no-rvs` attributes of `img` elements.

    If your `img` elements will only change attributes other than `data-rvs` and `data-no-rvs`, such as `src` or `data-rvs-url`, there is no need to enable `autoUpdate`.
