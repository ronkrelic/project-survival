// Shared block semantics; independent of terrain layout and world size.
export const materials=Object.freeze({
 1:{name:'terrace grass',yield:'earth',seconds:.4,color:0x83a68c},
 2:{name:'ochre stone',yield:'stone',seconds:1.5,color:0xb78e72},
 3:{name:'rose stone',yield:'stone',seconds:1.5,color:0xb58483},
 4:{name:'monolith',seconds:Infinity,color:0x777688},
 5:{name:'wood',yield:'wood',seconds:.9,color:0x927866},
 6:{name:'leaves',yield:'leaf bits',seconds:.45,color:0x8ba48a},
 7:{name:'teal flora',yield:'teal flora bits',seconds:.4,color:0x8abbb2},
 8:{name:'violet flora',yield:'violet flora bits',seconds:.4,color:0xb2a0bb},
 11:{name:'forest turf',yield:'earth',seconds:.4,color:0x527f72},
 12:{name:'canyon red stone',yield:'stone',seconds:1.5,color:0xb87868},
 13:{name:'pale stone',yield:'stone',seconds:1.5,color:0xc1c5be},
 14:{name:'snow',yield:'snow',seconds:.4,color:0xdce4e3},
 15:{name:'amber sand',yield:'sand',seconds:.4,color:0xc7a16a},
 16:{name:'dryfiber tuft',yield:'dryfiber',seconds:.4,color:0x97aa83},
 10:{name:'sparkstone',yield:'sparkstone',seconds:1.5,color:0xe3dfb9},
 17:{name:'tilled earth',yield:'earth',seconds:.4,color:0x69574d},
 9:{name:'foundation stone',seconds:Infinity,color:0x8c7378}
});
export const breakable=id=>Number.isFinite(materials[id]?.seconds);
