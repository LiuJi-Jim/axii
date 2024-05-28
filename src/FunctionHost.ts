import {Atom, atomComputed, autorun, destroyComputed, Notifier} from "data0";
import {Host, PathContext} from "./Host";
import {createHost} from "./createHost";
import {insertBefore} from './DOM'

// CAUTION 纯粹的动态结构，有变化就重算，未来考虑做 dom diff, 现在不做
type FunctionNode = () => ChildNode|DocumentFragment|string|number|null|boolean

export class FunctionHost implements Host{
    stopAutoRender!: () => any
    fragmentParent = document.createDocumentFragment()
    innerHost?: Atom<Host>
    constructor(public source: FunctionNode, public placeholder:Comment, public pathContext: PathContext) {
    }
    get parentElement() {
        return this.placeholder.parentElement || this.fragmentParent
    }
    get element() : HTMLElement|Comment|Text|SVGElement{
        return this.innerHost?.().element || this.placeholder
    }
    render(): void {

        this.innerHost = atomComputed(() => {
                const node = this.source()
                const newPlaceholder = document.createComment('computed node')
                insertBefore(newPlaceholder, this.placeholder)
                return createHost(node, newPlaceholder, {...this.pathContext, hostPath: [...this.pathContext.hostPath, this]})
            }
        )

        let lastRenderedHost: Host|undefined
        this.stopAutoRender = autorun(() => {
            // CAUTION 每次都清空上一次的结果
            if(lastRenderedHost) {
                lastRenderedHost.destroy(false, false)
            }

            lastRenderedHost = this.innerHost!()!
            Notifier.instance.pauseTracking()
            lastRenderedHost.render()
            Notifier.instance.resetTracking()
        })
    }
    destroy(parentHandle?: boolean, parentHandleComputed?: boolean) {
        const innerHost = this.innerHost!()!
        if (!parentHandleComputed) {
            this.stopAutoRender()
            // destroyComputed(this.renderComputed)
            destroyComputed(this.innerHost!)
        }
        innerHost?.destroy(parentHandle, !parentHandleComputed)
        if (!parentHandle) {
            this.placeholder.remove()
        }
    }
}