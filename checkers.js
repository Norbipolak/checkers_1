class Checkers {
    table;
    round;
    highlighted;

    constructor() {
        this.table = document.querySelector("#table");
        this.highlighted = {
            row: 0,
            col: 0,
            player: null
        }
        this.round = "black";
        this.generateFields();
    }

    generateFields() {
        for(let i = 1; i <= 64; i++) {
            const row = Math.ceil(i/8);
            const col = (i - 1) % 8 + 1;
            const field = document.createElement("div");
            field.classList.add("field");
            let player = null;

            this.step(field, row, col);

            /*
            itt adjuk meg azt, hogy melyik field-ek legyenek feketék és megcsináljuk a player-eket, de azoknak még nem adunk class--t 
            mert azt szeretnénk, hogy a feketén legyenek, de nem az egész táblán, hanem csak az első, utolsó két sorban erre lesz majd egy if! 
            */
            if(row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            } else if(row % 2 === 0 && col % 2 === 1) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            }

            /*
            itt adjuk meg, hogy hol, lesznek a bábúk
            1. kikőtés, hogy a player létezzen, amit előbb csináltunk, hogy a feketére, tegye őket csak!!
            2. a row-t kell majd beállítani, hogy csak egy bizonyos sorig, sortól rakja őket 
            fontos, hogy appendChild-olva legyenek a field-re, mert azon lesznek rajta, abba lesznek benne
            */

            if(player && row > 3) {
                player.classList.add("player");
                player.classList.add("white-player");
                field.appendChild(player);
            } else if(player && row <= 7) {
                player.classList.add("player");
                player.classList.add("black-player");
                field.appendChild(player);
            }

            field.id = `field-${row}-${col}`;

            if(player) {
                this.highlightPlayer(player);
                player.setAttribute("row", row);
                player.setAttribute("col", col);
            }

            

            this.table.appendChild(field);
            //csak itt a végén kell az appendChild-nál this., mert ezt mentettük le ide a class-ba!! 
        }
    }

    /*
    itt jelöljük ki a player-t, úgy, hogy rákattintunk, fontos, hogy legyen e.stopPropagation(), mert a field-re is csinálunk csinálunk 
    egy eventListener-t és azt akarjuk, hogy csak ez fusson le, nem mindkettő, amikor rákattintunk a player-re

    megkapja a highlight osztályt, amit csináltunk erre css-ben 
    és a this.hightlighted-val megadjuk, hogy melyik player-ről van szó!!!
    ezt meghívtuk a generateFields-ben, hogy megkapja, a row-t, col-t meg magát a div-et, hogy melyik player-ről van szó 
    és arra teszi majd rá ezt a highlight osztályt 
    */

    highlightPlayer(player) {
        player.addEventListener("click", (e)=> {
            e.stopPropagation();

            const row = parseInt(player.getAttribute("row"));
            const col = parseInt(player.getAttribute("col"));

            if(this.round === "black" && player.classList.contains("white-player") 
            || this.round === "white" && player.classList.contains("black-player")) 
                return;

            if(this.highlighted.player)
                this.highlighted.player.classList.remove("highlight");

            player.classList.add("highlight");

            this.highlighted = {
                row,
                col,
                player
            }
        });
    }

    /*
    Ebben megadjuk, hogy hova tud menni a kijelölt bábú, fontos ez -> this.highlighted.row !== -1, mert így ellenőrizzük, hogy 
    van-e highlighted bábú és ha nincs, akkor be sem megyünk, mert a kikőtés nélkül bemenni és nem lenne jó 

    ez bekér két paramétert row és col, hogy hova szeretnénk menni vele, melyik mezőre és ezt fogjuk ellenőrizni, hogy lehet-e 
    a colDiff és a rowDiff segítségével!! 
    */

    canMove(row, col) {
        const rowDiff = this.highlighted.row - row;
        const colDiff = this.highlighted.col - col;

        /*
        itt nézzük meg, hogy kinek van a köre, mert ha a feketének, akkor máshogy kell lépnie, mint a fehérnek 
        eggyik felfele megy, másik lefele -> row, col az ugyanaz, eggyel mehetnek jobbra illetve balra 
        (colDiff === 1 || colDiff === -1)
        azért kell aa zárójel, mert két feltétel van, vagy jobbra eggyet vagy balra eggyet 
        */

        const field1 = document.querySelector(`#field-${row-1}-${col}`);
        const field2 = document.querySelector(`#field-${row+1}-${col}`);

        const field3 = document.querySelector(`#field-${row}-${col-1}`);
        const field4 = document.querySelector(`#field-${row}-${col+1}`);

        const field5 = document.querySelector(`#field-${row-1}-${col-1}`);
        const field6 = document.querySelector(`#field-${row+1}-${col+1}`);

        const field7 = document.querySelector(`#field-${row-1}-${col+1}`);
        const field8 = document.querySelector(`#field-${row+1}-${col-1}`);

        const fields = [
            document.querySelector(`#field-${row-1}-${col}`), document.querySelector(`#field-${row+1}-${col}`),
            document.querySelector(`#field-${row}-${col-1}`), document.querySelector(`#field-${row}-${col+1}`), 
            document.querySelector(`#field-${row-1}-${col-1}`), document.querySelector(`#field-${row+1}-${col+1}`), 
            document.querySelector(`#field-${row+1}-${col-1}`), document.querySelector(`#field-${row+1}-${col-1}`)
        ];

        for(const field of fields) {
            const children = field.children;
        
            if(field && children.length !== 0
                (children[0].classList.contains("white-player") && this.highlighted.player.classList.contains("black-player")) 
                || (children[0].classList.contains("black-player") && this.highlighted.player.classList.contains("white-player")) 
            )
            console.log("Léphet!");
        }

        if(this.round === "black") {
            return this.highlighted.row !== -1 && 
            rowDiff === 1 && (colDiff === 1 || colDiff === -1);
        } 

        return this.highlighted.row !== -1 && 
        rowDiff === -1 && (colDiff === 1 || colDiff === -1);
    }

    /*
    ez a függvény lesz a lépésre, tehát itt meghívjuk a canMove függvényt, amivel megnéztük, hogy léphetünk-e 
    ezt a függvényt majd meghívjuk az első függvényben, ahol elkészítettük az összes field-et!!! 
    mert ugye a paraméterben meg kell neki adni, hogy melyik field, hova tudja átrakni a player-t 
    - itt a field-re kell egy eventListener, mert arra lépünk, kattintunk!!!
    - if-ben, meghívjuk a canMove-ot, hogy tud oda lépni-e 
    - azt is meg kell határozni, hogy kinek a köre van, fekete vagy fehér  -> this.round = this.round === "black" ? "white" : "black";
    és akkor ha ide erre a mezőre appendChild-oljuk a highlighted.player-t!!!!!! 
        tehát a player-t, ami ki van jelölve!!! 
    miután léptünk sikeresen azután két dolog kell!!!
        1. levesszük a highlighted.player-ről a highlight class-t 
        2. kiűritjük a highlighted-ot
    amiket csináltunk a highlightPlayer-ben, annak a fordítotját, hogy ne az legyen már kijelölve!! 

    ha meg rossz helyre akarunk lépni, akkor kiírjuk, hogy alert("Nem jó lépés!");
    */
    step(field, row, col) {
        field.addEventListener("click", ()=> {
            if(this.canMove(row, col)) {
                this.round = this.round === "black" ? "white" : "black";

                field.appendChild(this.highlighted.player);
                this.highlighted.player.classList.remove("highlight");
                this.highlighted.player.setAttribute("row", row);
                this.highlighted.player.setAttribute("col", col);

                this.highlighted = {
                    row: -1,
                    col: -1,
                    player: null
                }
            } else {
                alert("Nem jó lépes!");
            }
        });
    }

}

