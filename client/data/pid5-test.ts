export interface PID5Question {
  id: number;
  text: string;
  domain: 'Affettività Negativa' | 'Distacco' | 'Antagonismo' | 'Disinibizione' | 'Psicoticismo';
  facet: string;
  reversed?: boolean;
}

export interface PID5TestData {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  questions: PID5Question[];
  domains: string[];
  scaleLikert: string[];
}

export const PID5_SCALE = [
  "Mai o Molto Raramente Vero",
  "Qualche Volta o Poche Volte Vero", 
  "Spesso Vero",
  "Sempre o Molto Spesso Vero"
];

// Versione breve del PID-5 con domande rappresentative per ogni dominio
export const PID5_TEST_DATA: PID5TestData = {
  id: 1,
  title: "PID-5 - Inventario della Personalità per DSM-5 (Adulti)",
  description: "Strumento di valutazione dei tratti di personalità maladattivi secondo il modello dimensionale del DSM-5",
  duration: 25,
  totalQuestions: 50,
  domains: ['Affettività Negativa', 'Distacco', 'Antagonismo', 'Disinibizione', 'Psicoticismo'],
  scaleLikert: PID5_SCALE,
  questions: [
    // AFFETTIVITÀ NEGATIVA
    {
      id: 1,
      text: "Spesso mi sento senza speranza.",
      domain: "Affettività Negativa",
      facet: "Depressività"
    },
    {
      id: 2,
      text: "Mi sento ansioso/a la maggior parte del tempo.",
      domain: "Affettività Negativa", 
      facet: "Ansia"
    },
    {
      id: 3,
      text: "Mi arrabbio facilmente.",
      domain: "Affettività Negativa",
      facet: "Ostilità"
    },
    {
      id: 4,
      text: "Ho molte paure che sembrano irragionevoli alla maggior parte delle persone.",
      domain: "Affettività Negativa",
      facet: "Ansia"
    },
    {
      id: 5,
      text: "Le mie emozioni cambiano molto e rapidamente.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva"
    },
    {
      id: 6,
      text: "Mi sento inutile.",
      domain: "Affettività Negativa",
      facet: "Depressività"
    },
    {
      id: 7,
      text: "Sono una persona molto sensibile al rifiuto o alle critiche.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione"
    },
    {
      id: 8,
      text: "Provo spesso vergogna.",
      domain: "Affettività Negativa",
      facet: "Depressività"
    },
    {
      id: 9,
      text: "Mi preoccupo per quasi tutto.",
      domain: "Affettività Negativa",
      facet: "Ansia"
    },
    {
      id: 10,
      text: "Mi sento sempre teso/a.",
      domain: "Affettività Negativa",
      facet: "Ansia"
    },

    // DISTACCO
    {
      id: 11,
      text: "Non traggo così tanto piacere dalle cose come gli altri sembrano trarne.",
      domain: "Distacco",
      facet: "Anedonia"
    },
    {
      id: 12,
      text: "Preferisco stare da solo/a piuttosto che con gli altri.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità"
    },
    {
      id: 13,
      text: "Sono una persona riservata.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità"
    },
    {
      id: 14,
      text: "Non provo emozioni molto forti.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva"
    },
    {
      id: 15,
      text: "Raramente sono entusiasta di qualcosa.",
      domain: "Distacco",
      facet: "Anedonia"
    },
    {
      id: 16,
      text: "Non ho interesse nel fare amicizie.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità"
    },
    {
      id: 17,
      text: "Non mi piace passare del tempo con gli altri.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità"
    },
    {
      id: 18,
      text: "Sono una persona emotivamente fredda.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva"
    },
    {
      id: 19,
      text: "Raramente esprimo le mie vere emozioni.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva"
    },
    {
      id: 20,
      text: "Tendo a non avere obiettivi a lungo termine.",
      domain: "Distacco",
      facet: "Anedonia"
    },

    // ANTAGONISMO
    {
      id: 21,
      text: "Uso le persone per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Manipolazione"
    },
    {
      id: 22,
      text: "Non esito a trarre vantaggio dagli altri.",
      domain: "Antagonismo",
      facet: "Inganno"
    },
    {
      id: 23,
      text: "Mento per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Inganno"
    },
    {
      id: 24,
      text: "Mi merito di più di quello che ho.",
      domain: "Antagonismo",
      facet: "Grandiosità"
    },
    {
      id: 25,
      text: "Non mi dispiace se qualcuno viene ferito, purché io ottenga quello che voglio.",
      domain: "Antagonismo",
      facet: "Insensibilità"
    },
    {
      id: 26,
      text: "Posso convincere le persone a fare qualsiasi cosa.",
      domain: "Antagonismo",
      facet: "Manipolazione"
    },
    {
      id: 27,
      text: "Non sono interessato/a ai problemi di altre persone.",
      domain: "Antagonismo",
      facet: "Insensibilità"
    },
    {
      id: 28,
      text: "Non mi importa se offendo le persone.",
      domain: "Antagonismo",
      facet: "Insensibilità"
    },
    {
      id: 29,
      text: "Sono superiore alla maggior parte delle persone.",
      domain: "Antagonismo",
      facet: "Grandiosità"
    },
    {
      id: 30,
      text: "È facile per me trarre vantaggio dagli altri.",
      domain: "Antagonismo",
      facet: "Manipolazione"
    },

    // DISINIBIZIONE
    {
      id: 31,
      text: "Spesso agisco impulsivamente.",
      domain: "Disinibizione",
      facet: "Impulsività"
    },
    {
      id: 32,
      text: "Spesso faccio cose che so che dovrei evitare.",
      domain: "Disinibizione",
      facet: "Impulsività"
    },
    {
      id: 33,
      text: "Altri mi vedono come qualcuno che non è affidabile.",
      domain: "Disinibizione",
      facet: "Irresponsabilità"
    },
    {
      id: 34,
      text: "Tendo a dare priorità al piacere e al divertimento piuttosto che agli obiettivi a lungo termine.",
      domain: "Disinibizione",
      facet: "Impulsività"
    },
    {
      id: 35,
      text: "Non completo le cose che inizio.",
      domain: "Disinibizione",
      facet: "Distraibilità"
    },
    {
      id: 36,
      text: "Tendo a perdere la concentrazione facilmente.",
      domain: "Disinibizione",
      facet: "Distraibilità"
    },
    {
      id: 37,
      text: "Non sono molto affidabile.",
      domain: "Disinibizione",
      facet: "Irresponsabilità"
    },
    {
      id: 38,
      text: "Faccio cose pericolose senza pensarci.",
      domain: "Disinibizione",
      facet: "Impulsività"
    },
    {
      id: 39,
      text: "Le persone si lamentano che non seguo fino in fondo le cose.",
      domain: "Disinibizione",
      facet: "Irresponsabilità"
    },
    {
      id: 40,
      text: "Dimentico spesso gli appuntamenti.",
      domain: "Disinibizione",
      facet: "Distraibilità"
    },

    // PSICOTICISMO
    {
      id: 41,
      text: "Spesso ho pensieri che non hanno senso per gli altri.",
      domain: "Psicoticismo",
      facet: "Ideazione Stravagante"
    },
    {
      id: 42,
      text: "La gente pensa che io sia strano/a o eccentrico/a.",
      domain: "Psicoticismo",
      facet: "Eccentricità"
    },
    {
      id: 43,
      text: "Ho alcune credenze insolite.",
      domain: "Psicoticismo",
      facet: "Ideazione Stravagante"
    },
    {
      id: 44,
      text: "I miei pensieri spesso non si connettono tra loro.",
      domain: "Psicoticismo",
      facet: "Ideazione Stravagante"
    },
    {
      id: 45,
      text: "Dico cose che gli altri trovano strane o bizzarre.",
      domain: "Psicoticismo",
      facet: "Eccentricità"
    },
    {
      id: 46,
      text: "Ho visto cose che altri non possono vedere.",
      domain: "Psicoticismo",
      facet: "Esperienze Percettive Insolite"
    },
    {
      id: 47,
      text: "Le persone spesso non capiscono quello che sto dicendo.",
      domain: "Psicoticismo",
      facet: "Ideazione Stravagante"
    },
    {
      id: 48,
      text: "Ho sentito cose che altre persone non hanno sentito.",
      domain: "Psicoticismo",
      facet: "Esperienze Percettive Insolite"
    },
    {
      id: 49,
      text: "I miei modi di fare le cose sembrano strani agli altri.",
      domain: "Psicoticismo",
      facet: "Eccentricità"
    },
    {
      id: 50,
      text: "Sento che non appartengo veramente a questo mondo.",
      domain: "Psicoticismo",
      facet: "Ideazione Stravagante"
    }
  ]
};
