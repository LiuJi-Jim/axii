/** @vitest-environment happy-dom */
/** @jsx createElement */
import {beforeEach, describe, expect, test} from "vitest";
import {createRoot, RenderContext, createElement, createRxRectRef} from "@framework";
import {atom} from "data0";
import { Window } from 'happy-dom'

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

    test('attach rect ref', async () => {
        const rectRef = createRxRectRef({size: true})
        const innerText = atom('hello world')
        function App({}, {createElement}: RenderContext) {
            return (
                <div rectRef={rectRef}>{innerText}</div>
            )
        }

        root.render(<App />)

        await window.happyDOM.waitUntilComplete()

        expect(rectRef.current).not.toBeNull()
        expect(rectRef.current!.top).not.toBeNull()
        expect(rectRef.current!.left).not.toBeNull()
        expect(rectRef.current!.width).not.toBeNull()
        expect(rectRef.current!.height).not.toBeNull()

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

        function App({}, {createElement,  createRxRectRef}: RenderContext) {

            const portalRectRef = createRxRectRef({size: true, target: portalContainer})

            return (
                <div>{portalRectRef.current?.top}</div>
            )
        }

        root.render(<App ref={appRef}/>)

        expect(rootEl.innerText).toBe('0')
        expect(appRef().manualHandledRxRectRefs.length).toBe(1)

        root.destroy()
        expect(createElement.isElementRectObserved(portalContainer)).toBe(false)

    })

})