new Checkers();

/*
Lehet már lépni, de pl. több bábút ki tudunk jelölni
Hogyan akadályozzuk meg, hogy több ki legyen jelölve 
-> 
ez a highlightPlayer függvényben van, ahol a player.classList.add-val hozzáadtuk ezt a highlight class-t
tehát, hogy magára a player-re rárakjuk ezt a class-t a másik pedig, hogy this.highlighted-ot beállítjuk!! 
    player.classList.add("highlight");

    this.highlighted = {
        row,
        col,
        player
    }

itt ez azért problematikus, mert magát a player-t is belerakjuk, tehát elöször a highlight osztályt hozzáadjuk utána, meg belerakjuk 
a highlighted objektumba 
és egyszerre több player-t is ki tudunk jelölni, közben meg csak az utolsóval lehet lépni, amit kijelöltünk 
ezért a this.highlighted.player-ről, tehát az aktuális player-ről levesszük a highlight class-t 
-> 
this.highlight.player.classList.remove("highlight");
utána rárakjuk az újra!!! player.classList.add("highlight");
és ezután frissitjük a kijelöltnek az adatait 
this.highlighted = {
    row,
    col,
    player
}

és nagyon fontos, hogy ezt csak akkor tehetjük meg, hogyha a this.highlighted.player az nem null!!!!!! 
tehát már ki van jelölve egy és utána vesszük le róla vagy különben nem fog eggyet sem kijelölni, mert ilyenkor még a this.highlighted.player 
az null 
-> 
if(this.highlighted.player)
    this.highlighted.player.classList.remove("highlight");
-> 
    highlightPlayer(row, col, player) {
        player.addEventListener("click", (e)=> {
            e.stopPropagation();

            if(this.highlighted.player)
                this.highlighted.player.classList.remove("highlight");
            
            player.classList.add("highlight");

            this.highlighted = {
                row,
                col,
                player
            }
        });
    }
és akkor így már átrakosgatjuk ezeket a kijelőléseket 
*************************************************************************************************
az is probléma, hogy most ki tudunk jelölni egy feketét majd ki tudunk jelölni egy fehéret is 
de azt szeretnénk, hogy csak olyat lehessen kijelölni, amilyen körben vagyunk!!! 
-> 
ez a round, ami ezt nekünk megmondja és még ezt is a highlightPlayer-ben csináljuk 
console.log(player);
<div player white-player highlight></div>
van egy olyan class-ja, hogy white-player vagy black-player
és amennyiben a this.round === "white" és a player.classList.contains("black-player")
akkor biztos, hogy return-ölni kell, de abban az esetben is return-ölni kell 
de abban az esetben is ki kell lépni ebből az eventListener-ből, hogyha a this.round === "black" és a player.classList.contains("white-player")
-> 
if(this.round === "black" && player.classList.contains("white-player") || this.round === "white" && player.classList.contains("black-player")) 
    return;
-> 
    highlightPlayer(row, col, player) {
        player.addEventListener("click", (e)=> {
        e.stopPropagation();
        if(this.round === "black" && player.classList.contains("white-player") 
            || this.round === "white" && player.classList.contains("black-player")) 
                return;

            if(this.highlighted.player)
                this.highlighted.player.classList.remove("highlight");

            player.classList.add("highlight");

            this.highlighted = {
                row,
                col,
                player
            }
        });
    }

és ilyenkor már nem tudjuk kijelölni azt a játékost, akinek nincsen köre 
tehát, nagyon fontos, hogy itt meg kell határozni a round-ot és a player-nek a classList-jében lévőt!!!!!!!!!!!!!!!!!!!
és ilyenkor ha kijelöltük a feketét és rákattintunk a fehérre, akkor azt fogja kiírni, hogy nem jó lépés, mert azt hiszi, hogy oda 
akarunk lépni, ezért fontos, hogy itt a stopPropagation legyen legelől!!! 
***************************************************************************
this.highlighted.row ahonnan szeretnánk lépni és row, ahova akarunk lépni!!! 
const rowDiff = this.highlighted.row - row;
Ha kezedünk a feketével akkor tudunk lépni de ha már léptünk, akkor nem tudunk feketét kijelölni illetve lépni sem 
csak a fehérrel 
Viszont van egy gond, hogyha ha már léptünk valamivel utána nem tudunk vele továbblépni, kiírja, hogy nem jó lépés 
console.log(this.highlighted.row + "-" + row);
2-4 és közbe már léptünk, szóval nem a második sorról akartunk a 4-be lépni, hanem a harmadikról a negyedikre, de valamiért úgy vette, hogy 
még a második sorban vagyunk 
Jelen esetben csak a második sorból tudunk a harmadikra lépni 2-3 és ugye csak ennyit enged, mert 
->
rowDiff === 1 && (colDiff === 1 || colDiff === -1);
de viszont valamiért azt hiszi, hogy még nem létünk el onnan, ezért jön a hibaüzenet

Tehát az eredeti pozciót veszi figyelembe, azért furcsa, mert ha rákattintunk a player-re, akkor a poziciót kellene frissitenie
-> 
highlightPlayer(col, row, player)
console.log(row, col);
valamiért itt nem veszi figyelembe, hogy léptünk 
-> 
Ennek az az oka, hogy egyszer beállítottuk ezeket az eventListener-öket, és ezt egyszer beállítottuk rá és az marad végig 
mert ezt egszer generáljuk le csak, ami benne van az eventListener-ben 
ezért azt kéne, hogy remove eventListener utána meg add eventListener, de ez sem fog így simán menni 
ez így fura, de amikor rákattintunk a player-re és lefut ami benne van, akkor kellene egy player.removeEventListener();
de nem fog müködni, ami bent van az eventListener-be ha leszedjük az eventListener-t 
tehát ez így nem lesz jó
-> 
highlightPlayer(row, col, player) {
    player.addEventListener("click", (e)=> {
        e.stopPropagation();

        if(this.round === "black" && player.classList.contains("white-player") 
        || this.round === "white" && player.classList.contains("black-player")) 
            return;

        if(this.highlighted.player)
            this.highlighted.player.classList.remove("highlight");

        player.classList.add("highlight");

        this.highlighted = {
            row,
            col,
            player
        }

        player.removeEventListener();
    });
}
Azért nem tudjuk leszedni, mert ez egy névtelen function a (e)=> {}, ami van a "click" után 
és a névtelen function-t azt nem fogjuk tudni eltávolítani 
tehát ami benne van az eventListenerben azt külön kellene rakni valamilyen metódusba!!!!!!!!!!!!
Eltávolítani róla és utána újra hozzáadni az új adatokkal 
erre csinálunk egy clickPlayer-t!
->
    clickPlayer(e, row, col, player) {
            e.stopPropagation();

            if(this.round === "black" && player.classList.contains("white-player") 
            || this.round === "white" && player.classList.contains("black-player")) 
                return;

            if(this.highlighted.player)
                this.highlighted.player.classList.remove("highlight");

            player.classList.add("highlight");

            this.highlighted = {
                row,
                col,
                player
            }

            player.removeEventListener("click", this.clickPlayer);
            player.addEventListener("click", this.clickPlayer);
    }

csak így meg az a probléma, hogy nem tudunk neki megadni paraméterek ennek -> player.addEventListener("click", this.clickPlayer);
Szóval nem ezt csináljuk, hanem kapna egyedi attributumokat és ezeket az attributumokat frissitgetnénk!!!! 
Tehát a generateFields-ben van nekünk a player-ünk és a player 
itt megadjuk a player-nek attributumként a row-t és a col-t 
-> 
player.setAttrubite("row", row);
player.setAttribute("col", col);

ilyenkor a highlightPlayer-nél nem szükséges paraméterként sem a row-t, sem a col-t megadni, csakis kizárólag a player-t 
highlightPlayer(row, col, player) 
->
highlightPlayer(player)
és ugye meghívásnál is 
-> 
    player.setAttribute("row", row);
    player.setAttribute("col", col);

    if(player) {
        this.highlightPlayer(player);
    }

mert, hogy a row meg a col onnan fog eredni, a highlightPlayer-ben mit adunk át a this.highlighted-nak 
mert így ez most nem jó, hogy 
this.highlighted = {
    row,
    col,
    player
}
mert a highlightPlayer függvény nem kéri be őket, de viszont az attributumből ezt meg lehet kapni, csak máshogy kell rá hivatkozni 
-> 
const row = parseInt(player.getAttribute("row"));
const col = parseInt(player.getAttribute("col"));
és akkor így már jó ez 
this.highlighted = {
    row,
    col,
    player
}
de ha nem hoztunk volna erre változókat, akkor így kellett volna megadni 
this.highlighted = {
    row: parseInt(player.getAttribute("row")),
    col: parseInt(player.getAttribute("col")),
    player
}
az egész 
->
    highlightPlayer(player) {
        player.addEventListener("click", (e)=> {
            e.stopPropagation();

            const row = parseInt(player.getAttribute("row"));
            const col = parseInt(player.getAttribute("col"));

            if(this.round === "black" && player.classList.contains("white-player") 
            || this.round === "white" && player.classList.contains("black-player")) 
                return;

            if(this.highlighted.player)
                this.highlighted.player.classList.remove("highlight");

            player.classList.add("highlight");

            this.highlighted = {
                row,
                col,
                player
            }
        });
    }

ez ugye a kijelőlés, de nekünk ezt ot kéne frissiteni ezt a dolgot, hogy canMove 
tehát, hogyha canMove meg van hívva a step-ben ott alatta 
ahol appendChild-oljuk a field-hez a this.highlighted.player-t és ott ahol ha ez megtörtént, akkor leszedjük a highlight class-t 
this.highlighted.player.classList.remove("highlight");
tehát miután leszedjük róla a highlight-ot 
->
this.highlighted.player.setAttribute("row", row);
thishighlighted.player.setaAttriubute("col", col);
Mert itt nekünk meg van a highlighted, minden adatunk meg van 

és innentől kezdve a highlighted-ot lenuulázzuk 
-> 
this.highlighted = {
    row: -1,
    col: -1,
    player: null
}
az egész 
->
step(field, row, col) {
        field.addEventListener("click", ()=> {
            if(this.canMove(row, col)) {
                this.round = this.round === "black" ? "white" : "black";

                field.appendChild(this.highlighted.player);
                this.highlighted.player.classList.remove("highlight");
                this.highlighted.player.setAttribute("row", row);
                this.highlighted.player.setAttribute("col", col);

                this.highlighted = {
                    row: -1,
                    col: -1,
                    player: null
                }
            } else {
                alert("Nem jó lépes!");
            }
        });
    }

Felül a generateFields-nél be kell tenni ezt a setAttributes-os dolgot oda, hogy 
if(player)
mert most ahogy van ezt akkor is megpróbálni csinálni, hogyha nincsen player-ünk, mert itt a player az null 
    generateFields() {
        for(let i = 1; i <= 64; i++) {
            const row = Math.ceil(i/8);
            const col = (i - 1) % 8 + 1;
            const field = document.createElement("div");
            field.classList.add("field");
            let player = null;

            this.step(field, row, col);

            if(row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            } else if(row % 2 === 0 && col % 2 === 1) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            }

            if(player && row > 3) {
                player.classList.add("player");
                player.classList.add("white-player");
                field.appendChild(player);
            } else if(player && row <= 7) {
                player.classList.add("player");
                player.classList.add("black-player");
                field.appendChild(player);
            }

            if(player) {
                this.highlightPlayer(player);
                player.setAttribute("row", row);
                player.setAttribute("col", col);
            }

mert itt a player = null 
és csak akkor kell, hogyha van player!!! if(player)

így og kinézni 
->
<div class="field black-gb">
    <div class="player white-player" row="1" col="2"></div>
</div>

és akkor ez a row meg a col az midnig frissitődik, attól függően, hogy melyik row-ban meg col-on van a player div!!!! 
**************************************************************************
És akkor tudnak lépni, de eddig csak azt állítottuk be, hogy tud lépni előre meg átlósan eggyet 
de ez így azért nem jó, mert hogyha mondjuk a fekete egy fehér közelébe kerük, akkor azt kéne csinálni, hogyha a fekete ki van jelölve, 
akkor át tudja ugrani a fehéret és majd leüsse és kettőt menjen elöre és kettő oldalra is!!! 
Kérdés, hogy honnan tudjuk, hogy van egy fehér a közelben és merrefelé ugorhatunk 
Ezt úgy tudjuk megcsinálni, hogy tisztában vagyunk, hogy mi a poziciónk (ebből -> row="1" col="2") és végig kell nekünk 
menni 8 darab környező mezőt, hogy ott van-e a másik színből 
Csak nem tudjuk, így címezni a mezőket, hogy 8 darab környező mező és éppen ezért kell valamit csinálni, hogy képesssek legyük a mezőket 
címezni, hogy melyik melyik és akkor át tudjuk kutatni a környező mezőket 

Mezőnek a row-ja meg a col-ja az nem változik, mert ő nem egy player, ő nem fog arréblépni 
const row = Math.ceil(i/8);
const col = (i - 1) % 8 + 1;

ezért csinálunk a field-ekre egy id-t, amiben bent lesz a row-ja meg a col-ja is 
field.id = `field-${row}-${col}`;

és akkor így lesznek
->
<div class="field" id="field-1-1"></div>
<div class="field black-bg" id="field-1-2"></div>
és így tovább
<div class="field" id="field-8-8"></div>
persze némelyikben van player is 
És akkor mindegyik kapott egy különböző id-t és ez azért szerencsés számunkra, mert akkor a canMove-ban át tudjuk kutatni a környezőket 

Mi a környező, ha vagyunk egy bizonyos row-n meg col-on, akkor az a környező 
- van egy ami eggyel több sor, eggyel kevesebb sor és ugyanaz az oszlop
- eggyel több oszlop, eggyel kevesebb oszlop, de ugyanaz a sor 
- eggyel több sor eggyel kevesebb oszlop, eggyel több oszlop
- eggyel kevesebb sor eggyel kevesebb oszlop, eggyel több oszlop 

elő kell állítanunk ezeket a számokat 
-> 
const field1 = document.querySelector(`#field-${row-1}-${col}`);
const field2 = document.querySelector(`#field-${row+1}-${col}`);

const field3 = document.querySelector(`#field-${row}-${col-1}`);
const field4 = document.querySelector(`#field-${row}-${col+1}`);
itt az lehet a probláma, hogy kimegyünk a táblából és akkor bizonyos elemek null-ok lesznek, de ez nem probléma, 
mert egyszerűbb leellenőrizni, hogy null-e vagy sem, minthogy if-eket csinálni, hogyha 8 a col, akkor ne lehessen mégeggyet hozzáadni!!!!!

Most jönnek az átlósok 

const field5 = document.querySelector(`#field-${row-1}-${col-1}`);
const field6 = document.querySelector(`#field-${row+1}-${col+1}`);

const field7 = document.querySelector(`#field-${row+1}-${col-1}`);
const field8 = document.querySelector(`#field-${row+1}-${col-1}`);

csinálunk egy fields nevű tömböt és ott tároljuk ezeket 

const fields = [
    document.querySelector(`#field-${row-1}-${col}`), document.querySelector(`#field-${row+1}-${col}`),
    document.querySelector(`#field-${row}-${col-1}`), document.querySelector(`#field-${row}-${col+1}`), 
    document.querySelector(`#field-${row-1}-${col-1}`), document.querySelector(`#field-${row+1}-${col+1}`), 
    document.querySelector(`#field-${row+1}-${col-1}`), document.querySelector(`#field-${row+1}-{col-1}`)
]

Miért jó ez, hogy egy tömbben tároljuk ezeket és még külön változót se kell létrehozni nekik 
->
Végig tudunk rajta menni egy loop-val 
Végigmegyünk és megnézzük a field-nek a children-je null-e vagy sem!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Ez nagyon fontos, mert ugye a player-ek benne vannak a field-ekben és ha van children az azt jelenti, hogy lehet ütni
meg ugye azt is, hogy maga a field az null-e vagy sem, hogy nem mentünk ki-e a tábláról!!!! 

for(const field of fields) {
    if(fields && field.children.length !== 0)
}

amennyiben a fields az nem null -> if(fields)
    és amennyiben a fields.children.length !== 0 
mert ez a children ez olyan, mint a tömb, késöbb így is írtuk children[0]
itt majd csak kiírjuk a konzolra, hogy léphet, de még nem tudjuk, hogy merre !!!!!

for(const field of fields) {
    if(field && field.children.length !== 0) {
        console.log("Léphet!");
    }
}

Ezt kell majd megtudni, hogy merre léphet, mert most csak azt tudjuk, hogy van a közelében, de azt, hogy pontosan hol azt nem 
Elő kell állítani majd azt, hogy melyik mezőre léphet, melyiket ugorhatja át 

Ez így nem lesz jó, mert sokszor írta, hogy léphet!!!! 
Nem mindegy, hogy fekete vagy fehér, mert most elindult a feketével és rögtön kiírta, hogy lépett, mert mellette volt egy fekete 
de azt szeretnénk, hogy akkor írja ki, hogyha egy fehér van mellette 

beletettünk egy children[0]-t, de azt majd csak utolsó helyre, mert 
->
field nem lehet null utána a children-nek a length-je nem lehet nulla és csak utána, hogy children[0], mert ha ezt raknánk 
előre, akkor alapból undefined lenne, children[0] -> az első children-je a field-nek 
-> 
for(const field of fields) {
    const children = field.children;
    if(field && children.length !== 0 && children[0].....)
}
Itt kétféle lehetőség van, hogy fehér és akkor feletének kell lennie a környezetében vagy fekete és fehérnek kell lennie a környezetében 
field && children.length !== 0, ezek meg mindig igazak kellenek, hogy legyenek 
-> children[0].classList.contains("white-player") -> ezzel néztük meg, hogy mi van körülötte 
ezzel nézzük meg, hogy mi mik vagyunk -> this.highlighted.player.classList.contains("white-player");
ezeket a harmadik és negyedik kikötést belerakjuk egy ()-be 
->
if(field && children.length !== 0 &&
(children[0].classList.contains("white-player") && this.highlighted.player.classList.contains("black-player")) ||
children[0].classList.contains("black-player") && this.highlighted.player.classList.contains("white-player")) 
az a lényeg, hogy az egyiknek white-nak kell lennie a másiknak meg black-nek, hogy ezt kiírja!!!!! 

for(const field of fields) {
    const children = field.children;

    if(field && children.length !== 0
        (children[0].classList.contains("white-player") && this.highlighted.player.classList.contains("black-player")) 
        || (children[0].classList.contains("black-player") && this.highlighted.player.classList.contains("white-player")) 
    )
    console.log("Léphet!");
}

és akkor így már kiírja jól, amikor kell, hogy léphet
Még az van, hogy nem akkor írja ki, hogy léphet, amikor kijelöltük mondjuk a feketét és ott van már egy fehér mellette, hanem elöbb 
amikor oda belép a fehér és még ki sincs jelölve a fekete 
szóval pont a fehérnél írja, hogy léphet és utána kéne, amikor kijelöltük a feketét 
ez még is rendben van 

A row meg a col amit bekérünk ebbe a függgványbe, az az ahova lépni akarunk és azt kellenne megcsinálni, hogy ilyenkor 
nem csak egy hanem kettő differencia is jó, mert akkor ha van egy átlósan, akkor azt le kell tudnia ütni és kettőt lép átlósan 

Meg kell tudni a player pozicióját, tehát azt amilyik nincsen kijelőlve 
azt pedig onnan tudjuk meg, hogy field.id 
<div class="field black-bg id="field-4-5">
    <div class="player white-player" row="4" col="5"></div>
</div>
vagy nem is a field-nek nézzük meg az id-t, mert a children[0]-nél ott is megvannak ezek az adatok a row meg a col attributummal,
amit itt a JavaScriptben megszerezünk a getAttribute-val 
fontos, hogy ezeket majd parseInt-elni kell és lementeni egy változóba!!! 
->
const r = parseInt(children[0].getAttribute("row"));
const c = parseInt(children[0].getAttribute("col"));
és akkor így megkaptuk, hogy hol vannak melyik sorban illetve oszlopban!!! 
console.log(r, c); -> 4 7 negyedik sor hetedik oszlopában van 

és mi is tudjuk, hogy hol van a kijelölt játékosunk
-> 
this.highlighted.row meg a this.highlighted.col 

és ehhez képest kell egy rowDiff-et meg egy colDiff-et meghatározni 
const rDiff = this.higglighted.row - r;
const cDiff = this.highlighted.col - c;

még nem biztos, hogy ez így jó lesz 
Tudjuk, hogy már mellette vagyunk és oda léphetünk, ami a nem kijelölt poziciójától eggyel jobbra és felette van vagy eggyel balra és felette 
ha meg a nem white-player, mint jelen esetben, akkor meg eggyel lejjeb vagy balra vagy jobbra 

Hogyha fekete a player-ünk, akkor biztos, hogy a row az kettővel kevesebb lesz 
akkor ez a cosnt rDiff meg cDiff az nem is kell, mert nem a másiktól határozzuk meg, hanem a mi helyzetünktől!!!!!!!!!!
->
amennyiben a this.highlighted.player.classList.contains("black-player");
pl. ez itt -> <div class="player white-player" row="4" col="5"></div>
feltételek 
->
csak oda léphetünk, ahol kettővel kisebb a row, mint a mienk 
Ha col kisebb az átugrandó player-nek mint a mienk, akkor a col is kettővel kell, hogy csökkenjen, ha meg nagyobb, akkor meg kettővel kell 
hogy nőjjön 
ha meg a white-player van kijelőlve, akkor úgy tud majd lépni, hogy a row az biztos, hogy kettővel nagyobb lesz, a col meg ugyanugy, mint a 
a black-player-nél vagy kettővel csökken vagy kettővel növekszik, attól függően, hogy hol van az átugrandó black-player 
*/
