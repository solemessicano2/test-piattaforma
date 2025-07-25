import type { PID5Item, PID5TestComplete } from "./pid5-complete";

export const PID5_FALLBACK: PID5TestComplete = {
  id: 1,
  title: "PID-5 - Inventario della Personalità per DSM-5 (Versione di Test)",
  description: "Versione di test con domande rappresentative per ogni dominio",
  duration: 10,
  totalQuestions: 25,
  domains: [
    "Affettività Negativa",
    "Distacco",
    "Antagonismo",
    "Disinibizione",
    "Psicoticismo",
  ],
  facets: {},
  scaleLikert: [
    "Mai o Molto Raramente Vero",
    "Qualche Volta o Poche Volte Vero",
    "Spesso Vero",
    "Sempre o Molto Spesso Vero",
  ],
  items: [
    // Affettività Negativa
    {
      id: 1,
      text: "I miei stati d'animo cambiano molto.",
      domain: "Affettività Negativa",
      facet: "Labilità Emotiva",
    },
    {
      id: 2,
      text: "Mi sento ansioso/a la maggior parte del tempo.",
      domain: "Affettività Negativa",
      facet: "Ansia",
    },
    {
      id: 3,
      text: "Ho paura di essere abbandonato/a dalle persone vicine a me.",
      domain: "Affettività Negativa",
      facet: "Ansia da Separazione",
    },
    {
      id: 4,
      text: "Mi arrabbio facilmente.",
      domain: "Affettività Negativa",
      facet: "Ostilità",
    },
    {
      id: 5,
      text: "Spesso mi sento senza speranza.",
      domain: "Affettività Negativa",
      facet: "Depressività",
    },

    // Distacco
    {
      id: 6,
      text: "Preferisco stare da solo/a piuttosto che con gli altri.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },
    {
      id: 7,
      text: "Non traggo così tanto piacere dalle cose come gli altri sembrano trarne.",
      domain: "Distacco",
      facet: "Anedonia",
    },
    {
      id: 8,
      text: "Non provo emozioni molto forti.",
      domain: "Distacco",
      facet: "Ristrettezza Affettiva",
    },
    {
      id: 9,
      text: "Evito le situazioni sociali.",
      domain: "Distacco",
      facet: "Ritiro",
    },
    {
      id: 10,
      text: "Sono una persona riservata.",
      domain: "Distacco",
      facet: "Evitamento dell'Intimità",
    },

    // Antagonismo
    {
      id: 11,
      text: "Uso le persone per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Manipolazione",
    },
    {
      id: 12,
      text: "Mento per ottenere quello che voglio.",
      domain: "Antagonismo",
      facet: "Inganno",
    },
    {
      id: 13,
      text: "Mi merito di più di quello che ho.",
      domain: "Antagonismo",
      facet: "Grandiosità",
    },
    {
      id: 14,
      text: "Non mi dispiace se qualcuno viene ferito, purché io ottenga quello che voglio.",
      domain: "Antagonismo",
      facet: "Insensibilità",
    },
    {
      id: 15,
      text: "Mi piace essere al centro dell'attenzione.",
      domain: "Antagonismo",
      facet: "Ricerca di Attenzione",
    },

    // Disinibizione
    {
      id: 16,
      text: "Spesso agisco impulsivamente.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },
    {
      id: 17,
      text: "Altri mi vedono come qualcuno che non è affidabile.",
      domain: "Disinibizione",
      facet: "Irresponsabilità",
    },
    {
      id: 18,
      text: "Tendo a perdere la concentrazione facilmente.",
      domain: "Disinibizione",
      facet: "Distraibilità",
    },
    {
      id: 19,
      text: "Prendo rischi spesso.",
      domain: "Disinibizione",
      facet: "Assunzione di Rischi",
    },
    {
      id: 20,
      text: "Faccio cose pericolose senza pensarci.",
      domain: "Disinibizione",
      facet: "Impulsività",
    },

    // Psicoticismo
    {
      id: 21,
      text: "Spesso ho pensieri che non hanno senso per gli altri.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 22,
      text: "La gente pensa che io sia strano/a o eccentrico/a.",
      domain: "Psicoticismo",
      facet: "Eccentricità",
    },
    {
      id: 23,
      text: "I miei pensieri spesso non si connettono tra loro.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
    {
      id: 24,
      text: "Ho visto cose che altri non possono vedere.",
      domain: "Psicoticismo",
      facet: "Credenze e Esperienze Insolite",
    },
    {
      id: 25,
      text: "Le persone spesso non capiscono quello che sto dicendo.",
      domain: "Psicoticismo",
      facet: "Disregolazione Cognitiva e Percettiva",
    },
  ],
};
