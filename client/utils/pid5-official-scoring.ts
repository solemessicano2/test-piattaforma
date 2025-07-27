import { PID5_COMPLETE } from "@/data/pid5-complete";

export interface PID5FacetScore {
  facet: string;
  rawScore: number;
  meanScore: number;
  numItems: number;
  interpretation: string;
}

export interface PID5DomainScore {
  domain: string;
  facets: PID5FacetScore[];
  meanScore: number;
  interpretation: string;
}

export interface PID5OfficialProfile {
  facetScores: PID5FacetScore[];
  domainScores: PID5DomainScore[];
  overallSeverity: string;
  clinicalNotes: string[];
  recommendations: string[];
}

// Item da invertire secondo le specifiche DSM-5
const REVERSED_ITEMS = [
  7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215,
];

// Definizione delle faccette con i loro item secondo DSM-5
const FACET_ITEMS = {
  "Affettività ridotta": [8, 45, 84, 91, 101, 167, 184],
  Anedonia: [1, 23, 26, 30, 124, 155, 157, 189], // 30R, 155R
  "Angoscia di separazione": [12, 50, 57, 64, 127, 149, 175],
  Ansia: [79, 93, 95, 96, 109, 110, 130, 141, 174], // 96R
  "Convinzioni ed esperienze inusuali": [94, 99, 106, 139, 143, 150, 194, 209],
  Depressività: [
    27, 61, 66, 81, 86, 104, 119, 148, 151, 163, 168, 169, 178, 212,
  ],
  "Disregolazione percettiva": [
    36, 37, 42, 44, 59, 77, 83, 154, 192, 193, 213, 217,
  ],
  Distraibilità: [6, 29, 47, 68, 88, 118, 132, 144, 199],
  Eccentricità: [5, 21, 24, 25, 33, 52, 55, 70, 71, 152, 172, 185, 205],
  "Evitamento dell'intimità": [89, 97, 108, 120, 145, 203], // 97R
  Grandiosità: [40, 65, 114, 179, 187, 197],
  Impulsività: [4, 16, 17, 22, 58, 204], // 58R
  Inganno: [41, 53, 56, 76, 126, 134, 142, 206, 214, 218], // 142R
  Insensibilità: [
    11, 13, 19, 54, 72, 73, 90, 153, 166, 183, 198, 200, 207, 208,
  ], // 90R
  Irresponsabilità: [31, 129, 156, 160, 171, 201, 210], // 210R
  "Labilità emotiva": [18, 62, 102, 122, 138, 165, 181],
  Manipolatorietà: [107, 125, 162, 180, 219],
  Ostilità: [28, 32, 38, 85, 92, 116, 158, 170, 188, 216],
  "Perfezionismo rigido": [34, 49, 105, 115, 123, 135, 140, 176, 196, 220],
  Perseverazione: [46, 51, 60, 78, 80, 100, 121, 128, 137],
  "Ricerca di attenzione": [14, 43, 74, 111, 113, 173, 191, 211],
  Ritiro: [10, 20, 75, 82, 136, 146, 147, 161, 182, 186],
  Sospettosità: [2, 103, 117, 131, 133, 177, 190], // 131R, 177R
  Sottomissione: [9, 15, 63, 202],
  "Tendenza a correre rischi": [
    3, 7, 35, 39, 48, 67, 69, 87, 98, 112, 159, 164, 195, 215,
  ], // 7R, 35R, 87R, 98R, 164R, 215R
};

// Definizione dei domini con le loro faccette principali secondo DSM-5
const DOMAIN_FACETS = {
  "Affettività negativa": [
    "Labilità emotiva",
    "Ansia",
    "Angoscia di separazione",
  ],
  Distacco: ["Ritiro", "Anedonia", "Evitamento dell'intimità"],
  Antagonismo: ["Manipolatorietà", "Inganno", "Grandiosità"],
  Disinibizione: ["Irresponsabilità", "Impulsività", "Distraibilità"],
  Psicoticismo: [
    "Convinzioni ed esperienze inusuali",
    "Eccentricità",
    "Disregolazione percettiva",
  ],
};

function isReversedItem(itemId: number): boolean {
  return REVERSED_ITEMS.includes(itemId);
}

function reverseScore(score: number): number {
  return 3 - score;
}

function getScoreInterpretation(meanScore: number): string {
  if (meanScore >= 2.5) return "Molto Elevato";
  if (meanScore >= 2.0) return "Elevato";
  if (meanScore >= 1.5) return "Moderatamente Elevato";
  if (meanScore >= 1.0) return "Medio";
  if (meanScore >= 0.5) return "Basso";
  return "Molto Basso";
}

