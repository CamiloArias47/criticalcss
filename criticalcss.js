const penthouse = require('penthouse')
const fs = require('fs')
const device = process.argv.slice(2,3)  //  dispositivo
const name = process.argv.slice(3,4)    //  nombre del archivo que generara con el ccs critico
const category = process.argv.slice(4,5)   //  categoria
const css = process.argv.slice(5,6) //css compilado de especiales, este es el archivo que genera webpack del proyecto elpais

console.log(device+'='+name+'='+category+'='+css)

penthouse({
  url: category != "" ? 'https://www.elpais.com.co/'+category : 'https://www.elpais.com.co/',
  css: css != "" ? './css/'+css : './css/screen.css',
  width : device == 'mobile' ? 360 : 1200,
  height : device == 'mobile' ? 640 : 780,
  screenshots: {
    basePath: './screenshots/'+device+'-'+name, // absolute or relative; excluding file extension
    type: 'png', // jpeg or png, png default
  }
})
.then(criticalCss => {
  fs.writeFileSync('./'+device+'/'+name+'.css', criticalCss);
})
