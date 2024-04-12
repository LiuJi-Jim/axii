
// Global compile-time constants
import { Component, JSXElement } from "@framework";

declare var __DEV__: boolean

declare global {
    var __DEV__: boolean
    namespace JSX {
        interface IntrinsicElements {
            // allow arbitrary elements
            // @ts-ignore suppress ts:2374 = Duplicate string index signature.
            [name: string]: any
        }
        interface IntrinsicAttributes {
            // [key: `$${string}`]: boolean;
            // name an element inside component so it can be overwritten
            as?: string
            ref?: any
            rectRef?: any
            // pass props to an element inside component
            [key: `$${string}:${string}`]: any
        }
        type ElementClass = Component
        type Element =  JSXElement
    }
}

export {}
