*** Settings ***
Documentation    Taustapalvelimen API-testit (REST)
Resource         ../../resources/common.resource
Library          RequestsLibrary


*** Variables ***
${BASE_URL}       http://localhost:5000/api
${CONTENT_TYPE}   application/json


*** Test Cases ***
API palauttaa terveystiedot kirjautuneelle käyttäjälle
    [Documentation]    GET /api/entries palauttaa 200 ja listan merkintöjä.
    ${headers}=    Create Dictionary    Content-Type=${CONTENT_TYPE}    Authorization=Bearer ${AUTH_TOKEN}
    ${response}=   GET    ${BASE_URL}/entries    headers=${headers}    expected_status=200
    Should Not Be Empty    ${response.json()}

Uuden terveystiedon lisääminen onnistuu
    [Documentation]    POST /api/entries luo uuden merkinnän ja palauttaa 201.
    ${body}=    Create Dictionary    date=2026-04-07    weight=70.5    note=Hyvin nukuttu yö
    ${headers}=    Create Dictionary    Content-Type=${CONTENT_TYPE}    Authorization=Bearer ${AUTH_TOKEN}
    ${response}=   POST    ${BASE_URL}/entries    json=${body}    headers=${headers}    expected_status=201
    Dictionary Should Contain Key    ${response.json()}    id

Kirjautumaton käyttäjä ei pääse API:in
    [Documentation]    GET /api/entries ilman tokenia palauttaa 401.
    ${response}=   GET    ${BASE_URL}/entries    expected_status=401