function getDomainInterpretation(meanScore: number, domain: string): string {
  const level = getScoreInterpretation(meanScore);

  const interpretations = {
    "Affettività negativa": {
      "Molto Elevato":
        "Significative difficoltà nella regolazione emotiva con intensa instabilità affettiva",
      Elevato:
        "Marcata tendenza a sperimentare emozioni negative intense e frequenti",
      "Moderatamente Elevato":
        "Tendenza elevata a provare ansia, depressione e irritabilità",
      Medio:
        "Livello normale di reattività emotiva con occasionali emozioni negative",
      Basso:
        "Buona stabilità emotiva con rara esperienza di emozioni negative intense",
      "Molto Basso":
        "Eccellente regolazione emotiva e notevole resilienza allo stress",
    },
    Distacco: {
      "Molto Elevato":
        "Marcato evitamento delle relazioni e significativa limitazione emotiva",
      Elevato:
        "Tendenza al ritiro sociale e difficoltà significative nell'intimità",
      "Moderatamente Elevato":
        "Preferenza per l'isolamento e limitata espressione emotiva",
      Medio: "Equilibrio normale tra socializzazione e bisogno di solitudine",
      Basso: "Buona capacità di coinvolgimento sociale ed espressione emotiva",
      "Molto Basso":
        "Forte orientamento sociale e ricchezza espressiva emotiva",
    },
    Antagonismo: {
      "Molto Elevato":
        "Grave compromissione nelle relazioni interpersonali e comportamenti antisociali",
      Elevato: "Marcata tendenza a manipolazione, sfruttamento e insensibilità",
      "Moderatamente Elevato":
        "Significative difficoltà nell'empatia e comportamenti problematici",
      Medio: "Livello normale di considerazione per gli altri",
      Basso: "Buona capacità empatica e comportamento cooperativo",
      "Molto Basso": "Eccellenti qualità prosociali e forte senso di giustizia",
    },
    Disinibizione: {
      "Molto Elevato":
        "Grave impulsività con significativi problemi di controllo comportamentale",
      Elevato:
        "Marcata tendenza all'impulsività e difficoltà nella pianificazione",
      "Moderatamente Elevato":
        "Problemi nel controllo degli impulsi e comportamenti rischiosi",
      Medio: "Equilibrio appropriato tra spontaneità e controllo",
      Basso: "Buon controllo degli impulsi e capacità di pianificazione",
      "Molto Basso": "Eccellente autocontrollo e abilità organizzative",
    },
    Psicoticismo: {
      "Molto Elevato":
        "Significative alterazioni del pensiero e percezioni marcatamente insolite",
      Elevato: "Tendenza a pensieri eccentrici e comportamenti bizzarri",
      "Moderatamente Elevato": "Alcuni pensieri o comportamenti insoliti",
      Medio: "Pensiero e comportamento nella norma",
      Basso: "Pensiero molto organizzato e comportamento convenzionale",
      "Molto Basso":
        "Pensiero estremamente logico e percezione della realtà molto accurata",
    },
  };

  return (
    interpretations[domain as keyof typeof interpretations]?.[
      level as keyof (typeof interpretations)["Affettività negativa"]
    ] || `Livello ${level}`
  );
}

export function processOfficialPID5Results(
  answers: Record<number, string>,
): PID5OfficialProfile {
  // Calcola i punteggi delle faccette
  const facetScores: PID5FacetScore[] = Object.entries(FACET_ITEMS).map(
    ([facetName, itemIds]) => {
      let rawScore = 0;
      let validItems = 0;

      itemIds.forEach((itemId) => {
        const answer = answers[itemId];
        if (answer !== undefined) {
          let score = parseInt(answer);

          // Applica l'inversione se necessario
          if (isReversedItem(itemId)) {
            score = reverseScore(score);
          }

          rawScore += score;
          validItems++;
        }
      });

      // Calcola il punteggio equivalente se mancano delle risposte (≤25%)
      const totalItems = itemIds.length;
      const missingPercentage = ((totalItems - validItems) / totalItems) * 100;

      if (missingPercentage > 25) {
        // Troppi item mancanti - non calcolare il punteggio
        return {
          facet: facetName,
          rawScore: 0,
          meanScore: 0,
          numItems: totalItems,
          interpretation: "Non calcolabile (troppe risposte mancanti)",
        };
      }

      // Calcola il punteggio equivalente se necessario
      if (validItems < totalItems && validItems > 0) {
        rawScore = Math.round((rawScore * totalItems) / validItems);
      }

      const meanScore = validItems > 0 ? rawScore / totalItems : 0;

      return {
        facet: facetName,
        rawScore,
        meanScore,
        numItems: totalItems,
        interpretation: getScoreInterpretation(meanScore),
      };
    },
  );

  // Calcola i punteggi dei domini
  const domainScores: PID5DomainScore[] = Object.entries(DOMAIN_FACETS).map(
    ([domainName, facetNames]) => {
      const domainFacets = facetNames
        .map((facetName) => facetScores.find((f) => f.facet === facetName))
        .filter(Boolean) as PID5FacetScore[];

      // Verifica che tutte le faccette siano calcolabili
      const validFacets = domainFacets.filter(
        (f) =>
          f.interpretation !== "Non calcolabile (troppe risposte mancanti)",
      );

      if (validFacets.length < 3) {
        return {
          domain: domainName,
          facets: domainFacets,
          meanScore: 0,
          interpretation: "Non calcolabile (faccette principali incomplete)",
        };
      }

      // Calcola la media delle tre faccette principali
      const meanScore =
        validFacets.reduce((sum, facet) => sum + facet.meanScore, 0) /
        validFacets.length;

      return {
        domain: domainName,
        facets: domainFacets,
        meanScore,
        interpretation: getDomainInterpretation(meanScore, domainName),
      };
    },
  );

  // Calcola la severità complessiva
  const validDomains = domainScores.filter(
    (d) =>
      d.interpretation !== "Non calcolabile (faccette principali incomplete)",
  );
  const overallMean =
    validDomains.length > 0
      ? validDomains.reduce((sum, domain) => sum + domain.meanScore, 0) /
        validDomains.length
      : 0;

  const overallSeverity = getScoreInterpretation(overallMean);

  // Genera note cliniche
  const clinicalNotes = generateClinicalNotes(domainScores, overallMean);

  // Genera raccomandazioni
  const recommendations = generateRecommendations(domainScores, overallMean);

  return {
    facetScores,
    domainScores,
    overallSeverity,
    clinicalNotes,
    recommendations,
  };
}

