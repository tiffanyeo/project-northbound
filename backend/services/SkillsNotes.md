
RÄKNA UT PARTICIPANTS SKILLS



Steg 1: Beräkning från results från alla events

Räkna alla poäng participant1 har fått i alla discipline1 och multiplicera ggr vikten av skill1 i discipline1 (den info finns i varje disciplin). Du får ett tal: P1D1S1.

Gör detsamma för alla skills (inom samma disciplin, samma participant), du får 5 tal: P1D1S2, P1D1S3, osv.
Gör samma sak för alla disciplines (samma participant), du får 25 tal:
    P1D1S1, P1D1S2, P1D1S3, osv
    P1D2S1, P1D2S2, P1D2S3, osv
    ...alla disciplines



Steg 2: Mellansteg

Du kan nu få ett tal för varje participant, varje skill:
    P1S1 = P1D1S1 + P1D2S1 + P1D3S1 + P1D4S1 + P1D5S1
    P1S2 = P1D1S2 + P1D2S2 + P1D3S2 + P1D4S2 + P1D5S2
    etc

När du har detta för alla participants så har du 5 * nParticipants olika tal (mellansteg-värden):
    P1S1, P1S2, P1S3, P1S4, P1S5
    P2S1, P2S2, P2S3, P2S4, P2S5
    Etc



Steg 3: Skalning

Hitta minsta värdet av alla dessa mellansteg-värden: Min
Och max värdet av alla: Max.

Sen väljer du det du tycker ska vara minsta skillFactor (minSkillFactor) för en participant. Exvis 10 (det ska inte vara 0, alla participants har mer än 0 i alla skills). Dvs. participant som har lägst skillFactor inom en skill kommer att ha skillFactor 10 i den.

Detsamma för max, exvis 20. Eller 30, 42, välj något som passar (också men minSkillFactor)
Sen kan du få skillFactors för varje participant genom att skala deras mellansteg-värden till din range minSkillFactor - maxSkillFactor (exvis 10-20).

Detta görs enkelt med en scaleLinear från d3 där domain är [Min, Max] och range är [10, 20], eller de värden du väljer.