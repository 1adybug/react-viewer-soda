import { ForwardedRef, HTMLAttributes, ImgHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import Viewer from "viewerjs"
import "viewerjs/dist/viewer.css"

function getPreviewUrl(image: HTMLImageElement) {
    const url = image.getAttribute("data-rvs-url")
    if (typeof url === "string" && !!url.trim()) return url
    return image.src
}

export type ViewerOptions = Viewer.Options

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    /** You can get the instance of the viewer by passing a ref to the viewer property in props. */
    viewer?: ForwardedRef<Viewer>
    /** options for viewer */
    options?: ViewerOptions
}

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
    const { viewer: viewerRef, options: originalOptions, ...others } = props
    const options: ViewerOptions = { navbar: false, ...originalOptions }
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [viewer, setViewer] = useState<Viewer | null>(null)

    useImperativeHandle(ref, () => image!, [image])
    useImperativeHandle(viewerRef, () => viewer!, [viewer])

    useEffect(() => {
        if (!image) return
        options.url ??= getPreviewUrl
        const viewer = new Viewer(image, options)
        setViewer(viewer)
        return () => {
            viewer.destroy()
        }
    }, [image])

    return <img data-rvs-image ref={ins => setImage(ins)} {...others} />
})

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

export const ImageGroup = forwardRef<HTMLDivElement, ImageGroupProps>((props, ref) => {
    const { viewer: viewerRef, options: originalOptions, filterMode, ...others } = props
    const options = { ...originalOptions }
    const { filter } = options
    options.filter = (image: HTMLImageElement) => !image.getAttribute("data-rvs-image") && ((filterMode === "include" && image.getAttribute("data-rvs")) || (filterMode !== "include" && !image.getAttribute("data-no-rvs"))) && (!filter || filter(image))

    const [div, setDiv] = useState<HTMLDivElement | null>(null)
    const [viewer, setViewer] = useState<Viewer | null>(null)

    useImperativeHandle(ref, () => div!, [div])
    useImperativeHandle(viewerRef, () => viewer!, [viewer])

    useEffect(() => {
        if (!div) return
        options.url ??= getPreviewUrl
        const viewer = new Viewer(div, options)
        setViewer(viewer)
        return () => {
            viewer.destroy()
        }
    }, [div])

    return <div data-rvs-group ref={ins => setDiv(ins)} {...others} />
})
