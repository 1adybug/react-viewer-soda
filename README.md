# react-viewer-soda

[![NPM version](https://img.shields.io/npm/v/react-viewer-soda.svg?style=flat)](https://npmjs.org/package/react-viewer-soda)
[![NPM downloads](https://img.shields.io/npm/dm/react-viewer-soda)](https://npmjs.org/package/react-viewer-soda)

🥤 [viewerjs](https://npmjs.org/package/viewerjs) component for react

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

2. The acquisition of the `viewer` ref instance may have some delay, and directly reading it in `useEffect` might result in `null`. However, it should work fine in subsequent event calls.

    ```typescript
    import { FC } from "react"
    import { Image } from "react-viewer-soda"
    import Viewer from "viewerjs" 

    const App: FC = () => {
        const viewer = useRef<Viewer>(null)

        useEffect(() => {
            // it may be 'null'
            console.log(viewer.current)
        }, [])
        
        return (
            <div>
                <Image viewer={viewer} src="https://images.unsplash.com/photo-1608037521244-f1c6c7635194" width={640} />
            </div>
        )
    }

    export default App
    ```
