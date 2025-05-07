import express from "express";
import mysql from "mysql";
const database = mysql.createConnection({ user: "root", password: "", database: "Scuola" });
let app = express();

app.use(express.static("."));

app.use(express.urlencoded({
    extended: true
}));

app.listen(5000, () => {
    console.log("Connesso");
}
);

export { database };
database.connect();
app.get("/studenti", (req, res) => {


    database.query("Select * from Studenti", (error, results, fields) => {
        res.status(200);
        res.json({
            results
        });
    });

});

app.get("/classi", (req, res) => {


    database.query("Select * from classi", (error, results, fields) => {
        res.status(200);
        res.json({
            results
        });
    });

});




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

app.post("/modificaStudente", (req, res) => {

    let id = parseInt(req.body.id);
    let numeroMatricola = req.body.numeroMatricola;
    let nome = req.body.nome;
    let cognome = req.body.cognome;
    let dataNascita = req.body.dataNascita;
    let sesso = req.body.sesso;
    let certificazioneECDL = req.body.certificazioneECDL != null ? true : false;
    let certificazioneIngleseB2 = req.body.certificazioneIngleseB2 != null ? true : false;
    let classe_id = req.body.classe_id;



    database.query(`Update studenti set numeroMatricola="${numeroMatricola}", 
        nome="${nome}", 
        cognome="${cognome}" , 
        dataNascita="${dataNascita}" ,
        sesso="${sesso}" ,
        certificazioneECDL=${certificazioneECDL} ,
        certificazioneIngleseB2=${certificazioneIngleseB2} ,
        classe_id=${classe_id}   where id=${id}`, (error, results, fields) => {
        if (!error) {
            res.redirect("/");
        } else {
            console.log(error);
            res.sendStatus(503);
        }
    });
});

app.post("/inserisciStudente", (req, res) => {

    let id = parseInt(req.body.id);
    let numeroMatricola = req.body.numeroMatricola;
    let nome = req.body.nome;
    let cognome = req.body.cognome;
    let dataNascita = req.body.dataNascita;
    let sesso = req.body.sesso;
    let certificazioneECDL = req.body.certificazioneECDL != null ? true : false;
    let certificazioneIngleseB2 = req.body.certificazioneIngleseB2 != null ? true : false;
    let classe_id = req.body.classe_id;



    database.query(`insert into studenti(numeroMatricola,nome,cognome,dataNascita,sesso,certificazioneECDL,certificazioneIngleseB2,classe_id) values("${numeroMatricola}", 
        "${nome}", 
        "${cognome}" , 
        "${dataNascita}" ,
        "${sesso}",
        ${certificazioneECDL} ,
        ${certificazioneIngleseB2} ,
        ${classe_id})`, (error, results, fields) => {
        if (!error) {
            res.redirect("/");
        } else {
            console.log(error);
            res.sendStatus(503);
        }
    });
});

app.post("/eliminaStudente", (req, res) => {
    let id = parseInt(req.body.id);
    database.query(`delete from studenti where id=${id}`, (error, results, fields) => {
        if (!error) {
            res.redirect("/");
        } else {
            console.log(error);
            res.sendStatus(503);
        }
    });
});

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







