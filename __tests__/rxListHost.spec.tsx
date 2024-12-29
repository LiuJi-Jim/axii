/** @vitest-environment happy-dom */
/** @jsx createElement */
import {createElement, createRoot} from "@framework";
import {atom, RxList, RxMap} from "data0";
import {beforeEach, describe, expect, test} from "vitest";


describe('rxList render', () => {

    let root: ReturnType<typeof createRoot>
    let rootEl: HTMLElement
    beforeEach(() => {
        document.body.innerHTML = ''
        rootEl = document.createElement('div')
        document.body.appendChild(rootEl)
        root = createRoot(rootEl)
    })


    test('basic list', () => {
        const arr = new RxList<number>([])

        function App() {
            return <div>
                {arr.map((item) => <div>{item}</div>)}
            </div>
        }

        root.render(<App/>)

        expect(rootEl.firstElementChild!.children.length).toBe(0)
        arr.push(1,2,3)

        expect(rootEl.firstElementChild!.children.length).toBe(3)
        expect(rootEl.firstElementChild!.children[0].innerHTML).toBe('1')
        expect(rootEl.firstElementChild!.children[1].innerHTML).toBe('2')
        expect(rootEl.firstElementChild!.children[2].innerHTML).toBe('3')

        arr.push(4, 5)
        expect(rootEl.firstElementChild!.children.length).toBe(5)
        expect(rootEl.firstElementChild!.children[3].innerHTML).toBe('4')
        expect(rootEl.firstElementChild!.children[4].innerHTML).toBe('5')

        arr.pop()
        expect(arr.length()).toBe(4)
        expect(rootEl.firstElementChild!.children.length).toBe(4)
        expect(rootEl.firstElementChild!.children[3].innerHTML).toBe('4')
        expect(rootEl.firstElementChild!.children[4]).toBeUndefined()

        arr.unshift(-1, 0)
        expect(rootEl.firstElementChild!.children.length).toBe(6)
        expect(rootEl.firstElementChild!.children[0].innerHTML).toBe('-1')
        expect(rootEl.firstElementChild!.children[1].innerHTML).toBe('0')
        expect(rootEl.firstElementChild!.children[2].innerHTML).toBe('1')
        expect(rootEl.firstElementChild!.children[3].innerHTML).toBe('2')
        expect(rootEl.firstElementChild!.children[4].innerHTML).toBe('3')
        expect(rootEl.firstElementChild!.children[5].innerHTML).toBe('4')

        arr.shift()
        expect(rootEl.firstElementChild!.children.length).toBe(5)
        expect(rootEl.firstElementChild!.children[0].innerHTML).toBe('0')
        //
        arr.splice(2, 1, 9, 99, 999)
        expect(rootEl.firstElementChild!.children.length).toBe(7)
        expect(rootEl.firstElementChild!.children[0].innerHTML).toBe('0')
        expect(rootEl.firstElementChild!.children[1].innerHTML).toBe('1')
        expect(rootEl.firstElementChild!.children[2].innerHTML).toBe('9')
        expect(rootEl.firstElementChild!.children[3].innerHTML).toBe('99')
        expect(rootEl.firstElementChild!.children[4].innerHTML).toBe('999')
        expect(rootEl.firstElementChild!.children[5].innerHTML).toBe('3')
        expect(rootEl.firstElementChild!.children[6].innerHTML).toBe('4')

    })

    test('list with outer reactive value', () => {
        const arr = new RxList<number>([1,2,3])
        const base = atom(0)
        function App() {
            return <div>
                {arr.map((item) => <div>{base() + item}</div>)}
            </div>
        }

        root.render(<App/>)
        expect(rootEl.firstElementChild!.children.length).toBe(3)
        expect(rootEl.firstElementChild!.children[0].innerHTML).toBe('1')
        expect(rootEl.firstElementChild!.children[1].innerHTML).toBe('2')
        expect(rootEl.firstElementChild!.children[2].innerHTML).toBe('3')

        base(1)
        expect(rootEl.firstElementChild!.children.length).toBe(3)
        expect(rootEl.firstElementChild!.children[0].innerHTML).toBe('2')
        expect(rootEl.firstElementChild!.children[1].innerHTML).toBe('3')
        expect(rootEl.firstElementChild!.children[2].innerHTML).toBe('4')
    })

    test('chained list', () => {

        const map1 = new RxMap<string, string>({})
        const keys = map1.keys()

        function App() {
            return <div>
                {keys.map((key) => <div>{key}</div>)}
            </div>
        }
        root.render(<App/>)
        expect(rootEl.firstElementChild!.children.length).toBe(0)

        map1.replace({name1:true, name2:true})
        expect(rootEl.firstElementChild!.children.length).toBe(2)
    })

    test('delete item at tail and head', () => {
        const arr = new RxList<number>([1,2])

        function App() {
            return <div>
                {arr.map((item) => <div>{item}</div>)}
            </div>
        }

        root.render(<App/>)

        expect(rootEl.firstElementChild!.children.length).toBe(2)
        arr.splice(1, 1)

        expect(arr.data.length).toBe(1)
        expect(rootEl.firstElementChild!.children.length).toBe(1)

        arr.splice(0, 1)
        expect(rootEl.firstElementChild!.children.length).toBe(0)
    })

    test('delete all items at once', () => {
        const arr = new RxList<number>([1,2])

        function App() {
            return <div>
                {arr.map((item) => <div>{item}</div>)}
            </div>
        }

        root.render(<App/>)
        arr.splice(0, Infinity)
        expect(rootEl.firstElementChild!.children.length).toBe(0)

        // 重新插入
        arr.push(1,2)
        expect(rootEl.firstElementChild!.children.length).toBe(2)
    })
})
