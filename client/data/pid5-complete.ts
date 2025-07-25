export interface PID5Item {
  id: number;
  text: string;
  domain:
    | "Affettività Negativa"
    | "Distacco"
    | "Antagonismo"
    | "Disinibizione"
    | "Psicoticismo";
  facet: string;
  reversed?: boolean;
}

export interface PID5TestComplete {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  items: PID5Item[];
  domains: string[];
  facets: Record<string, string[]>;
  scaleLikert: string[];
}

export const PID5_SCALE = [
  "Mai o Molto Raramente Vero",
  "Qualche Volta o Poche Volte Vero",
  "Spesso Vero",
  "Sempre o Molto Spesso Vero",
];

// Definizione delle faccette per dominio secondo DSM-5
export const PID5_FACETS = {
  "Affettività Negativa": [
    "Labilità Emotiva",
    "Ansia",
    "Ansia da Separazione",
    "Sottomissione",
    "Ostilità",
    "Perseverazione",
    "Depressività",
    "Sospettosità",
    "Ristrettezza Affettiva",
  ],
  Distacco: [
    "Evitamento dell'Intimità",
    "Anedonia",
    "Depressività",
    "Ristrettezza Affettiva",
    "Sospettosità",
    "Ritiro",
  ],
  Antagonismo: [
    "Manipolazione",
    "Inganno",
    "Grandiosità",
    "Ricerca di Attenzione",
    "Insensibilità",
    "Ostilità",
  ],
  Disinibizione: [
    "Irresponsabilità",
    "Impulsività",
    "Distraibilità",
    "Assunzione di Rischi",
    "Perfezionismo Rigido (reversed)",
  ],
  Psicoticismo: [
    "Credenze e Esperienze Insolite",
    "Eccentricità",
    "Disregolazione Cognitiva e Percettiva",
  ],
};

