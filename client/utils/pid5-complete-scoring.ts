import { PID5_COMPLETE, PID5_FACETS } from "@/data/pid5-complete";

export interface PID5FacetResult {
  facet: string;
  score: number;
  maxScore: number;
  tScore: number;
  level: "Molto Basso" | "Basso" | "Medio" | "Elevato" | "Molto Elevato";
  clinicalSignificance: boolean;
}

export interface PID5DomainResult {
  domain: string;
  score: number;
  maxScore: number;
  tScore: number;
  level: "Molto Basso" | "Basso" | "Medio" | "Elevato" | "Molto Elevato";
  interpretation: string;
  clinicalSignificance: boolean;
  facets: PID5FacetResult[];
}

export interface PID5CompleteProfile {
  overallRisk: "Basso" | "Moderato" | "Elevato" | "Molto Elevato";
  globalSeverity: number;
  primaryDomains: string[];
  elevatedFacets: string[];
  domainResults: PID5DomainResult[];
  clinicalNotes: string[];
  recommendations: string[];
  diagnosticConsiderations: string[];
}

// Norme T-Score simulate basate sui dati normativi del PID-5
const DOMAIN_NORMS = {
  "Affettività Negativa": { mean: 1.2, sd: 0.8 },
  Distacco: { mean: 0.9, sd: 0.7 },
  Antagonismo: { mean: 0.6, sd: 0.6 },
  Disinibizione: { mean: 1.0, sd: 0.7 },
  Psicoticismo: { mean: 0.5, sd: 0.6 },
};

const FACET_NORMS: Record<string, { mean: number; sd: number }> = {
  // Affettività Negativa
  "Labilità Emotiva": { mean: 1.1, sd: 0.9 },
  Ansia: { mean: 1.3, sd: 0.8 },
  "Ansia da Separazione": { mean: 1.0, sd: 0.8 },
  Sottomissione: { mean: 1.2, sd: 0.7 },
  Ostilità: { mean: 1.0, sd: 0.8 },
  Perseverazione: { mean: 1.4, sd: 0.8 },
  Depressività: { mean: 1.1, sd: 0.9 },
  Sospettosità: { mean: 1.0, sd: 0.7 },

  // Distacco
  "Evitamento dell'Intimità": { mean: 0.8, sd: 0.8 },
  Anedonia: { mean: 0.9, sd: 0.8 },
  "Ristrettezza Affettiva": { mean: 0.7, sd: 0.7 },
  Ritiro: { mean: 1.0, sd: 0.9 },

  // Antagonismo
  Manipolazione: { mean: 0.5, sd: 0.6 },
  Inganno: { mean: 0.6, sd: 0.7 },
  Grandiosità: { mean: 0.8, sd: 0.7 },
  "Ricerca di Attenzione": { mean: 0.9, sd: 0.8 },
  Insensibilità: { mean: 0.4, sd: 0.6 },

  // Disinibizione
  Irresponsabilità: { mean: 0.8, sd: 0.7 },
  Impulsività: { mean: 1.1, sd: 0.8 },
  Distraibilità: { mean: 1.2, sd: 0.8 },
  "Assunzione di Rischi": { mean: 0.9, sd: 0.8 },
  "Perfezionismo Rigido": { mean: 1.0, sd: 0.8 },

  // Psicoticismo
  "Credenze e Esperienze Insolite": { mean: 0.4, sd: 0.6 },
  Eccentricità: { mean: 0.6, sd: 0.7 },
  "Disregolazione Cognitiva e Percettiva": { mean: 0.8, sd: 0.7 },
};

function calculateTScore(
  meanScore: number,
  normMean: number,
  normSD: number,
): number {
  const zScore = (meanScore - normMean) / normSD;
  return Math.max(30, Math.min(90, Math.round(50 + zScore * 10)));
}

function getTScoreLevel(
  tScore: number,
): "Molto Basso" | "Basso" | "Medio" | "Elevato" | "Molto Elevato" {
  if (tScore >= 75) return "Molto Elevato";
  if (tScore >= 65) return "Elevato";
  if (tScore >= 45) return "Medio";
  if (tScore >= 35) return "Basso";
  return "Molto Basso";
}

