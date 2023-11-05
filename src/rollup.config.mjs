import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import { writeFileSync } from 'fs';

export default {
    input: 'src/ts/main.ts',
    output: {
        dir: 'dist/js',
        format: 'umd'
    },
    plugins: [
        typescript({
            tsconfig: 'src/ts/tsconfig.json',
            sourceMap: false
        }),
        scss({
            name: 'output.css',
            fileName: 'styles.css',
            watch: ['src/scss'],
            output: function (styles, styleNodes) {
                writeFileSync('dist/css/bundle.css', styles);
            }
        })
    ]
};
