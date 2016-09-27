# sharp for windows 32

#### NOTE: This version of sharp only for Windows 32-bit system, for Windows 64-bit version or another OS - please see https://github.com/lovell/sharp

original sharp module author decided to stop supporting Windows 32bit version automatic installation 
but i think windows 32bit version could still be useful specially in case 
you are building desktop application using web technology such as Node Webkit or Electron

This version also using **libvips version 8.4** that fixed the windows unicode file paths issue: https://github.com/jcupitt/libvips/issues/294

this is a fork from https://github.com/lovell/sharp so for documentation please visit the original module github page   

### how to install
`npm install git+https://git@github.com/digital-flowers/sharp-win32.git --save`

if you are using this module with **node webkit** it is better to compile it with nw-gyp module as follow:

1- installing nw-gyp
`npm install nw-gyp -g`

2- install this module without compiling
`npm install git+https://git@github.com/digital-flowers/sharp-win32.git --save --ignore-scripts`

3- compile the module
`nw-gyp --runtime=node-webkit --target_arch=ia32 --target=0.17.4 configure rebuild`

**0.17.4 is the node webkit version that you are using**

 **Compiling Note:**
 there is unicode bug in nw-gyp to fix it apply the following patch for nw-gyp before compilation:
 https://github.com/nwjs/nw-gyp/pull/93/files 
 apply this patch to the file `node_modules/nw-gyp/src/win_delay_load_hook.cc` inside global node_modules
