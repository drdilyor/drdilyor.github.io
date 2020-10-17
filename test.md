# Nega `var` o'rniga `let`/`const` ishlatishimiz kerak?

Assalomu alaykum, mening ismim Dilyorbek.

## Overview
Siz javascript dasturlash tilida `var`ni ko'p ishlatgan bo'lishingiz mumkin,
masalan:

```javascript
var navbar = document.getElementById('navbar')
```

lekin `var` nomli jonivor sizni tuzoqqa tushirish uchun nimalar tayorlab
qo'yganini bilasizmi? Havotir olmang, tez orada bilib olasiz, lekin avval...

## ES 2015 - EcmaScript 2015
2015 yilda, javascript tilining yangi spesifikatsiyasi paydo bo'ldi - ES 2015.
Yangi spesifikatsiya javascript tiliga o'nlab yangi yaxshilanishlar va sintaks
strukturalar olib keldi. Bulardan biri o'zgaruvchan e'lon qilish uchun yangi
sintaks - `let` va `const`:

```javascript
let message = "Hello";
const userName = "drdilyor";
```

> Boshlanishida spesifikatsiya nomi ES6 bo'lgan edi, ya'ni 6 nashr. 
> Keyinchalik tushunarsizliklar bo'lmasligi uchun nomiga nashr raqami emas
> chiqqan yili qo'shilib yozilgan.

## Nega yangi sintaks, `var` bilan nima muammo?
Hamma gap aynan shunda. Eich JSni taxminan MacGyver epizodi bilan bir xil xom
ashyo va vaqt bilan Netscapega yopishtirganligi sababli, u ba'zi skotch va 
qog'oz kliplar ko'rinadigan bir g'alati semantik burchaklarga ega.

### Variable hoisting - O'zgaruvchi ko'tarilishi
Ehtimol bu javascriptda yagona bo'lgan, JSning eng tanilgan va yomon ko'rilgan
husisyatlaridan biri. Bu kod parchasiga nazar solaylik:

```javascript
var a = 'global';

function main() {
    console.log(a); // ?
    var a = 'local';
    console.log(a); // ?
}
main();
```

Bu kod qanday natija berishini yaxshilab o'ylang. Tayyormisiz? Siz "birinchi
'global' deydi, keyin 'local' deydi" degan bo'lsangiz, demak qattiq adashasiz!
Javob:

    undefined
    local

Nega bunday bo'ldi deyotgan bo'lsangiz kerak. Chunki bu kodda var e'lonlari
funkstiyaning eng boshiga chiqib qoladi, ya'ni:

```javascript
var a = 'global';

function main() {
    var a;
    console.log(a); // undefined
    a = 'local';
    console.log(a); // local
}
main();
```

*Siz o'zgaruvchanni qayerda e'lon qilganingizni farqi yo'q, e'lon baribir
funkstiyaning tepasiga chiqib qoladi.* Huddi o'sha kodni `let` bilan yozsa nima
bo'ladi?


```javascript
let a = 'global';

function main() {
    console.log(a); // global
    let a = 'local';
    console.log(a); // local
}
main();
```

`let` bilan bunday muammo yo'q. *O'zgaruvchi qayerda e'lon qilinsa o'sha yerda
e'lon qilinadi!*

### Scope - ko'rinish
Agar siz *men bilaman, buning yomon tomoni yo'q* deyotgan bo'lsangiz, bir kun 
sizni o'zgaruvchining "scope"i tishlab olishi mumkin.

