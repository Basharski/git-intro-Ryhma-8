*** Settings ***
Documentation    Käyttöliittymätestit – kirjautuminen ja navigointi
Resource         ../../resources/common.resource

Suite Setup      Open Browser To Login Page
Suite Teardown   Close Browser


*** Variables ***
${LOGIN_URL}      http://localhost:3000/login
${VALID_USER}     testikäyttäjä@example.com
${VALID_PASS}     salasana123


*** Test Cases ***
Onnistunut kirjautuminen
    [Documentation]    Käyttäjä kirjautuu sisään oikeilla tunnuksilla.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    Tervetuloa

Kirjautuminen epäonnistuu väärällä salasanalla
    [Documentation]    Kirjautuminen hylätään väärillä tunnuksilla.
    Kirjaudu sisään    ${VALID_USER}    väärä_salasana
    Sivun pitää sisältää    Kirjautuminen epäonnistui

Kirjautuminen epäonnistuu tyhjillä kentillä
    [Documentation]    Kirjautuminen hylätään, kun kentät ovat tyhjiä.
    Kirjaudu sisään    ${EMPTY}    ${EMPTY}
    Sivun pitää sisältää    Täytä kaikki kentät
