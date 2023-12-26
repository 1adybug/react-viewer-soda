import { ForwardedRef, HTMLAttributes, ImgHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import Viewer from "viewerjs"
import "viewerjs/dist/viewer.css"

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    viewer?: ForwardedRef<Viewer>
    options?: Viewer.Options
}

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
    const { viewer: viewerRef, options, ...others } = props
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [viewer, setViewer] = useState<Viewer | null>(null)

    useImperativeHandle(ref, () => image!, [image])
    useImperativeHandle(viewerRef, () => viewer!, [viewer])

    useEffect(() => {
        if (!image) return
        const viewer = new Viewer(image)
        setViewer(viewer)
        return () => {
            viewer.destroy()
        }
    }, [image])

    return <img data-rvs-image ref={ins => setImage(ins)} {...others} />
})

export interface ImageGroupProps extends HTMLAttributes<HTMLDivElement> {
    viewer?: ForwardedRef<Viewer>
    filterMode?: "exclude" | "include"
    options?: Viewer.Options
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
        const viewer = new Viewer(div, options)
        setViewer(viewer)
        return () => {
            viewer.destroy()
        }
    }, [div])

    return <div data-rvs-group ref={ins => setDiv(ins)} {...others} />
})
