*** Settings ***
Documentation    Yhteisesti käytetyt avainsanat ja asetukset
Library          Browser


*** Keywords ***
Open Browser To Login Page
    [Documentation]    Avaa selain kirjautumissivulle.
    New Browser    chromium    headless=False
    New Page       ${LOGIN_URL}
    Get Title      *=    Terveyssovellus

Kirjaudu sisään
    [Documentation]    Täytä kirjautumislomake ja lähetä se.
    [Arguments]    ${email}    ${password}
    Fill Text      id=email      ${email}
    Fill Text      id=password   ${password}
    Click          id=login-btn

Sivun pitää sisältää
    [Documentation]    Tarkista, että sivulla näkyy odotettu teksti.
    [Arguments]    ${text}
    Get Page Source    contains    ${text}

Close Browser
    [Documentation]    Sulje selain.
    Close All Browsers
