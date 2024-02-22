import { appendFile } from 'fs/promises'
import path from 'path'
const contentToAppend = `
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // allow arbitrary elements
            // @ts-ignore suppress ts:2374 = Duplicate string index signature.
            [name: string]: any
        }
        interface IntrinsicAttributes {
            [key: \`$\${string}\`]: boolean;
            ref?: any
        }
        type ElementClass = Component
        type Element =  JSXElement
    }
}
`;

const filePath = path.join(process.cwd(), 'dist/axii.d.ts');

await appendFile(filePath, contentToAppend)
console.log('global Content successfully appended to file');
