*** Settings ***
Documentation    Käyttöliittymätestit – etusivu
Resource         ../../resources/common.resource

Suite Setup      Open Browser To Login Page
Suite Teardown   Close Browser


*** Variables ***
${VALID_USER}     testikäyttäjä@example.com
${VALID_PASS}     salasana123


*** Test Cases ***
HRV-kortit näkyvät etusivulla
    [Documentation]    Etusivulla näkyy HRV-yhteenveto kortteina.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    HRV

Mieliala-liukusäädin näkyy etusivulla
    [Documentation]    Etusivulla näkyy mieliala-liukusäädin.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    mieliala

Suositukset näkyvät etusivulla
    [Documentation]    Etusivulla näkyy liikuntasuositukset.
    Kirjaudu sisään    ${VALID_USER}    ${VALID_PASS}
    Sivun pitää sisältää    suositukset