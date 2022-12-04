import typescript from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'lib/mid-vue.esm.js',
    },
    {
      format: 'es',
      file: 'lib/mid-vue.cjs.js',
    },
  ],
  plugins: [
    typescript()
  ]
}