function getDomainInterpretation(domain: string, level: string): string {
  const interpretations = {
    "Affettività Negativa": {
      "Molto Elevato":
        "Tendenza molto marcata a sperimentare emozioni negative intense, frequenti e problematiche. Significative difficoltà nella regolazione emotiva.",
      Elevato:
        "Tendenza elevata a provare ansia, depressione, irritabilità e instabilità emotiva. Possibili difficoltà nel controllo delle reazioni emotive.",
      Medio:
        "Livello normale di reattività emotiva con occasionali episodi di emozioni negative gestibili.",
      Basso:
        "Buona stabilità emotiva con rara esperienza di emozioni negative intense. Buona capacità di regolazione.",
      "Molto Basso":
        "Eccellente regolazione emotiva e notevole resilienza allo stress e alle avversità.",
    },
    Distacco: {
      "Molto Elevato":
        "Marcato evitamento delle relazioni sociali, limitata espressione emotiva e significativo ritiro interpersonale.",
      Elevato:
        "Tendenza al ritiro sociale, difficoltà nell'intimità relazionale e limitata gamma di esperienze emotive.",
      Medio:
        "Equilibrio appropriato tra socializzazione e bisogno di solitudine, con normale coinvolgimento interpersonale.",
      Basso:
        "Buona capacità di coinvolgimento sociale, espressione emotiva adeguata e facilità nelle relazioni.",
      "Molto Basso":
        "Forte orientamento sociale, ricchezza espressiva emotiva e notevole facilità nelle relazioni interpersonali.",
    },
    Antagonismo: {
      "Molto Elevato":
        "Marcata tendenza a manipolazione, sfruttamento, insensibilità e comportamenti interpersonali problematici.",
      Elevato:
        "Significative difficoltà nell'empatia, tendenza a sfruttare gli altri e comportamenti interpersonali disfunzionali.",
      Medio:
        "Livello normale di considerazione per gli altri con appropriato comportamento prosociale.",
      Basso:
        "Buona capacità empatica, comportamento cooperativo e rispetto per i diritti altrui.",
      "Molto Basso":
        "Eccellenti qualità prosociali, forte senso di giustizia e notevole capacità empatica.",
    },
    Disinibizione: {
      "Molto Elevato":
        "Grave impulsività, significative difficoltà nel controllo comportamentale e problemi nella pianificazione.",
      Elevato:
        "Marcata tendenza all'impulsività, difficoltà nella pianificazione e controllo degli impulsi problematico.",
      Medio:
        "Equilibrio appropriato tra spontaneità e controllo degli impulsi con adeguata capacità di pianificazione.",
      Basso:
        "Buon controllo degli impulsi, capacità di pianificazione e comportamento responsabile.",
      "Molto Basso":
        "Eccellente autocontrollo, ottime abilità organizzative e pianificazione molto efficace.",
    },
    Psicoticismo: {
      "Molto Elevato":
        "Significative alterazioni del pensiero, percezioni insolite e comportamenti marcatamente eccentrici.",
      Elevato:
        "Tendenza a pensieri eccentrici, comportamenti bizzarri e possibili alterazioni percettive.",
      Medio:
        "Pensiero e comportamento nella norma con occasionali idee creative o non convenzionali.",
      Basso:
        "Pensiero molto organizzato, comportamento convenzionale e percezione della realtà accurata.",
      "Molto Basso":
        "Pensiero estremamente logico, comportamento molto strutturato e percezione della realtà molto precisa.",
    },
  };

  return (
    interpretations[domain as keyof typeof interpretations]?.[
      level as keyof (typeof interpretations)["Affettività Negativa"]
    ] || "Interpretazione non disponibile"
  );
}

