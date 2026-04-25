*** Settings ***
Documentation    Laajennetut API-testit
Resource         ../../resources/common.resource
Library          RequestsLibrary


*** Variables ***
${BASE_URL}       http://localhost:5000/api
${CONTENT_TYPE}   application/json


*** Test Cases ***

Profiili GET palauttaa käyttäjätiedot
    [Documentation]    GET /api/user/profile palauttaa 200 ja käyttäjätiedot.
    ${headers}=    Create Dictionary    Content-Type=${CONTENT_TYPE}    Authorization=Bearer ${AUTH_TOKEN}
    ${response}=   GET    ${BASE_URL}/user/profile    headers=${headers}    expected_status=200
    Dictionary Should Contain Key    ${response.json()}    name

Profiili PUT päivittää käyttäjätiedot
    [Documentation]    PUT /api/user/profile päivittää tiedot ja palauttaa 200.
    ${body}=    Create Dictionary    name=Testi    height=180    weight=75    age=25
    ${headers}=    Create Dictionary    Content-Type=${CONTENT_TYPE}    Authorization=Bearer ${AUTH_TOKEN}
    ${response}=   PUT    ${BASE_URL}/user/profile    json=${body}    headers=${headers}    expected_status=200

HRV-data GET palauttaa aikasarjan
    [Documentation]    GET /api/hrv/data palauttaa 200 ja HRV-datan.
    ${headers}=    Create Dictionary    Content-Type=${CONTENT_TYPE}    Authorization=Bearer ${AUTH_TOKEN}
    ${response}=   GET    ${BASE_URL}/hrv/data    headers=${headers}    expected_status=200
    Should Not Be Empty    ${response.json()}

Mood POST tallentaa mielialatiedot
    [Documentation]    POST /api/mood tallentaa mielialan ja palauttaa 200.
    ${body}=    Create Dictionary    mood=7    workload=5
    ${headers}=    Create Dictionary    Content-Type=${CONTENT_TYPE}    Authorization=Bearer ${AUTH_TOKEN}
    ${response}=   POST    ${BASE_URL}/mood    json=${body}    headers=${headers}    expected_status=200