# IDEA
Il progetto si basa sulla gestione di una scuola con gli studenti e le classi.

Per la gestione dell'intero sito è stata scelta la gestione tramite server con JavaScript.
Per l'uso efficente di JavaScript ho utilizzato le librerie: 
- Mysql (per la gestione del database)
- nodeMon (per il riavvio automatico del server ad ogni modifica)
- express (per la gestione del server)
# Tabella dei contenuti
- [Esecuzione](#esecuzione)
    - [Parte 1 (Apertura del server)](#parte-1-apertura-del-server)
    - [Parte 2 (Grafica della pagina)](#parte-2-grafica-della-pagina)
    - [Parte 3 (Uso delle funzioni)](#parte-3-uso-delle-funzioni)
    - [Parte 4 (Le funzioni)](#parte-4-le-funzioni)
        - [Visualizzazione](#visualizzazione)
        - [Modifica](#Modifica)
        - [Eliminazione](#Eliminazione)
        - [Inserimento](#Inserimento)
- [Approfondimenti](#approfondimenti)
    - [Async](#async)
    - [Await](#await)
    - [Fetch](#fetch)
# Esecuzione 
## Parte 1 (Apertura del server)
```js
    import express from "express";
    let app = express();
    app.use(express.static("."));
    app.listen(5000, () => {
        console.log("Connesso");
    }
);
```

con questo script il server va in ascolto nella porta 5000.

## Parte 2 (Grafica della pagina)
```html
<header>
        <h1>Scuola</h1>
        
        <div class="navbar">
            
            <div class="dropdown">
            <button class="dropbtn">Studenti
                
            </button>
            <div class="dropdown-content">
            <a href="#" onclick="formModificaStudente()">Inserisci</a>
            <a href="#" onclick="studenti()">Visualizza</a>
            
        </div>
        </div>
        <div class="dropdown">
            <button class="dropbtn">Classi
                
            </button>
            <div class="dropdown-content">
            <a href="#" onclick="formModificaClasse()">Inserisci</a>
            <a href="#" onclick="classi()" >Visualizza</a>
            
        </div>
        </div>
    </div>
    
    </header>
```
Con questo script nel file index.php viene creata la grafica con una Navbar composta da 2 dropdown (Studenti,Classi); Ognuno di essi consente di visualizzare (con Annessa Modifica ed Eliminazione) inserimento

## Parte 3 (Uso delle funzioni)
Premessa: per l'utilizzo delle varie funzioni (presenti nel file main.js e poi eseguite dal lato server dal file server.js) è necessario chiamare lo script e dichiarare vari div con ID delle funzioni
```html
<main>
    <div id="mainStudenti"></div>
    <div id="form"></div>
    <div id="query"></div>
</main>
<script src="main.js"></script>
```

## Parte 4 (Le funzioni)
### Visualizzazione
Premessa: per visualizzare il server necessita l'accesso al database che è presente nel file server.js con la libreria mysql
```js
import mysql from "mysql";
export { database };
database.connect();
```
Cliccando il pulsante visualizza per classi o studenti viene eseguita questa funzione nel file main.js

```js
//Esempio con funzione classi molto simile a Studenti
async function classi() {

    let reqClassi = await fetch("/classi");
    let jsonClassi = await reqClassi.json();
    let resultsClassi = jsonClassi.results;
    let main = document.getElementById("mainStudenti");

    let s = ...; // Script html per visualizzazione

    main.innerHTML = s;
    document.getElementById("form").innerHTML = "";
    document.getElementById("form").style.display = "block";
}
```
La funzione è supportata dal database tramite una tabella ottenuta dalla funzione classi nel file Server.js 
```js
app.get("/classi", (req, res) => {


    database.query("Select * from classi", (error, results, fields) => {
        res.status(200);
        res.json({
            results
        });
    });

});
```
Inoltre nella tabella di visualizzazione sia le classi che gli studenti presentano un pulsante con il codice identificativo che apre una finestra di modifica della riga selezionata
### Modifica
La funzione chiamata che si trova nel file main.js è molto simile sia per studenti che per le classi, essa viene anche utilizzata dall'inserimento
```js
function formModificaClasse(id = 0, nomeClasse = "", numeroAula = 0, LIM = false) {


    document.getElementById("form").style.display = "block";


    let form = `<form method="post" action="${id == 0 ? '/inserisciClasse' : '/modificaClasse'}">

        Script che visualizza i vari campi per inserire o modificare

     <input type="submit" value="${id != 0 ? 'modifica' : 'inserisci'}">
     ${id != 0 ? '<input type="submit" value="Elimina" formaction="/eliminaClasse">' : ""}
     </form > `;
    if (id == 0) {
        document.getElementById("mainStudenti").innerHTML = "";
    }
    document.getElementById("form").innerHTML = form;
};
```
Grazie alle diverse condizioni ternarie viene controllata una variabile id cosi da capire se eseguire la funzione di inserimento o di modifica.
In caso di modifica viene richiamata la funzione presente nel file server.js
```js
app.post("/modificaClasse", (req, res) => {

    let id = parseInt(req.body.id);
    let nomeClasse = req.body.nomeClasse;
    let numeroAula = parseInt(req.body.numeroAula);
    let LIM = req.body.LIM != null ? true : false;


    database.query(`insert into classi set nomeClasse="${nomeClasse}", numeroAula=${numeroAula}, LIM=${LIM}`, (error, results, fields) => {
        if (!error) {
            res.redirect("/");
        } else {
            console.log(error);
            res.sendStatus(503);
        }
    });
});
```
La funzione chiamata accede al database eseguendo la query di modifica utilizzando le variabili prese dal body della richiesta POST e ritorna alla home in caso di successo altrimenti lo status viene messo in errore

### Eliminazione
Sempre nella funzione di modifica sopra riportata è anche presente un pulsante di eliminazione che appare se il codice id è diverso da 0 (indicando che non sia un inserimento), una volta premuto viene chiamata la funzione di eliminazione presente nel file server.js
```js
app.post("/eliminaClasse", (req, res) => {
    let id = parseInt(req.body.id);
    database.query(`delete from classi where id=${id}`, (error, results, fields) => {
        if (!error) {
            res.redirect("/");
        } else {
            console.log(error);
            res.sendStatus(503);
        }
    });
})
```
La funzione è simile nel suo funzionamento a quella di modifica e cambia solo la query eseguita, in caso di risultato positivo l'utente verrà rimandato alla pagina iniziale altrimenti verrà visualizzato sulla console un errore
### Inserimento
Se invece viene premuto il pulsante di inserimento presente nel dropdown della home viene chiamata la funzione di modifica, in questo caso con id=0, nel file [main.js](#modifica) in questo modo la form andrà a richiamare la funzione di inserimento invece della modifica presente in server.js
```js
app.post("/inserisciClasse", (req, res) => {

    let id = parseInt(req.body.id);
    let nomeClasse = req.body.nomeClasse;
    let numeroAula = parseInt(req.body.numeroAula);
    let LIM = req.body.LIM != null ? true : false;


    database.query(`insert into classi(nomeClasse,numeroAula,LIM) values("${nomeClasse}", ${numeroAula}, ${LIM})`, (error, results, fields) => {
        if (!error) {
            res.redirect("/");
        } else {
            console.log(error);
            res.sendStatus(503);
        }
    });
});
```

# Approfondimenti
## Async
### Codice Esempio
```js
//Esempio con funzione classi
async function classi() {

    let reqClassi = await fetch("/classi");
    let jsonClassi = await reqClassi.json();
    let resultsClassi = jsonClassi.results;
    let main = document.getElementById("mainStudenti");

    let s = ...; // Script html per visualizzazione

    main.innerHTML = s;
    document.getElementById("form").innerHTML = "";
    document.getElementById("form").style.display = "block";
}
```

Una funzione con Async viene resa asincrona, essa restituisce sempre come risultato una promise.

### Await
Nell'esempio riportato [precedentemente](#async) è presente una assegnazione con await:
```js
let jsonClassi = await reqClassi.json();
```
await rende asincrona l'azione assieme ad [async](#async); un'azione con await verrà messa in pausa in attesa di una promise restituita dalla funzione async.

### Fetch
Sempre in riferimento all'esempio [sopra indicato](#async) viene utilizzata un'assegnazione utilizzando il metodo fetch:
```js
let reqClassi = await fetch("/classi");
```
Il metodo fetch permette ad inviare una richiesta di informazioni al server in questo caso chiedendo il risultato della query alla funzione classi nel file





