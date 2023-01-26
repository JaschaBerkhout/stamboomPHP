<?php
namespace App;

class Tester {

    private PersonsDatabase $db;

    public function __construct(PersonsDatabase $db) {
        $this->db = $db;
    }

    
    private function laatTestNaamZien(string $test_naam): void
    {
        echo "<br> ". $test_naam . " : ";
    }
    
    private function expectCertainResult($resultaat, $verwachting): void
    {
        echo $resultaat === $verwachting ? "Test is gelukt" : "Test is niet gelukt!";
    }

    private function testPersoon(int $deathday = null, int $user_id = 70): array
    {
       return [
            'f_name' => 'voornaam',
            'l_name' => 'l_name',
            'gender' => 'gender',
            'birthday' => 'birthday',
            'deathday' => $deathday,
            'user_id' => $user_id,
        ];
    }

    private function getLevendPersoon(): array
    {
        return $this->testPersoon();
    }
    private function getDooie(): array
    {
        return $this->testPersoon('01-01-2023');
    }


// wat gebeurt er als je een relatie toevoegt van een type die bestaat
    public function testInsertValidRelationship(): void
    {
        $this->laatTestNaamZien(__METHOD__);
        $resultaat = $this->db->insertRelationship(2, 43, 2);
        $verwachting = true;
        $this->expectCertainResult($resultaat, $verwachting);
    }

// wat gebeurt er als je een relatie toevoegt van een type die NIET bestaat
    public function testInsertInvalidRelationship(): void
    {
        $this->laatTestNaamZien(__METHOD__);
        $resultaat = $this->db->insertRelationship(21298, 43, 2);
        $verwachting = false;
        $this->expectCertainResult($resultaat, $verwachting);
    }

    // wat gebeurt er als je een persoon toevoegt ZONDER een deathday
   
    public function testAddPersonWithoutDataGivesFalse(): void
    {
        $this->laatTestNaamZien(__METHOD__);
        $resultaat = $this->db->insertPerson(null);

        $this->expectCertainResult($resultaat,false);
    }

    public function testAddPersonWithoutDeathday(): void
    {
        $this->laatTestNaamZien(__METHOD__);
        $test_persoon = $this->getLevendPersoon();
        $resultaat = $this->db->insertPerson($test_persoon);
        $this->expectCertainResult($resultaat,true);
    }

    // wat gebeurt er als je een persoon toevoegt met een deathday
    public function testAddPersonWithDeathday(): void
    {
        $this->laatTestNaamZien(__METHOD__);
        $test_persoon = $this->getDooie();
        $resultaat = $this->db->insertPerson($test_persoon);
        $this->expectCertainResult($resultaat,true);
    }


    public function testPersonenVerwijderenVanUser(): void
    {
        $this->laatTestNaamZien(__METHOD__);

        // arrangeren
        $this->db->insertPerson($this->getLevendPersoon());
        
        // acteren
        $this->db->removeAllPersonsFromUser();
        
        // assertief zijn
        $aantalPersonenPerUser = count($this->db->getPersonsPerUser(70));
        $this->expectCertainResult($aantalPersonenPerUser,0);
    }



    // testjes schrijven voor user toevoegen met meerdere mogelijkheden
};