const Realm = require('realm');
import React from 'react';
import {Base64} from 'js-base64';
import {Text} from 'react-native';
// var utf8 = require('utf8');
// var binaryToBase64 = require('binaryToBase64');
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realm: null,
    };
  }

  componentWillMount() {
    const b64encoded = Base64.btoa(
      '123456', // 4*ceil(n/3) so n = 6  i.e. 8 bytes = 64 bits
    );
    const binaryArr = hexStringToByte(b64encoded);
    let str = '123456';
    console.log('=============', str.length);
    //const binaryStr = convertUint8ArrayToBinaryString(binaryArr)
    // var guidBytes = guidToBytes(str);
    // var b64encoded = arrayBufferToBase64(guidBytes);
    console.log('b64encoded====', b64encoded);
    console.log('bytes====', new Int8Array(64));
    //console.log('binary string====', binaryStr);
    Realm.open({
      schema: [{name: 'Dog', properties: {name: 'string'}}],
      encryptionKey: binaryArr,
    }).then(realm => {

      realm.write(() => {
        realm.create('Dog', {name: 'Rex'});
      });
      this.setState({realm});
    });
  }

  render() {
    const info = this.state.realm
      ? 'Number of dogs in this Realm: ' +
        this.state.realm.objects('Dog').length
      : 'Loading...';

    return <Text>{info}</Text>;
  }
}

// function guidToBytes(guid) {
//   var bytes = [];
//   guid.split('-').map((number, index) => {
//     var bytesInChar =
//       index < 3 ? number.match(/.{1,2}/g).reverse() : number.match(/.{1,2}/g);
//     bytesInChar.map(byte => {
//       bytes.push(parseInt(byte, 16));
//     });
//   });
//   return bytes;
// }
// function arrayBufferToBase64(buffer) {
//   var binary = '';
//   var bytes = new Uint8Array(buffer);
//   var len = bytes.byteLength;
//   for (var i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// }
// public toHexString(byteArray: any) {
//       return Array.from(byteArray, function(byte: any) {
//         return ('0' + (byte & 0xFF).toString(16)).slice(-2);
//       }).join('')
//     }
function hexStringToByte(str) {
  let byteArray = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    byteArray.push(parseInt(str.substr(i, 2), 16));
  }
  return new Int8Array(byteArray); // requires 64 bits in param: 8*64 = 512 bits = 64 bytes
}

// function convertUint8ArrayToBinaryString(u8Array) {
//   var i,
//     len = u8Array.length,
//     b_str = '';
//   for (i = 0; i < len; i++) {
//     b_str += String.fromCharCode(u8Array[i]);
//   }
//   return b_str;
// }
