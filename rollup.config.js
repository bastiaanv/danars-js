export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'danajs',
      globals: {
        '@capacitor/core': 'capacitorExports',
        '@capacitor/preferences': 'capacitorPreferences',
        rxjs: 'rxjs',
        'cordova-plugin-bluetoothle': 'cordovaBle',
        '@awesome-cordova-plugins/bluetooth-le': 'awesomeBle',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: ['@capacitor/core', '@capacitor/preferences', 'rxjs', 'cordova-plugin-bluetoothle', '@awesome-cordova-plugins/bluetooth-le'],
};
