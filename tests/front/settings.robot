*** Settings ***
Documentation    Käyttöliittymätestit – asetukset
Resource         ../../resources/common.resource

Suite Setup      Open Browser To Login Page
Suite Teardown   Close Browser


*** Variables ***
${VALID_USER}     testikäyttäjä@example.com
${VALID_PASS}     salasana123


*** Test Cases ***
Teeman vaihto toimii
    [Documentation]    Käyttäjä voi vaihtaa tumman ja vaalean teeman välillä.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    Teema

Datan lataus toimii
    [Documentation]    Käyttäjä voi ladata dataa.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    Lataa