export function processPID5CompleteResults(
  answers: Record<number, string>,
): PID5CompleteProfile {
  // Raggruppa le risposte per dominio e faccetta
  const domainScores: Record<string, number[]> = {};
  const facetScores: Record<string, Record<string, number[]>> = {};

  // Inizializza le strutture dati
  Object.keys(PID5_FACETS).forEach((domain) => {
    domainScores[domain] = [];
    facetScores[domain] = {};
    PID5_FACETS[domain as keyof typeof PID5_FACETS].forEach((facet) => {
      facetScores[domain][facet] = [];
    });
  });

  // Calcola i punteggi per ogni item
  PID5_COMPLETE.items.forEach((item) => {
    const answer = answers[item.id];
    if (answer !== undefined) {
      let score = parseInt(answer);

      // Gestisci gli item reversed
      if (item.reversed) {
        score = 3 - score;
      }

      domainScores[item.domain].push(score);
      facetScores[item.domain][item.facet].push(score);
    }
  });

  // Calcola i risultati per faccette e domini
  const domainResults: PID5DomainResult[] = Object.entries(domainScores).map(
    ([domain, scores]) => {
      // Calcola risultati per le faccette di questo dominio
      const facetResults: PID5FacetResult[] = Object.entries(
        facetScores[domain],
      ).map(([facet, facetScores]) => {
        const facetScore = facetScores.reduce((sum, s) => sum + s, 0);
        const facetMaxScore = facetScores.length * 3;
        const facetMeanScore =
          facetScores.length > 0 ? facetScore / facetScores.length : 0;

        const norms = FACET_NORMS[facet] || { mean: 1.0, sd: 0.7 };
        const facetTScore = calculateTScore(
          facetMeanScore,
          norms.mean,
          norms.sd,
        );
        const facetLevel = getTScoreLevel(facetTScore);

        return {
          facet,
          score: facetScore,
          maxScore: facetMaxScore,
          tScore: facetTScore,
          level: facetLevel,
          clinicalSignificance: facetTScore >= 65,
        };
      });

      // Calcola risultati per il dominio
      const domainScore = scores.reduce((sum, score) => sum + score, 0);
      const domainMaxScore = scores.length * 3;
      const domainMeanScore =
        scores.length > 0 ? domainScore / scores.length : 0;

      const domainNorms = DOMAIN_NORMS[domain as keyof typeof DOMAIN_NORMS];
      const domainTScore = calculateTScore(
        domainMeanScore,
        domainNorms.mean,
        domainNorms.sd,
      );
      const domainLevel = getTScoreLevel(domainTScore);
      const interpretation = getDomainInterpretation(domain, domainLevel);

      return {
        domain,
        score: domainScore,
        maxScore: domainMaxScore,
        tScore: domainTScore,
        level: domainLevel,
        interpretation,
        clinicalSignificance: domainTScore >= 65,
        facets: facetResults,
      };
    },
  );

  // Calcola il livello di rischio globale
  const elevatedDomains = domainResults.filter((r) => r.tScore >= 65);
  const veryElevatedDomains = domainResults.filter((r) => r.tScore >= 75);
  const elevatedFacets = domainResults.flatMap((d) =>
    d.facets.filter((f) => f.tScore >= 65).map((f) => f.facet),
  );

  let overallRisk: "Basso" | "Moderato" | "Elevato" | "Molto Elevato";
  if (veryElevatedDomains.length >= 2 || elevatedDomains.length >= 4) {
    overallRisk = "Molto Elevato";
  } else if (elevatedDomains.length >= 2 || veryElevatedDomains.length >= 1) {
    overallRisk = "Elevato";
  } else if (elevatedDomains.length >= 1 || elevatedFacets.length >= 3) {
    overallRisk = "Moderato";
  } else {
    overallRisk = "Basso";
  }

  // Calcola severità globale (media T-scores)
  const globalSeverity =
    domainResults.reduce((sum, r) => sum + r.tScore, 0) / domainResults.length;

  // Identifica domini primari
  const primaryDomains = elevatedDomains.map((r) => r.domain);

  // Genera note cliniche specifiche
  const clinicalNotes = generateClinicalNotes(
    domainResults,
    elevatedFacets,
    overallRisk,
  );

  // Genera raccomandazioni
  const recommendations = generateRecommendations(domainResults, overallRisk);

  // Genera considerazioni diagnostiche
  const diagnosticConsiderations =
    generateDiagnosticConsiderations(domainResults);

  return {
    overallRisk,
    globalSeverity,
    primaryDomains,
    elevatedFacets,
    domainResults,
    clinicalNotes,
    recommendations,
    diagnosticConsiderations,
  };
}