function generateClinicalNotes(
  domainScores: PID5DomainScore[],
  overallMean: number,
): string[] {
  const notes = [];

  if (overallMean < 1.0) {
    notes.push(
      "Il profilo generale risulta entro i parametri normativi. Non emergono significative problematiche di personalità.",
    );
  } else {
    const elevatedDomains = domainScores.filter((d) => d.meanScore >= 2.0);

    if (elevatedDomains.length > 0) {
      notes.push(
        `Emergono elevazioni significative in ${elevatedDomains.length} dominio/i di personalità.`,
      );

      elevatedDomains.forEach((domain) => {
        switch (domain.domain) {
          case "Affettività negativa":
            notes.push(
              "Significative difficoltà nella regolazione emotiva. Possibile vulnerabilità ai disturbi dell'umore e dell'ansia.",
            );
            break;
          case "Distacco":
            notes.push(
              "Marcato ritiro interpersonale. Possibili difficoltà nell'instaurazione e mantenimento delle relazioni.",
            );
            break;
          case "Antagonismo":
            notes.push(
              "Problematiche significative nelle relazioni interpersonali caratterizzate da manipolazione e insensibilità.",
            );
            break;
          case "Disinibizione":
            notes.push(
              "Problemi significativi di controllo degli impulsi con possibili comportamenti autolesivi o etero-aggressivi.",
            );
            break;
          case "Psicoticismo":
            notes.push(
              "Presenza di pensieri e comportamenti eccentrici. Necessaria valutazione per escludere condizioni psicotiche.",
            );
            break;
        }
      });
    }
  }

  // Note sui punteggi medi
  notes.push(
    `Punteggio medio complessivo: ${overallMean.toFixed(2)} (Livello: ${getScoreInterpretation(overallMean)})`,
  );

  return notes;
}

function generateRecommendations(
  domainScores: PID5DomainScore[],
  overallMean: number,
): string[] {
  const recommendations = [];

  if (overallMean < 1.0) {
    recommendations.push(
      "Mantenere strategie di coping efficaci e stile di vita equilibrato.",
    );
    recommendations.push(
      "Considerare programmi di prevenzione e promozione del benessere psicologico.",
    );
  } else {
    recommendations.push(
      "Valutazione clinica approfondita con specialista in disturbi di personalità.",
    );

    const elevatedDomains = domainScores.filter((d) => d.meanScore >= 2.0);

    elevatedDomains.forEach((domain) => {
      switch (domain.domain) {
        case "Affettività negativa":
          recommendations.push(
            "Interventi di regolazione emotiva (DBT, mindfulness, terapia cognitivo-comportamentale).",
          );
          break;
        case "Distacco":
          recommendations.push(
            "Terapia interpersonale o di gruppo per migliorare le competenze sociali e relazionali.",
          );
          break;
        case "Antagonismo":
          recommendations.push(
            "Terapia focalizzata su empatia, mentalizzazione e sviluppo delle competenze interpersonali.",
          );
          break;
        case "Disinibizione":
          recommendations.push(
            "Interventi per il controllo degli impulsi e training di pianificazione comportamentale.",
          );
          break;
        case "Psicoticismo":
          recommendations.push(
            "Valutazione neuropsicologica e psichiatrica specialistica. Monitoraggio per sintomi psicotici.",
          );
          break;
      }
    });

    if (overallMean >= 2.5) {
      recommendations.push(
        "Considerare la necessità di trattamento intensivo o follow-up frequente.",
      );
      recommendations.push(
        "Valutazione multidisciplinare e possibile coordinamento con servizi specialistici.",
      );
    }
  }

  return recommendations;
}