O'zgaruvchan `var` bilan e'lon qilinganda, u butun funkstiya uchun e'lon
qilinadi. (Yoki butun dastur uchun agar funkstiyadan tashqarida bo'lsa). `let`
esa *blok* uchun. `let` o'zi e'lon qilingan blokdan tashqarida ko'rinmaydi.

```javascript
function main() {
    if (true) {
        var veryBigObject = {} // katta object yaratamiz!
        // object bilan operatsiyalar qilamiz
    }
    // bu yerda bizga object kerak emas
    // lekin u hali hotiradan o'chmadi, 
    // va ko'p hotira ishlatyapti!!!
    console.log(veryBigObject) // [object Object]
}
```

Agar shunga o'xshash kodni C yoki Javada yozsa `if` yopilganidan so'ng barcha 
`if`ning ichida e'lon qilingan o'zgaruvchanlar o'chib ketadi. Lekin JSda
variable hoistingni deb o'zgaruvchanlar butun funkstiya uchun yaratiladi:

```javascript
function main() {
    // o'zgaruvchan butun funkstiya uchun e'lon qilingan!
    var veryBigObject; 
    
    if (true) {
        var veryBigObject = {} 
    }

    console.log(veryBigObject) // [object Object]
}
```

`let` bilan bu muammo yo'q: `let`ning "scope"i blok uchun, funkstiya uchun emas:

```javascript
function main() {
    if (true) {
        let veryBigObject = {} 
    }
    // if yopilgandan so'ng `veryBigObject` o'chib ketti
    console.log(veryBigObject) // ReferenceError!
}
```

### `for loop`
Ehtimol bu nafaqata JS, balki barcha boshqa tillar bilan uchraydiga muammodir.
For loop bilan tutashuv ishlatilganda nima bo'lishiga bir qarang:

```javascript
var closures = []

for (var i = 0; i < 10; i++) { // <- var bilan e'lon qilingan
    closures.push(function() {
        console.log(i);
    });
}
closures[0]()
closures[1]()
```

Bu kodda 10 funkstiya yaratiladi va closures massivida saqlanadi. Har bir
funkstiya xar hil `i`ga tutashadi deb o'ylash mutloqo noto'g'ri! Aslida hamma 
funkstiya bitta `i` o'zgaruvchanga tutashadi va shuning uchun siz kutgan natija
chiqmaydi:

```javascript
> closures[0]()
10
> closures[1]()
10
```

`for` ning oxirida `i` `10` ga teng bo'ladi va loop to'xtaydi va
barcha tutashuvlar o'sha `10` ga bo'ladi. Bunday xolat 
[stackoverflow](http://stackoverflow.com)da juda ko'p uchraydi,
ko'pincha bunday ko'rinishda:

```javascript
var elems = document.querySelectorAll('.be-green');

for (var i = 0; i < elems.length; i++) { // <- var bilan e'lon
    setTimeout(function() {
        elems[i].style.backgroundColor = 'green';
    }, 1000);
}
```

Bu kod `.be-green` elementlarni 1 soniyadan so'ng yashil qilib 
qo'yishi kerak edi, lekin qarabsizki ishlamaydi. Buni to'girlash 
uchun boshqa o'zgaruvchan kerak:

```javascript
var elems = document.querySelectorAll('.be-green');

for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];
    setTimeout(function() {
        elem.style.backgroundColor = 'green';
    }, 1000);
}
```

Endi behato ishlaydi.

`let` bilan har bir `for`ning iteratsiyasi uchun yangi o'zgaruvchan yaratiladi
va shuning uchun har bir funkstiya o'zining iteratsiyasidagi `i`ga tutashadi:

```javascript
var elems = document.querySelectorAll('.be-green');

for (let i = 0; i < elems.length; i++) { // <- let bilan e'lon
    setTimeout(function() {
        elems[i].style.backgroundColor = 'green';
    }, 1000);
}
```
Shuning uchun tinchgina hamma yerda `let`ni ishlatgan ma'qul 😁

## `const` haqida

`const`ni `let`dan bitta farqi bor: o'zgaruvchi yaratilgarndan keyin uni
o'zgartirib bo'lmaydi.
> Gapni qarang: o'zgaruvchini o'zgartirib bo'lmaydi 😁😁

Bu kod hato beradi:
```javascript
const myName = 'Dilyorbek';
myName = 'drdilyor'; // ERROR!
```

Constni boshqa farqi yo'q.

## Internet explorer yig'layapti
Internet explorer ning hech qaysi versiyasida ES 2015 ishlamaydi, shu bilan
`let` va `const` ham.

## Tamom
Bu maqoladi sizga `var` bilan uchrashi mumkin bo'lgan *ba'zi* muammolar bilan
tanishtirdim, o'ylaymanki bunday keyin shunday g'alati narsalar sodir bo'lsa 
`let`ni ishlatyapmani? deb savol berasiz. 😁
