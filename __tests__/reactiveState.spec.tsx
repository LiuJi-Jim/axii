/** @vitest-environment happy-dom */
/** @jsx createElement */
import {beforeEach, describe, expect, test} from "vitest";
import {createElement, createRoot, reactiveSize, RenderContext, SizeObject} from "@framework";
import {atom} from "data0";
import {Window} from 'happy-dom'

describe('ref', () => {

    let root: ReturnType<typeof createRoot>
    let rootEl: any
    let portalContainer: any
    let window: Window
    beforeEach(() => {
        window = new Window({ width: 768, height: 1024})
        const document = window.document
        document.body.innerHTML = ''
        rootEl = document.createElement('div')
        portalContainer = document.createElement('div')
        document.body.style.width = '800px'
        document.body.style.height = 'auto'
        document.body.appendChild(rootEl)
        document.body.appendChild(portalContainer)
        root = createRoot(rootEl)
    })

    test('create reactive size state', async () => {
        let size: any
        const innerText = atom('hello world')
        function App({}, {createElement, createStateFromRef}: RenderContext) {
            size = createStateFromRef<SizeObject>(reactiveSize)
            return (
                <div ref={size.ref}>{innerText}</div>
            )
        }

        root.render(<App />)

        await window.happyDOM.waitUntilComplete()

        expect(size()).not.toBeNull()
        expect(size()!.width).not.toBeNull()
        expect(size()!.height).not.toBeNull()

        // TODO happy-dom ResizeObeserver not working
        //
        // const last = rectRef.current
        // innerText('hello world 2')
        // await window.happyDOM.waitUntilComplete()
        //
        // console.log(window.document.body.clientWidth)
        // console.log(window.document.body.innerHTML)
        //
        // expect(rectRef.current.width).not.toEqual(last.width)
    })


    test('createRxRectRef with manual handled', async () => {
        const appRef = atom<any>(null)

        function App({}, {createElement,  createStateFromRef}: RenderContext) {

            const portalRectRef = createStateFromRef<SizeObject>(reactiveSize,undefined, portalContainer)

            return (
                <div>{portalRectRef()?.width}</div>
            )
        }

        root.render(<App ref={appRef}/>)

        expect(rootEl.innerText).toBe('0')
        const lastAppRef = appRef()
        expect(lastAppRef.cleanupsOfExternalTarget.size).toBe(1)

        root.destroy()
        expect(lastAppRef.cleanupsOfExternalTarget.size).toBe(0)

    })

})