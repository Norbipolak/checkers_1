/*
HTML szerkezet meg css
1. megcsináljuk a table-t 
- aminek adunk egy height-ot és egy width-et, úgyhogy flexibilisek legyenek (vh)
Tehát ha behúzzuk a képernyőt, akkor ez a vh kisebb lesz és szépen egyenletesen összemegy majd 
- margin: auto-val középre helyezzük 
- grid szerkezetet megcsináljuk, 8 sor és 8 oszlop lesz benne 
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repaet(8, 1fr);

2. ebbe a table-ben lesznek majd a field-ek 
    - border, hogy látszannak a grid szerkezetben a mezők 
    - margin: 0 -1px -1px 0; hogy a border-be ne legyenek duplikációk!! 
    - display: flex, justify-content: center, align-items: center, hogy amik benne lesznek ezekbe a field-ekbe azok középen legyenek 

3. black-bg 
    ez csak background-color: black 
    azoknak a field-eknek adjuk meg majd JavaScriptben, attól fűggően, hogy melyik sorban vagyunk 
        - itt majd lesz egy col meg egy row változónk és onnan tudjuk, hogy hol vagyunk 
        - row % 2 === 1 minden páratlanadik sorban col % 2 === 0 minden párosodik lesz fekete 
        - row % 2 === 0 minden párosadik sorban pedig col % 2 === 1 minden párosadik 
        és ha ezeket kikötöttük egy if-ben, akkor ezek a field-ek megkapják a black-bg-t 

4. player 
    ezek lesznek a körök, bábúink 
    egy kör, ami szinte az egész mezőt lefedi majd 
    width: 90% és height: 90%
    border-radius: 100px, hogy kör alakú legyen 

    de ugye kétfajta player lehet, egy fekete és egy fehér 

5. white-player 
    ezek lesznek a fehér bábúink 
    - adunk neki egy fehéres background-ot és egy border-t 
        - fontos itt a radial-gradient, hogy a belseje más színú legyen mint, ahogy megy majd ki átmegy egy másik színbe 
        van linear-gradient is, ahol ez az átmenet balról jobbra van 

6. black-player 
    ugyanaz, mint a white, csak itt sötétebb szürkés lesz majd a background meg a border is 
        fontos rgba!! 

7. highlight 
    nagyon fontos!!! 
        ez csak egy border de majd az bábú, player fogja megkapni, amire rákattintunk 


JavaScript 
1. létrehozunk az egésznek egy osztáyt -> class Checkers{}
    itt lementjük a table-t ezenkívül kell még egy round, hogy kinek a köre van ("black" vagy "white") és 
    egy highlighted, ami egy objektum lesz és benne lesz a row és col illetve maga a player, ami a div class-player-vel
    a constructor-ben pedig értéket adunk neki 
        this.table = document.querySelector("#table");
        this.round = "black";
        this.highlighted = {
            row: -1,
            col: -1,
            player: null
        }

2. csinálunk egy függvényt, hogy megcsináljuk a field-eket 
- for ciklus, ami 1-től indul és 64-ig megy, mert tudjuk, hogy ennyi mezőnk lesz majd 
fontos itt megcsináljuk a row-t meg a col-t, ezt majd sok helyen fogjuk használni!!! 
const row = Math.ceil(i / 8) -> 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 3 3 3 3 3 3 3 stb.
const col = (i - 1) % 8 + 1 -> 1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8 stb. 

ha ezek meg vannak akkor csinálunk egy div-et, aminek majd megadjuk a field class-t, amit már megcsináltunk css-ben 
const field = document.createElement("div");
field.classList.add("field");

de nem mindegyik lesz fehér, erre csináltuk a black-bg-t és erre kell a col és row
nagyon fontos, hogy itt hozzuk létre majd a div-et a player-nek, amit majd megcsináltunk egy null értékkel !!!!! 
let player = null 
if(row % 2 === 1 && col % 2 === 0) {
    field.classList.add("black-bg");
    player = document.createElement("div");
} else if(row % 2 === 0 && col % 2 === 1) {
    field.classList.add("black-bg");
    player = document.createElement("div");
}

Tehát itt már meg vannak, hogy melyikek a feketék és itt a feketéken létrehoztuk a div-et a player-nek 
de viszont csak a első, utolsó két sorban kellenek majd a player-ek!! 
erre kell majd egy if a row-ra illetve meg kell nézni, hogy létezik-e a player, mert mi csak a feketére akarunk player-eket csinálni 
ezért hoztuk létre a div-et itt!!! -> player = document.createElement("div");

itt megint figyelni kell, hogy a player az megkapja mindkét esetben a player class-t, de egyik esetben a white-player-t 
másik esetben pedig a black-player-t, mert a lesz két sor fekete és kér sor fehér bábunk 
mindkét esetben nagyon fontos, hogy appendChild-oljuk a player-eket a field-ekre, mert ezekben lesznek benne!!! 

if(player && col < 3) {
    player.classList.add("player");
    player.classList.add("white-player");
    field.appendChild(player);
} else if(player && col >= 7) {
    player.classList.add("player");
    player.classList.add("black-player");
    field.appendChild(player);
}

meg vannak a bábuk, csak a this.table.appendChild(field) kell!!!! 

3. highlightPlayer 
player kijelőlése ez vár egy col-t, row-t és egy player-t amelyiket ki akarjuk jelölni 
    a player-nek a rákattintásával -> player.addEventListener("click", ()=> {})
    első dolog, ami majd a későbbiekben okozna problémát, hogy itt kell egy e.stopPropagation, mert a fieldre is csinálunk majd egy 
    eventListener-t és akkor mivel a field-ben van a player, akkor a child-nak is le fog futni az eventListener-je, amikor a field-nek 
    és mi ezt majd nem akarjuk ott, hogy lefusson ez a player-nek az eventListener-je és ezt így lehet megakadályozni

- van egy highlight class-unk, amit majd megkap ez a kijelölt player, ez egy nagyobb border-t fog így kapni 
- ami még nagyon fontos, hogy megadjuk a dolgokat a highlighted-nak, hogy melyik col, row és melyik player lesz kijelölve 
highlighted = {
    col, 
    row,
    player
} 

4. canMove 
megnézzük, hogy merre lehet lépni illetve szabad 
van két paramétere a row és col, ahova majd akarunk lépni és ezt hasonlítjuk össze a highlighted-nak, tehát a kijelöltnek a row és a col-jával
úgy, hogy kivonjuk a hoghlighted.col-ból a col-t illetve a highlighted.row-ból a row-t 
const rowDiff = this.highlighted.row - row;
const colDiff = this.highlighted.col - col; 

és itt is kétfajta dolgot kell majd, mert a fekete bábúk felfele kell, hogy menjenek a fehérek meg lefelé 
tehát az egyiknél a rowDiff az -1 a másiknál pedig 1 kell, hogy legyen!! 
colDiff az mindkettőnél -1 1, mert jobbra és balra tudnak menni egy oszlopot 

illetve, nagyon fontos, hogy ellenőrizzük, hogy a this.highlighted az létezik-e -> this.highlighted.row !== -1 

de ugye az if-ben azt kell mégnézni, hogy kinek van a köre a feketének vagy a fehérnek és az alapján 
return-ölünk valamit, amit majd felhasználjuk a step függvényben 

if(this.round === "black") {
    return this.highlighted.row !== -1 && row === 1 && (col === 1 || col === -1);
}
    return this.highlighted.row !== -1 && row === -1 && (col === 1 || col === -1);

5. step 
    itt a canMove-ban már meghatároztuk, hogy hova tud lépni a fekete illetve a fehér 

step függvénynek van 3 paramétere 1. row 2.col 3.field 
és a field-re csinálunk egy eventListener-t 
if-ben meghívjuk a canMove függvényt paraméterekkel, szóval ha az a helyzet, hogy jó mezőre kattintunk akkor bemegyünk ide 
ha meg nem akkor meg kiírunk majd egy hibaüzenetet
if(canMove(row, col)) {}
- mit csinálunk itt a belsejében 
    1. meghatározzuk, hogy kinek a köre van -> this.round = this.round === "black" ? "white" : "black";
    2. letesszük a player-t ide -> field.appendChild(this.highlighted.player)!!!!!!!!!!!!!
    3. ha le van téve levesszük a highlight class-t, hogy ne legyen már kijelölve -> this.highlighted.player.classList.remove("highlight");
    4. kiürítjük a highligthed objektumot!!! 

meghívjuk ezt a step-et a generateFields-ben, ami alatt legyártottuk az összes field-et 

*/