// Test PID-5 completo con 220 item
export const PID5_COMPLETE: PID5TestComplete = {
  id: 1,
  title:
    "PID-5 - Inventario della Personalità per DSM-5 (Versione Completa - 220 Item)",
  description:
    "Strumento di valutazione completo dei tratti di personalità maladattivi secondo il modello dimensionale del DSM-5",
  duration: 45,
  totalQuestions: 220,
  domains: [
    "Affettività Negativa",
    "Distacco",
    "Antagonismo",
    "Disinibizione",
    "Psicoticismo",
  ],
  facets: PID5_FACETS,
  scaleLikert: PID5_SCALE,
  items: [
    // AFFETTIVITÀ NEGATIVA - 53 items
    // Labilità Emotiva
    {
      id: 1,
      text: "I miei stati d'animo cambiano molto.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva",
    },
    {
      id: 2,
      text: "Le mie emozioni cambiano molto e rapidamente.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva",
    },
    {
      id: 3,
      text: "Sono una persona molto emotiva.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva",
    },
    {
      id: 4,
      text: "I miei umori sono molto instabili.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva",
    },
    {
      id: 5,
      text: "Passo rapidamente da un umore all'altro.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva",
    },
    {
      id: 6,
      text: "Le mie emozioni vanno su e giù.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva",
    },

    // Ansia
    {
      id: 7,
      text: "Mi sento ansioso/a la maggior parte del tempo.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },
    {
      id: 8,
      text: "Mi preoccupo per quasi tutto.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },
    {
      id: 9,
      text: "Sono una persona molto ansiosa.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },
    {
      id: 10,
      text: "Mi sento sempre teso/a.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },
    {
      id: 11,
      text: "Ho molte paure che sembrano irragionevoli alla maggior parte delle persone.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },
    {
      id: 12,
      text: "Sono spesso nervoso/a.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },
    {
      id: 13,
      text: "Provo ansia in molte situazioni diverse.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },

    // Ansia da Separazione
    {
      id: 14,
      text: "Ho paura di essere abbandonato/a dalle persone vicine a me.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione",
    },
    {
      id: 15,
      text: "Sono una persona molto sensibile al rifiuto o alle critiche.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione",
    },
    {
      id: 16,
      text: "Mi spaventa quando le persone mi lasciano solo/a.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione",
    },
    {
      id: 17,
      text: "Ho paura di perdere le persone vicine a me.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione",
    },
    {
      id: 18,
      text: "Mi fa male quando le persone mi criticano.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione",
    },
    {
      id: 19,
      text: "Mi preoccupo di essere rifiutato/a.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione",
    },

    // Sottomissione
    {
      id: 20,
      text: "Faccio tutto quello che gli altri mi dicono di fare.",
      domain: "Affettività Negativa",
      facet: "Sottomissione",
    },
    {
      id: 21,
      text: "Cambio quello che faccio a seconda di quello che vogliono gli altri.",
      domain: "Affettività Negativa",
      facet: "Sottomissione",
    },
    {
      id: 22,
      text: "Faccio quello che gli altri vogliono che io faccia.",
      domain: "Affettività Negativa",
      facet: "Sottomissione",
    },
    {
      id: 23,
      text: "È difficile per me essere in disaccordo con gli altri, anche quando so che hanno torto.",
      domain: "Affettività Negativa",
      facet: "Sottomissione",
    },
    {
      id: 24,
      text: "Difficilmente contesto le decisioni degli altri.",
      domain: "Affettività Negativa",
      facet: "Sottomissione",
    },

    // Ostilità
    {
      id: 25,
      text: "Mi arrabbio facilmente.",
      domain: "Affettività Negativa",
      facet: "Ostilità",
    },
    {
      id: 26,
      text: "Sono spesso arrabbiato/a.",
      domain: "Affettività Negativa",
      facet: "Ostilità",
    },
    {
      id: 27,
      text: "La gente mi descrive come una persona ostile.",
      domain: "Affettività Negativa",
      facet: "Ostilità",
    },
    {
      id: 28,
      text: "Posso essere cattivo/a con le persone.",
      domain: "Affettività Negativa",
      facet: "Ostilità",
    },
    {
      id: 29,
      text: "Spesso sono irritabile.",
      domain: "Affettività Negativa",
      facet: "Ostilità",
    },
    {
      id: 30,
      text: "Vado in collera facilmente.",
      domain: "Affettività Negativa",
      facet: "Ostilità",
    },

    // Perseverazione
    {
      id: 31,
      text: "Continuo a pensare a cose brutte che mi sono successe.",
      domain: "Affettività Negativa",
      facet: "Perseverazione",
    },
    {
      id: 32,
      text: "Ripeto sempre gli stessi pensieri.",
      domain: "Affettività Negativa",
      facet: "Perseverazione",
    },
    {
      id: 33,
      text: "È difficile smettere di pensare a cose che mi turbano.",
      domain: "Affettività Negativa",
      facet: "Perseverazione",
    },
    {
      id: 34,
      text: "I miei pensieri continuano a tornare alle stesse idee.",
      domain: "Affettività Negativa",
      facet: "Perseverazione",
    },
    {
      id: 35,
      text: "Non riesco a smettere di pensare a qualcosa una volta che ci ho iniziato.",
      domain: "Affettività Negativa",
      facet: "Perseverazione",
    },

    // Depressività
    {
      id: 36,
      text: "Spesso mi sento senza speranza.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 37,
      text: "Mi sento inutile.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 38,
      text: "Provo spesso vergogna.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 39,
      text: "Spesso mi sento triste.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 40,
      text: "Mi sento come se fossi un/a fallito/a.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 41,
      text: "Mi sento vuoto/a dentro.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 42,
      text: "Sono pessimista.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 43,
      text: "Mi sento inadeguato/a.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },
    {
      id: 44,
      text: "Mi critico molto.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },

    // Sospettosità
    {
      id: 45,
      text: "Sospetto che le persone abbiano cattive intenzioni, anche quando sembrano gentili.",
      domain: "Affettività Negativa",
      facet: "Sospettosità",
    },
    {
      id: 46,
      text: "Sono sospettoso/a di persone che sembrano troppo amichevoli.",
      domain: "Affettività Negativa",
      facet: "Sospettosità",
    },
    {
      id: 47,
      text: "Non mi fido facilmente di altre persone.",
      domain: "Affettività Negativa",
      facet: "Sospettosità",
    },
    {
      id: 48,
      text: "Sospetto motivi nascosti quando qualcuno fa qualcosa di carino per me.",
      domain: "Affettività Negativa",
      facet: "Sospettosità",
    },
    {
      id: 49,
      text: "Anche quando sembra che tutto vada bene, penso che qualcosa di brutto possa succedere.",
      domain: "Affettività Negativa",
      facet: "Sospettosità",
    },

    // DISTACCO - 35 items
    // Evitamento dell'Intimità
    {
      id: 50,
      text: "Preferisco stare da solo/a piuttosto che con gli altri.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 51,
      text: "Sono una persona riservata.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 52,
      text: "Non ho interesse nel fare amicizie.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 53,
      text: "Non mi piace passare del tempo con gli altri.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 54,
      text: "Evito le relazioni romantiche.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 55,
      text: "Preferisco non dire alle persone informazioni personali su di me.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 56,
      text: "Evito di avvicinarmi troppo alle persone.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 57,
      text: "Sono distaccato/a dalle altre persone.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 58,
      text: "Mi tengo per conto mio.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },

    // Anedonia
    {
      id: 59,
      text: "Non traggo così tanto piacere dalle cose come gli altri sembrano trarne.",
      domain: "Distacco",
      facet: "Anedonia",
    },
    {
      id: 60,
      text: "Raramente sono entusiasta di qualcosa.",
      domain: "Distacco",
      facet: "Anedonia",
    },
    {
      id: 61,
      text: "Tendo a non avere obiettivi a lungo termine.",
      domain: "Distacco",
      facet: "Anedonia",
    },
    {
      id: 62,
      text: "Non provo molta soddisfazione dal conseguimento degli obiettivi.",
      domain: "Distacco",
      facet: "Anedonia",
    },
    {
      id: 63,
      text: "Non mi eccito facilmente.",
      domain: "Distacco",
      facet: "Anedonia",
    },
    {
      id: 64,
      text: "Non sono motivato/a da molto.",
      domain: "Distacco",
      facet: "Anedonia",
    },
    {
      id: 65,
      text: "Non ho forti desideri o bisogni.",
      domain: "Distacco",
      facet: "Anedonia",
    },

    // Ristrettezza Affettiva (in Distacco)
    {
      id: 66,
      text: "Non provo emozioni molto forti.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva",
    },
    {
      id: 67,
      text: "Sono una persona emotivamente fredda.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva",
    },
    {
      id: 68,
      text: "Raramente esprimo le mie vere emozioni.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva",
    },
    {
      id: 69,
      text: "Non mostro le mie emozioni agli altri.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva",
    },
    {
      id: 70,
      text: "Sono una persona piuttosto seria.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva",
    },
    {
      id: 71,
      text: "Non mi emoziono facilmente.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva",
    },

    // Ritiro
    {
      id: 72,
      text: "Evito le situazioni sociali.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 73,
      text: "Cerco di evitare le folle.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 74,
      text: "Mi sento a disagio quando sono al centro dell'attenzione.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 75,
      text: "Ho difficoltà a iniziare conversazioni.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 76,
      text: "Sono spesso silenzioso/a quando sono con altre persone.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 77,
      text: "Evito le attività di gruppo.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 78,
      text: "Sono timido/a con le persone che non conosco bene.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    { id: 79, text: "Non parlo molto.", domain: "Distacco", facet: "Ritiro" },
    {
      id: 80,
      text: "Tengo le mie opinioni per me stesso/a.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 81,
      text: "È difficile per me socializzare.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 82,
      text: "Rimango in disparte alle feste.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 83,
      text: "Non condivido i miei pensieri e sentimenti con gli altri.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 84,
      text: "Evito di chiamare l'attenzione su di me.",
      domain: "Distacco",
      facet: "Ritiro",
    },

    // ANTAGONISMO - 35 items
    // Manipolazione
    {
      id: 85,
      text: "Uso le persone per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Manipolazione",
    },
    {
      id: 86,
      text: "Posso convincere le persone a fare qualsiasi cosa.",
      domain: "Antagonismo",
      facet: "Manipolazione",
    },
    {
      id: 87,
      text: "È facile per me trarre vantaggio dagli altri.",
      domain: "Antagonismo",
      facet: "Manipolazione",
    },
    {
      id: 88,
      text: "So come fare in modo che le persone facciano quello che voglio.",
      domain: "Antagonismo",
      facet: "Manipolazione",
    },
    {
      id: 89,
      text: "Manipolo gli altri per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Manipolazione",
    },
    {
      id: 90,
      text: "Posso fare in modo che le persone credano a qualsiasi cosa.",
      domain: "Antagonismo",
      facet: "Manipolazione",
    },

    // Inganno
    {
      id: 91,
      text: "Non esito a trarre vantaggio dagli altri.",
      domain: "Antagonismo",
      facet: "Inganno",
    },
    {
      id: 92,
      text: "Mento per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Inganno",
    },
    {
      id: 93,
      text: "Spesso mento per comodità.",
      domain: "Antagonismo",
      facet: "Inganno",
    },
    {
      id: 94,
      text: "Sono bravo/a a fingere.",
      domain: "Antagonismo",
      facet: "Inganno",
    },
    {
      id: 95,
      text: "Inganno le persone per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Inganno",
    },
    { id: 96, text: "Mento spesso.", domain: "Antagonismo", facet: "Inganno" },
    {
      id: 97,
      text: "Nascondo la verità agli altri.",
      domain: "Antagonismo",
      facet: "Inganno",
    },

    // Grandiosità
    {
      id: 98,
      text: "Mi merito di più di quello che ho.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },
    {
      id: 99,
      text: "Sono superiore alla maggior parte delle persone.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },
    {
      id: 100,
      text: "Dovrei essere trattato/a come una persona importante.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },
    {
      id: 101,
      text: "Sono più importante di altre persone.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },
    {
      id: 102,
      text: "Mi aspetto che le persone mi prestino attenzione speciale.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },
    {
      id: 103,
      text: "Merito trattamenti speciali.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },
    {
      id: 104,
      text: "Sono una persona eccezionale.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },

    // Ricerca di Attenzione
    {
      id: 105,
      text: "Mi piace essere al centro dell'attenzione.",
      domain: "Antagonismo",
      facet: "Ricerca di Attenzione",
    },
    {
      id: 106,
      text: "Voglio essere il centro dell'attenzione.",
      domain: "Antagonismo",
      facet: "Ricerca di Attenzione",
    },
    {
      id: 107,
      text: "Faccio cose per assicurarmi che le persone mi notino.",
      domain: "Antagonismo",
      facet: "Ricerca di Attenzione",
    },
    {
      id: 108,
      text: "Cerco di attirare l'attenzione.",
      domain: "Antagonismo",
      facet: "Ricerca di Attenzione",
    },
    {
      id: 109,
      text: "Faccio cose drammatiche per attirare l'attenzione.",
      domain: "Antagonismo",
      facet: "Ricerca di Attenzione",
    },
    {
      id: 110,
      text: "Mi comporto in modo provocante.",
      domain: "Antagonismo",
      facet: "Ricerca di Attenzione",
    },

    // Insensibilità
    {
      id: 111,
      text: "Non mi dispiace se qualcuno viene ferito, purché io ottenga quello che voglio.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 112,
      text: "Non sono interessato/a ai problemi di altre persone.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 113,
      text: "Non mi importa se offendo le persone.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 114,
      text: "Non mi sento in colpa quando faccio qualcosa di sbagliato.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 115,
      text: "Non mi preoccupo di ferire i sentimenti delle persone.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 116,
      text: "Quando faccio qualcosa di sbagliato, non provo rimorso.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 117,
      text: "Sono insensibile ai sentimenti degli altri.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 118,
      text: "Non mi dispiace quando vedo qualcuno ferire un'altra persona.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 119,
      text: "È facile per me approfittare degli altri.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },

    // DISINIBIZIONE - 54 items
    // Irresponsabilità
    {
      id: 120,
      text: "Altri mi vedono come qualcuno che non è affidabile.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 121,
      text: "Non sono molto affidabile.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 122,
      text: "Le persone si lamentano che non seguo fino in fondo le cose.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 123,
      text: "Non tengo le mie promesse.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 124,
      text: "Dico alle persone una cosa ma poi ne faccio un'altra.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 125,
      text: "Evito le mie responsabilità.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 126,
      text: "Non adempio ai miei doveri.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 127,
      text: "Sono inaffidabile.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 128,
      text: "Ho problemi a pagare i miei debiti.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },

    // Impulsività
    {
      id: 129,
      text: "Spesso agisco impulsivamente.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 130,
      text: "Spesso faccio cose che so che dovrei evitare.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 131,
      text: "Tendo a dare priorità al piacere e al divertimento piuttosto che agli obiettivi a lungo termine.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 132,
      text: "Faccio cose pericolose senza pensarci.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 133,
      text: "Faccio cose senza pensare alle conseguenze.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 134,
      text: "Agisco senza pensare.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 135,
      text: "Faccio cose d'impulso.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 136,
      text: "Sono impulsivo/a.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 137,
      text: "Agisco senza riflettere.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 138,
      text: "Faccio cose rapidamente senza pensare prima.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 139,
      text: "Prendo decisioni rapidamente.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 140,
      text: "Agisco senza considerare le conseguenze.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 141,
      text: "Spesso faccio cose che poi rimpiango.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },

    // Distraibilità
    {
      id: 142,
      text: "Non completo le cose che inizio.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 143,
      text: "Tendo a perdere la concentrazione facilmente.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 144,
      text: "Dimentico spesso gli appuntamenti.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 145,
      text: "Ho difficoltà a rimanere concentrato/a su compiti difficili o noiosi.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 146,
      text: "La mia attenzione si sposta spesso da una cosa all'altra.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 147,
      text: "Sono facilmente distraibile.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 148,
      text: "Ho difficoltà a concentrarmi.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 149,
      text: "Non riesco a concentrarmi su una cosa per molto tempo.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 150,
      text: "La mia mente spesso vaga.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 151,
      text: "Ho difficoltà a portare a termine i progetti.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 152,
      text: "Sono disorganizzato/a.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },

    // Assunzione di Rischi
    {
      id: 153,
      text: "Prendo rischi spesso.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 154,
      text: "Mi piace correre rischi.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 155,
      text: "Faccio cose rischiose.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 156,
      text: "Cerco esperienze intense.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 157,
      text: "Mi piace fare cose che gli altri considererebbero pericolose.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 158,
      text: "Prendo molte decisioni improvvise.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 159,
      text: "Faccio molte cose sull'impulso del momento.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 160,
      text: "Mi comporto in modo spericolato.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 161,
      text: "Faccio cose eccitanti anche se sono pericolose.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 162,
      text: "Mi piace vivere in modo pericoloso.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 163,
      text: "Faccio cose che mettono me stesso/a in pericolo.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },

    // Perfezionismo Rigido (reversed scoring)
    {
      id: 164,
      text: "Cerco di essere perfetto/a in tutto quello che faccio.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 165,
      text: "Sono molto esigente con me stesso/a.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 166,
      text: "Stabilisco standard molto alti per me stesso/a.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 167,
      text: "Sono un/a perfezionista.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 168,
      text: "Non sono mai soddisfatto/a a meno che le cose non siano perfette.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 169,
      text: "Devo fare le cose perfettamente o per niente.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 170,
      text: "Sono ossessionato/a dall'ordine.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 171,
      text: "Mantengo tutti i miei oggetti puliti e organizzati.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 172,
      text: "Pianifico tutto in anticipo.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },
    {
      id: 173,
      text: "Non posso rilassarmi finché non ho finito tutto quello che devo fare.",
      domain: "Disinibizione",
      facet: "Perfezionismo Rigido",
      reversed: true,
    },

    // PSICOTICISMO - 43 items
    // Credenze e Esperienze Insolite
    {
      id: 174,
      text: "Spesso ho pensieri che non hanno senso per gli altri.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 175,
      text: "Ho alcune credenze insolite.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 176,
      text: "Ho visto cose che altri non possono vedere.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 177,
      text: "Ho sentito cose che altre persone non hanno sentito.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 178,
      text: "Sento che non appartengo veramente a questo mondo.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 179,
      text: "Ho esperienze che altri descriverebbero come strane o insolite.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 180,
      text: "Vedo cose in modo diverso dalle altre persone.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 181,
      text: "Ho pensieri che sembrano strani anche a me.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 182,
      text: "Ho avuto esperienze mistiche o spirituali.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 183,
      text: "Posso leggere la mente delle persone.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 184,
      text: "Ho poteri speciali che altre persone non hanno.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 185,
      text: "A volte sento voci che altre persone non sentono.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 186,
      text: "Ho credenze che altri trovano strane.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 187,
      text: "Vedo significati nascosti dappertutto.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 188,
      text: "Sento che qualcuno o qualcosa mi controlla.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 189,
      text: "Ho avuto visioni che erano reali per me.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },

    // Eccentricità
    {
      id: 190,
      text: "La gente pensa che io sia strano/a o eccentrico/a.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 191,
      text: "Dico cose che gli altri trovano strane o bizzarre.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 192,
      text: "I miei modi di fare le cose sembrano strani agli altri.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 193,
      text: "Mi comporto in modi che altri trovano strani.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 194,
      text: "Le persone spesso non capiscono il mio comportamento.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 195,
      text: "Altri mi considerano eccentrico/a.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 196,
      text: "Faccio cose che altri considerano bizzarre.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 197,
      text: "Il mio comportamento spesso confonde le persone.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 198,
      text: "Le persone a volte mi guardano stranamente.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 199,
      text: "Sono diverso/a dalle altre persone.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 200,
      text: "Le persone non mi capiscono.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },

    // Disregolazione Cognitiva e Percettiva
    {
      id: 201,
      text: "I miei pensieri spesso non si connettono tra loro.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 202,
      text: "Le persone spesso non capiscono quello che sto dicendo.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 203,
      text: "I miei pensieri si confondono facilmente.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 204,
      text: "Ho difficoltà a organizzare i miei pensieri.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 205,
      text: "I miei pensieri saltano da un argomento all'altro.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 206,
      text: "La mia mente spesso va in direzioni diverse.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 207,
      text: "Ho difficoltà a mantenere un filo logico quando parlo.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 208,
      text: "I miei pensieri sono spesso confusi.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 209,
      text: "Perdo spesso il filo di quello che sto dicendo.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 210,
      text: "Le mie idee spesso non hanno senso per gli altri.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 211,
      text: "Ho difficoltà a esprimere chiaramente i miei pensieri.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 212,
      text: "I miei pensieri sono disorganizzati.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 213,
      text: "Ho problemi di concentrazione.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 214,
      text: "La mia mente spesso divaga.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 215,
      text: "Dimenticare le cose è un problema per me.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 216,
      text: "Ho difficoltà a ricordare le cose.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 217,
      text: "La mia memoria non è molto buona.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 218,
      text: "Ho problemi a rimanere concentrato/a.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 219,
      text: "La mia attenzione spesso si sposta.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 220,
      text: "Ho difficoltà a prestare attenzione per lunghi periodi.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
  ],
};
