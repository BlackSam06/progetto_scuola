


async function studenti() {
    let reqStudenti = await fetch("/studenti");
    let jsonStudenti = await reqStudenti.json();
    let resultsStudenti = jsonStudenti.results;
    let main = document.getElementById("mainStudenti");

    let s = "<form method='POST' action='modifica.php'><br><table><tr><th>id</th><th>matricola</th><th>nome</th><th>cognome</th><th>nascita</th><th>sesso</th><th>Ecdl</th><th>B2</th><th>ID classe</th></tr>"
        ;

    for (let i = 0; i < resultsStudenti.length; i++) {
        let nascita = new Date(resultsStudenti[i].dataNascita);
        let dataNascita = `${nascita.getDate()}/${nascita.getMonth() + 1}/${nascita.getFullYear()}`;
        let dataNascitaInversa = `${nascita.getFullYear()}-${(nascita.getMonth() + 1).toString().padStart(2, '0')}-${nascita.getDate().toString().padStart(2, '0')}`;
        s += "<tr>";
        s = s + `<td>  <input type="button" name="  ${resultsStudenti[i].id}  " value="  ${resultsStudenti[i].id} " onclick="
            formModificaStudente(${resultsStudenti[i].id} , 
                
                '${resultsStudenti[i].numeroMatricola}', 
                '${resultsStudenti[i].nome}', 
                '${resultsStudenti[i].cognome}',
                '${dataNascitaInversa}',
                '${resultsStudenti[i].sesso}',
                ${resultsStudenti[i].certificazioneECDL},
                ${resultsStudenti[i].certificazioneIngleseB2},
                ${resultsStudenti[i].classe_id}
            
                )
        "></td>`;
        s = s + "<td>" + resultsStudenti[i].numeroMatricola + "</td>";
        s = s + "<td>" + resultsStudenti[i].nome + "</td>";
        s = s + "<td>" + resultsStudenti[i].cognome + "</td>";
        s = s + "<td>" + dataNascita + "</td>";
        s = s + "<td>" + resultsStudenti[i].sesso + "</td>";
        s = s + `<td>  ${resultsStudenti[i].certificazioneECDL == 1 ? "SI" : "NO"}  </td>`;
        s = s + `<td> ${resultsStudenti[i].certificazioneIngleseB2 == 1 ? "SI" : "NO"}  </td>`;
        s = s + "<td>" + resultsStudenti[i].classe_id + "</td>";
        s += "</tr>";
        if (i + 1 == resultsStudenti.length) {
            s += "</table>";
        }
    }


    main.innerHTML = s;
    document.getElementById("form").innerHTML = "";
    document.getElementById("form").style.display = "block";

}

async function classi() {

    let reqClassi = await fetch("/classi");
    let jsonClassi = await reqClassi.json();
    let resultsClassi = jsonClassi.results;
    let main = document.getElementById("mainStudenti");

    let s = `<br><table><tr><th>id</th><th>nomeClasse</th><th>numeroAula</th><th>lim</th></tr>`;

    for (let i = 0; i < resultsClassi.length; i++) {
        s += `
        <tr>
            <td><input type="button" name="${resultsClassi[i].id}" value="${resultsClassi[i].id}" onclick="formModificaClasse(${resultsClassi[i].id}, '${resultsClassi[i].nomeClasse}', ${resultsClassi[i].numeroAula}, ${resultsClassi[i].LIM})"></td>
            <td>${resultsClassi[i].nomeClasse}</td>
            <td>${resultsClassi[i].numeroAula}</td>
            <td>${resultsClassi[i].LIM == 1 ? "SI" : "NO"}</td>
        </tr>
    `;
    }

    s += `</table>`;

    main.innerHTML = s;
    document.getElementById("form").innerHTML = "";
    document.getElementById("form").style.display = "block";
}

document.getElementById("bottoneStudente").onclick = async () => { await studenti(); };
document.getElementById("bottoneClasse").onclick = async () => { await classi(); };



function formModificaClasse(id = 0, nomeClasse = "", numeroAula = 0, LIM = false) {


    document.getElementById("form").style.display = "block";


    let form = `<form method="post" action="${id == 0 ? '/inserisciClasse' : '/modificaClasse'}">
      <input type="hidden" name="id"value="${id}"> <br>
     Nome Classe <input type="text" name="nomeClasse" value="${nomeClasse}"><br>
     Numero Aula<input type="number" name="numeroAula" value="${numeroAula}"><br>
     LIM Libera? <input type="checkbox" name="LIM" ${LIM == 1 ? "checked" : ""}><br>
     <input type="submit" value="${id != 0 ? 'modifica' : 'inserisci'}">
     ${id != 0 ? '<input type="submit" value="Elimina" formaction="/eliminaClasse">' : ""}
     </form > `;
    if (id == 0) {
        document.getElementById("mainStudenti").innerHTML = "";
    }
    document.getElementById("form").innerHTML = form;
};

async function formModificaStudente(id = 0, numeroMatricola = "", nome = "", cognome = "", dataNascita = "", sesso = "", certificazioneECDL = false, certificazioneIngleseB2 = false, classe_id = 0) {


    document.getElementById("form").style.display = "block";


    let reqClassi = await fetch("/classi");
    let jsonClassi = await reqClassi.json();
    let resultsClassi = jsonClassi.results;


    let selectClassi = `<select name="classe_id">`;
    for (let i = 0; i < resultsClassi.length; i++) {
        let selected = resultsClassi[i].id == classe_id ? "selected" : "";
        selectClassi += `<option value="${resultsClassi[i].id}" ${selected}>${resultsClassi[i].nomeClasse}</option>`;
    }
    selectClassi += `</select>`;

    let form = /*html*/`<form method="post" action="${id == 0 ? '/inserisciStudente' : '/modificaStudente'}">
    <input type='hidden' name='id' value='${id}'> <br>
    Numero matricola <input type="text" name="numeroMatricola" value="${numeroMatricola}" ${id != 0 ? "readonly" : ""}> <br>
    nome <input type="text" name="nome" value="${nome}" ${id != 0 ? "readonly" : ""}><br>
    cognome <input type="text" name="cognome" value="${cognome}" ${id != 0 ? "readonly" : ""}><br>
    data Nascita <input type="date" name="dataNascita" value="${dataNascita}">
    <select name="sesso" required>   
        <option value="M" ${sesso == "M" ? "selected" : ""}>Maschio</option>
        <option value="F" ${sesso == "F" ? "selected" : ""}>Femmina</option>
    </select><br>

    Certificazione ECDL:
    <input type="checkbox" name="certificazioneECDL" ${certificazioneECDL == 1 ? "checked" : ""}><br>

    Certificazione Inglese B2:
    <input type="checkbox" name="certificazioneIngleseB2" ${certificazioneIngleseB2 == 1 ? "checked" : ""}><br>

    Classe: ${selectClassi} <br>

    <input type="submit" value="${id != 0 ? 'modifica' : 'inserisci'}">
    ${id != 0 ? '<input type="submit" name="invia"  value="Elimina" formaction="/eliminaStudente">' : ""}
</form>`;
    if (id == 0) {
        document.getElementById("mainStudenti").innerHTML = "";
    }
    document.getElementById("form").innerHTML = form;
}

