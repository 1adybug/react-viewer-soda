import { ForwardedRef, HTMLAttributes, ImgHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import Viewer from "viewerjs"
import "viewerjs/dist/viewer.css"

function getPreviewUrl(image: HTMLImageElement) {
    const url = image.getAttribute("data-rvs-url")
    if (typeof url === "string" && !!url.trim()) return url
    return image.src
}

function booleanAttribute(ele: HTMLElement, attribute: string) {
    const attr = ele.getAttribute(attribute)
    return !(attr === null || attr === "false")
}

function ifMutationRecordIsImage(record: MutationRecord) {
    return (record.type === "attributes" && record.target instanceof HTMLImageElement) || (record.type === "childList" && (Array.from(record.addedNodes).some(ele => ele instanceof HTMLImageElement) || Array.from(record.removedNodes).some(ele => ele instanceof HTMLImageElement)))
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
    const image = useRef<HTMLImageElement | null>(null)
    const viewer = useRef<Viewer | null>(null)

    useImperativeHandle(ref, () => image.current!)
    useImperativeHandle(viewerRef, () => viewer.current!)

    useEffect(() => {
        options.url ??= getPreviewUrl
        viewer.current = new Viewer(image.current!, options)
        return () => {
            viewer.current!.destroy()
        }
    }, [])

    return <img data-rvs-image ref={image} {...others} />
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
    /** Whether to automatically detect changes in the internal images.
     * The default value is true. */
    autoUpdate?: boolean
}

export const ImageGroup = forwardRef<HTMLDivElement, ImageGroupProps>((props, ref) => {
    const { viewer: viewerRef, options: originalOptions, filterMode, autoUpdate = true, ...others } = props
    const options = { ...originalOptions }
    const { filter } = options
    options.filter = (image: HTMLImageElement) => {
        console.log(image.getAttribute("data-no-rvs"))
        console.log(typeof image.getAttribute("data-no-rvs"))
        return !booleanAttribute(image, "data-rvs-image") && ((filterMode === "include" && booleanAttribute(image, "data-rvs")) || (filterMode !== "include" && !booleanAttribute(image, "data-no-rvs"))) && (!filter || filter(image))
    }

    const div = useRef<HTMLImageElement | null>(null)
    const viewer = useRef<Viewer | null>(null)

    useImperativeHandle(ref, () => div.current!)
    useImperativeHandle(viewerRef, () => viewer.current!)

    useEffect(() => {
        options.url ??= getPreviewUrl
        viewer.current = new Viewer(div.current!, options)
        return () => {
            viewer.current!.destroy()
        }
    }, [])

    useEffect(() => {
        if (!autoUpdate) return
        const observer = new MutationObserver(mutations => {
            if (mutations.some(ifMutationRecordIsImage)) viewer.current!.update()
        })
        observer.observe(div.current!, { childList: true, subtree: true, attributeFilter: ["data-rvs-image", "data-rvs", "data-no-rvs"] })

        return () => {
            observer.disconnect()
        }
    }, [autoUpdate])

    return <div data-rvs-group ref={div} {...others} />
})
