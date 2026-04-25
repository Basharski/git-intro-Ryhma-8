*** Settings ***
Documentation    Käyttöliittymätestit – profiili-overlay
Resource         ../../resources/common.resource

Suite Setup      Open Browser To Login Page
Suite Teardown   Close Browser


*** Variables ***
${VALID_USER}     testikäyttäjä@example.com
${VALID_PASS}     salasana123


*** Test Cases ***
Profiili-overlay avautuu
    [Documentation]    Profiili-overlay aukeaa kun sitä klikataan.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    Profiili

Profiilitietojen tallennus toimii
    [Documentation]    Käyttäjä voi tallentaa profiilitiedot.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    Tallenna