function generateClinicalNotes(
  domainResults: PID5DomainResult[],
  elevatedFacets: string[],
  overallRisk: string,
): string[] {
  const notes = [];

  if (overallRisk === "Basso") {
    notes.push(
      "Profilo generale entro i parametri normativi. Non emergono significative problematiche di personalità.",
    );
  } else {
    const elevatedDomains = domainResults.filter((r) => r.clinicalSignificance);
    notes.push(
      `Emergono elevazioni clinicamente significative in ${elevatedDomains.length} dominio/i principali.`,
    );

    if (elevatedFacets.length > 0) {
      notes.push(
        `${elevatedFacets.length} faccette mostrano punteggi clinicamente significativi.`,
      );
    }

    // Note specifiche per dominio
    elevatedDomains.forEach((domain) => {
      switch (domain.domain) {
        case "Affettività Negativa":
          notes.push(
            "Significative difficoltà nella regolazione emotiva. Vulnerabilità ai disturbi dell'umore e dell'ansia.",
          );
          break;
        case "Distacco":
          notes.push(
            "Marcato ritiro interpersonale. Possibili difficoltà nell'instaurazione e mantenimento di relazioni.",
          );
          break;
        case "Antagonismo":
          notes.push(
            "Problematiche nelle relazioni interpersonali caratterizzate da manipolazione e insensibilità.",
          );
          break;
        case "Disinibizione":
          notes.push(
            "Significativi problemi di controllo degli impulsi e comportamenti potenzialmente autolesivi.",
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

  return notes;
}

function generateRecommendations(
  domainResults: PID5DomainResult[],
  overallRisk: string,
): string[] {
  const recommendations = [];

  if (overallRisk === "Basso") {
    recommendations.push(
      "Mantenere strategie di coping efficaci e stile di vita equilibrato.",
    );
    recommendations.push(
      "Considerare programmi di prevenzione e promozione del benessere psicologico.",
    );
  } else {
    recommendations.push(
      "Valutazione clinica approfondita con psicologo/psichiatra specializzato in disturbi di personalità.",
    );

    const elevatedDomains = domainResults.filter((r) => r.clinicalSignificance);

    elevatedDomains.forEach((domain) => {
      switch (domain.domain) {
        case "Affettività Negativa":
          recommendations.push(
            "Terapia dialettico-comportamentale (DBT) o terapia cognitivo-comportamentale per la regolazione emotiva.",
          );
          break;
        case "Distacco":
          recommendations.push(
            "Terapia interpersonale o terapia di gruppo per migliorare le competenze sociali.",
          );
          break;
        case "Antagonismo":
          recommendations.push(
            "Terapia focalizzata su empatia, mentalizzazione e competenze interpersonali.",
          );
          break;
        case "Disinibizione":
          recommendations.push(
            "Interventi per il controllo degli impulsi e la pianificazione comportamentale.",
          );
          break;
        case "Psicoticismo":
          recommendations.push(
            "Valutazione neuropsicologica e psichiatrica specialistica.",
          );
          break;
      }
    });

    if (overallRisk === "Molto Elevato") {
      recommendations.push(
        "Considerare la necessità di trattamento intensivo o residenziale.",
      );
      recommendations.push(
        "Valutazione del rischio e implementazione di misure di sicurezza appropriate.",
      );
    }
  }

  return recommendations;
}

function generateDiagnosticConsiderations(
  domainResults: PID5DomainResult[],
): string[] {
  const considerations = [];
  const elevatedDomains = domainResults.filter((r) => r.clinicalSignificance);

  if (elevatedDomains.length === 0) {
    considerations.push(
      "Nessuna indicazione per disturbi di personalità secondo i criteri dimensionali del DSM-5.",
    );
    return considerations;
  }

  // Combinazioni diagnostiche comuni
  const domainNames = elevatedDomains.map((d) => d.domain);

  if (
    domainNames.includes("Affettività Negativa") &&
    domainNames.includes("Disinibizione")
  ) {
    considerations.push(
      "Pattern compatibile con Disturbo Borderline di Personalità (Cluster B).",
    );
  }

  if (
    domainNames.includes("Antagonismo") &&
    domainNames.includes("Disinibizione")
  ) {
    considerations.push(
      "Pattern compatibile con Disturbo Antisociale di Personalità (Cluster B).",
    );
  }

  if (
    domainNames.includes("Distacco") &&
    domainNames.includes("Psicoticismo")
  ) {
    considerations.push(
      "Pattern compatibile con Disturbo Schizotipico di Personalità (Cluster A).",
    );
  }

  if (
    domainNames.includes("Affettività Negativa") &&
    domainNames.includes("Distacco")
  ) {
    considerations.push(
      "Pattern compatibile con Disturbo Evitante di Personalità (Cluster C).",
    );
  }

  if (
    domainNames.includes("Antagonismo") &&
    !domainNames.includes("Disinibizione")
  ) {
    considerations.push(
      "Pattern compatibile con Disturbo Narcisistico di Personalità (Cluster B).",
    );
  }

  considerations.push(
    "Necessaria valutazione clinica per diagnosi differenziale e comorbidità.",
  );

  return considerations;
}
