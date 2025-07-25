import { PID5_TEST_DATA } from "@/data/pid5-test";

export interface PID5Results {
  domain: string;
  score: number;
  maxScore: number;
  percentage: number;
  tScore: number;
  level: "Molto Basso" | "Basso" | "Medio" | "Elevato" | "Molto Elevato";
  interpretation: string;
  clinicalSignificance: boolean;
}

export interface PID5Profile {
  overallRisk: "Basso" | "Moderato" | "Elevato" | "Molto Elevato";
  primaryDomains: string[];
  results: PID5Results[];
  clinicalNotes: string[];
  recommendations: string[];
}

// T-Score norms (simulate clinical norms)
const T_SCORE_NORMS = {
  "Affettività Negativa": { mean: 50, sd: 10 },
  Distacco: { mean: 50, sd: 10 },
  Antagonismo: { mean: 50, sd: 10 },
  Disinibizione: { mean: 50, sd: 10 },
  Psicoticismo: { mean: 50, sd: 10 },
};

function calculateTScore(rawScore: number, domain: string): number {
  const norms = T_SCORE_NORMS[domain as keyof typeof T_SCORE_NORMS];
  if (!norms) return 50;

  // Simulate T-score calculation (in real implementation, use actual norms)
  const zScore = (rawScore - norms.mean * 0.3) / (norms.sd * 0.3);
  return Math.round(50 + zScore * 10);
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

function getInterpretation(domain: string, level: string): string {
  const interpretations = {
    "Affettività Negativa": {
      "Molto Elevato":
        "Tendenza molto marcata a sperimentare emozioni negative intense e frequenti",
      Elevato:
        "Tendenza elevata a provare ansia, depressione, irritabilità e instabilità emotiva",
      Medio:
        "Livello normale di reattività emotiva e gestione delle emozioni negative",
      Basso:
        "Buona stabilità emotiva con rara esperienza di emozioni negative intense",
      "Molto Basso": "Eccellente regolazione emotiva e resilienza allo stress",
    },
    Distacco: {
      "Molto Elevato":
        "Marcato evitamento delle relazioni sociali e limitata espressione emotiva",
      Elevato:
        "Tendenza al ritiro sociale e difficoltà nell'intimità relazionale",
      Medio: "Equilibrio normale tra socializzazione e bisogno di solitudine",
      Basso: "Buona capacità di coinvolgimento sociale ed espressione emotiva",
      "Molto Basso":
        "Forte orientamento sociale e facilità nelle relazioni interpersonali",
    },
    Antagonismo: {
      "Molto Elevato":
        "Marcata tendenza a manipolazione, insensibilità e comportamenti antisociali",
      Elevato:
        "Significative difficoltà nell'empatia e tendenza a sfruttare gli altri",
      Medio:
        "Livello normale di considerazione per gli altri e comportamento prosociale",
      Basso: "Buona capacità empatica e comportamento cooperativo",
      "Molto Basso": "Eccellenti qualità prosociali e forte senso di giustizia",
    },
    Disinibizione: {
      "Molto Elevato":
        "Grave impulsività e difficoltà significative nel controllo comportamentale",
      Elevato:
        "Marcata tendenza all'impulsività e difficoltà nella pianificazione",
      Medio: "Equilibrio normale tra spontaneità e controllo degli impulsi",
      Basso: "Buon controllo degli impulsi e capacità di pianificazione",
      "Molto Basso": "Eccellente autocontrollo e abilità organizzative",
    },
    Psicoticismo: {
      "Molto Elevato":
        "Significative alterazioni del pensiero e percezioni insolite",
      Elevato: "Tendenza a pensieri eccentrici e comportamenti bizzarri",
      Medio: "Pensiero e comportamento nella norma",
      Basso: "Pensiero molto organizzato e comportamento convenzionale",
      "Molto Basso":
        "Pensiero estremamente logico e comportamento molto strutturato",
    },
  };

  return (
    interpretations[domain as keyof typeof interpretations]?.[
      level as keyof (typeof interpretations)["Affettività Negativa"]
    ] || "Interpretazione non disponibile"
  );
}

export function processPID5Results(
  answers: Record<number, string>,
): PID5Profile {
  const domainScores: Record<string, number[]> = {
    "Affettività Negativa": [],
    Distacco: [],
    Antagonismo: [],
    Disinibizione: [],
    Psicoticismo: [],
  };

  // Calculate raw scores for each domain
  PID5_TEST_DATA.questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      const score = parseInt(answer);
      domainScores[question.domain].push(score);
    }
  });

  // Process results for each domain
  const results: PID5Results[] = Object.entries(domainScores).map(
    ([domain, scores]) => {
      const rawScore = scores.reduce((sum, score) => sum + score, 0);
      const maxScore = scores.length * 3; // Max is 3 for 4-point scale (0-3)
      const percentage = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;
      const tScore = calculateTScore(rawScore, domain);
      const level = getTScoreLevel(tScore);
      const interpretation = getInterpretation(domain, level);
      const clinicalSignificance = tScore >= 65;

      return {
        domain,
        score: rawScore,
        maxScore,
        percentage,
        tScore,
        level,
        interpretation,
        clinicalSignificance,
      };
    },
  );

  // Determine overall risk level
  const elevatedDomains = results.filter((r) => r.tScore >= 65);
  const veryElevatedDomains = results.filter((r) => r.tScore >= 75);

  let overallRisk: "Basso" | "Moderato" | "Elevato" | "Molto Elevato";
  if (veryElevatedDomains.length >= 2) {
    overallRisk = "Molto Elevato";
  } else if (elevatedDomains.length >= 3 || veryElevatedDomains.length >= 1) {
    overallRisk = "Elevato";
  } else if (elevatedDomains.length >= 1) {
    overallRisk = "Moderato";
  } else {
    overallRisk = "Basso";
  }

  // Identify primary domains (T-score >= 65)
  const primaryDomains = results
    .filter((r) => r.tScore >= 65)
    .map((r) => r.domain);

  // Generate clinical notes
  const clinicalNotes = [];
  if (elevatedDomains.length === 0) {
    clinicalNotes.push(
      "Profilo entro i limiti normativi. Non emergono significative problematiche di personalità.",
    );
  } else {
    clinicalNotes.push(
      `Emergono elevazioni clinicamente significative in ${elevatedDomains.length} dominio/i.`,
    );
    if (primaryDomains.includes("Affettività Negativa")) {
      clinicalNotes.push(
        "Possibili difficoltà nella regolazione emotiva e vulnerabilità ai disturbi dell'umore.",
      );
    }
    if (primaryDomains.includes("Antagonismo")) {
      clinicalNotes.push(
        "Potrebbero essere presenti difficoltà nelle relazioni interpersonali.",
      );
    }
    if (primaryDomains.includes("Disinibizione")) {
      clinicalNotes.push(
        "Possibili problemi di controllo degli impulsi e comportamenti a rischio.",
      );
    }
  }

  // Generate recommendations
  const recommendations = [];
  if (overallRisk === "Basso") {
    recommendations.push(
      "Continuare a mantenere strategie di coping efficaci e stile di vita equilibrato.",
    );
    recommendations.push(
      "Considerare programmi di prevenzione e mantenimento del benessere psicologico.",
    );
  } else {
    recommendations.push(
      "Si raccomanda valutazione clinica approfondita con uno psicologo o psichiatra.",
    );
    if (primaryDomains.includes("Affettività Negativa")) {
      recommendations.push(
        "Interventi focalizzati sulla regolazione emotiva (es. DBT, mindfulness).",
      );
    }
    if (primaryDomains.includes("Antagonismo")) {
      recommendations.push(
        "Terapia focalizzata sulle competenze interpersonali e sviluppo dell'empatia.",
      );
    }
    if (primaryDomains.includes("Disinibizione")) {
      recommendations.push(
        "Interventi per il controllo degli impulsi e la pianificazione comportamentale.",
      );
    }
    if (primaryDomains.includes("Psicoticismo")) {
      recommendations.push(
        "Valutazione specialistica per escludere condizioni psicotiche o spettro autistico.",
      );
    }
  }

  return {
    overallRisk,
    primaryDomains,
    results,
    clinicalNotes,
    recommendations,
  };
}
