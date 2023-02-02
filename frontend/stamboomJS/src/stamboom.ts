async function fetchPersonsForUser(id){
    let response = await fetch('http://localhost:8000/?type=personen_json&user_id=' + id)
    if(response.ok){
        return await response.json();
    }
    alert("HTTP-Error: " + response.status);
    return [];
}

function refreshFamilyTree (id){
    fetchPersonsForUser(id).then((personsFromData) => {
            if(personsFromData.length === 0){
                console.log("Geen personen gevonden");
                return;
            }
            console.log(personsFromData);
            const persons = [];
            personsFromData.forEach(persoon => {
                    if(persoon === null) {
                    return;
                }
                persons.push(
                    new Persoon(persoon.id,persoon.f_name, persoon.l_name, persoon.gender,persoon.birthday,persoon.user_id,persoon.deathday))
            })
            updateSummary(personsFromData.length);
            updateFamilyTreeOnWebpage(persons)
        }
    );
};
refreshFamilyTree(1);
function allOfTheFamily(persons) {
    let result = '';
    persons.forEach(person => result += personCard(person))
    return result;
};

function updateFamilyTreeOnWebpage(persons){
    const personenElement = document.getElementById('personen');
    personenElement.innerHTML = allOfTheFamily(persons);
};

function personCard(person) {
    return "<div class='"+ (person.gender === 'm' ? 'man' : 'vrouw')+ " persoon'>"+person.name() +
        ' <br> '+ person.getAgeOfPerson()+
        ' jaar' +
        ' <br>* ' +
        person.niceDateFormat(person.birthday) +
        ' <br>' +
        (person.isPassedAway() ? '✝ ' + person.niceDateFormat(person.deathday) : '') +
        '</div>';
};

class Persoon {
    private id: number;
    private f_name: string;
    private l_name: string;
    private gender: string;
    private birthday: string;
    private user_id: number;
    private deathday: string;
    private persons = allOfTheFamily(1);
    constructor(id: number, f_name: string, l_name: string, gender: string, birthday: string, user_id: number, deathday: string){
        this.id = id
        this.f_name = f_name
        this.l_name = l_name
        this.gender = gender
        this.birthday = birthday
        this.user_id = user_id
        this.deathday = deathday
    }

    name(){
        return this.f_name + ' ' + this.l_name
    }

    /**
     * yolo
     * @param startDatum
     * @param eindDatum
     */
    getAge(startDatum: Date, eindDatum: Date){
        let leeftijd = eindDatum.getFullYear() - startDatum.getFullYear();
        const maand = eindDatum.getMonth() - startDatum.getMonth();
        const dag = eindDatum.getDate() - startDatum.getDate()
        if (maand < 0 || (maand === 0 && dag < 0)){
            return leeftijd - 1;
        }
        return leeftijd
    }

    getAgeOfPerson(){
        const geboortedatum = new Date(this.birthday);

        if (!this.isPassedAway()){
            const vandaag = new Date();
            return this.getAge(geboortedatum,vandaag);
        }
        const overlijdensdatum = new Date(this.deathday);
        return this.getAge(geboortedatum,overlijdensdatum);
    }

    niceDateFormat(datum) {
        return new Date(datum).toLocaleDateString('nl-nl');
    }

    isPassedAway(){
        return this.deathday !== null
    }
    numberOfPersons(){
        return this.persons.length;
    }

};

function updateSummary(numberOfPersons) {
    const samenvatting = document.getElementById('samenvatting')
// if samenvatting is niet gelijk aan tekst niet doen anders
    let summaryText = () => {
        if (numberOfPersons === 1 ){
            return `De familie bevat nu ${numberOfPersons} persoon.`
        }
        else {
            return `De familie bevat nu ${numberOfPersons} personen.`
        }
    }
    samenvatting.innerHTML = summaryText()
};

function generalMessage(tekst){
    const meldingElement = document.getElementById('melding')
    meldingElement.innerHTML = tekst
    removeMessage()
};

function removeMessage(){
    setTimeout(() => document.getElementById('melding').innerHTML = '', 5000);
};

// zodra form werkt deze eraan koppelen.
function messageNewPersonCreated(persoon) {
    generalMessage(`${persoon.f_name} is toegevoegd aan de familie ${persoon.l_name}.`);
};


function showPassword() {
    let password = document.getElementById("password") as HTMLInputElement | null;
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}