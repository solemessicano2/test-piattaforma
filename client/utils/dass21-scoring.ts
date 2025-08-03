import { dass21Test, dass21Norms, type DASS21Norms } from "@/data/dass21-test";

export interface DASS21SubscaleScore {
  name: string;
  score: number;
  items: number[];
  interpretation: string;
  severity: string;
  percentile?: number;
}

export interface DASS21Profile {
  testInfo: {
    name: string;
    date: string;
    duration: string;
  };
  subscales: {
    depression: DASS21SubscaleScore;
    anxiety: DASS21SubscaleScore;
    stress: DASS21SubscaleScore;
  };
  totalScore: {
    score: number;
    interpretation: string;
    severity: string;
  };
  clinicalNotes: string[];
  recommendations: string[];
}

export class DASS21Scoring {
  private static getDepressionItems(): number[] {
    return [3, 5, 10, 13, 16, 17, 21];
  }

  private static getAnxietyItems(): number[] {
    return [2, 4, 7, 9, 15, 19, 20];
  }

  private static getStressItems(): number[] {
    return [1, 6, 8, 11, 12, 14, 18];
  }

  private static calculateSubscaleScore(
    answers: Record<number, number>,
    items: number[]
  ): number {
    return items.reduce((sum, itemId) => {
      const answer = answers[itemId];
      return sum + (answer || 0);
    }, 0);
  }

  private static getDepressionInterpretation(score: number): { severity: string; interpretation: string } {
    if (score <= 4) return { severity: "Normale", interpretation: "Livelli normali di umore depresso" };
    if (score <= 6) return { severity: "Lieve", interpretation: "Livelli lievi di depressione" };
    if (score <= 10) return { severity: "Moderato", interpretation: "Livelli moderati di depressione" };
    if (score <= 13) return { severity: "Severo", interpretation: "Livelli severi di depressione" };
    return { severity: "Estremamente Severo", interpretation: "Livelli estremamente severi di depressione" };
  }

  private static getAnxietyInterpretation(score: number): { severity: string; interpretation: string } {
    if (score <= 3) return { severity: "Normale", interpretation: "Livelli normali di ansia" };
    if (score <= 5) return { severity: "Lieve", interpretation: "Livelli lievi di ansia" };
    if (score <= 7) return { severity: "Moderato", interpretation: "Livelli moderati di ansia" };
    if (score <= 9) return { severity: "Severo", interpretation: "Livelli severi di ansia" };
    return { severity: "Estremamente Severo", interpretation: "Livelli estremamente severi di ansia" };
  }

  private static getStressInterpretation(score: number): { severity: string; interpretation: string } {
    if (score <= 7) return { severity: "Normale", interpretation: "Livelli normali di stress" };
    if (score <= 9) return { severity: "Lieve", interpretation: "Livelli lievi di stress" };
    if (score <= 12) return { severity: "Moderato", interpretation: "Livelli moderati di stress" };
    if (score <= 16) return { severity: "Severo", interpretation: "Livelli severi di stress" };
    return { severity: "Estremamente Severo", interpretation: "Livelli estremamente severi di stress" };
  }

  private static calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
    // Calcolo approssimativo del percentile usando distribuzione normale
    const zScore = (score - norm.mean) / norm.sd;
    // Approssimazione semplice del percentile
    if (zScore <= -2) return 2;
    if (zScore <= -1) return 16;
    if (zScore <= 0) return 50;
    if (zScore <= 1) return 84;
    if (zScore <= 2) return 98;
    return 99;
  }

  public static calculateProfile(answers: Record<number, number>): DASS21Profile {
    // Calcolare punteggi sottoscale
    const depressionScore = this.calculateSubscaleScore(answers, this.getDepressionItems());
    const anxietyScore = this.calculateSubscaleScore(answers, this.getAnxietyItems());
    const stressScore = this.calculateSubscaleScore(answers, this.getStressItems());
    const totalScore = depressionScore + anxietyScore + stressScore;

    // Interpretazioni
    const depressionInterp = this.getDepressionInterpretation(depressionScore);
    const anxietyInterp = this.getAnxietyInterpretation(anxietyScore);
    const stressInterp = this.getStressInterpretation(stressScore);

    // Calcolare percentili (popolazione generale)
    const depressionPercentile = this.calculatePercentile(depressionScore, dass21Norms.general.depression);
    const anxietyPercentile = this.calculatePercentile(anxietyScore, dass21Norms.general.anxiety);
    const stressPercentile = this.calculatePercentile(stressScore, dass21Norms.general.stress);

    // Determinare severità complessiva
    const severities = [depressionInterp.severity, anxietyInterp.severity, stressInterp.severity];
    const maxSeverity = severities.includes("Estremamente Severo") ? "Estremamente Severo" :
                       severities.includes("Severo") ? "Severo" :
                       severities.includes("Moderato") ? "Moderato" :
                       severities.includes("Lieve") ? "Lieve" : "Normale";

    // Generare note cliniche
    const clinicalNotes: string[] = [];
    if (depressionScore > 4) {
      clinicalNotes.push(`Punteggio Depressione (${depressionScore}) indica livelli ${depressionInterp.severity.toLowerCase()} di sintomi depressivi.`);
    }
    if (anxietyScore > 3) {
      clinicalNotes.push(`Punteggio Ansia (${anxietyScore}) indica livelli ${anxietyInterp.severity.toLowerCase()} di sintomi ansiosi.`);
    }
    if (stressScore > 7) {
      clinicalNotes.push(`Punteggio Stress (${stressScore}) indica livelli ${stressInterp.severity.toLowerCase()} di stress.`);
    }
    if (totalScore > 12.3) {
      clinicalNotes.push(`Il punteggio totale (${totalScore}) è superiore alla media della popolazione generale (12.3).`);
    }

    // Generare raccomandazioni
    const recommendations: string[] = [];
    if (depressionScore > 6) {
      recommendations.push("Valutazione approfondita per sintomi depressivi. Considerare supporto psicologico.");
    }
    if (anxietyScore > 5) {
      recommendations.push("Valutazione per disturbi d'ansia. Tecniche di gestione dell'ansia potrebbero essere utili.");
    }
    if (stressScore > 9) {
      recommendations.push("Interventi per la gestione dello stress raccomandati. Tecniche di rilassamento potrebbero essere benefiche.");
    }
    if (totalScore > 22) {
      recommendations.push("I punteggi indicano livelli clinicamente significativi. Consultazione con professionista della salute mentale raccomandata.");
    }
    if (recommendations.length === 0) {
      recommendations.push("I punteggi rientrano nei range normali. Mantenere buone abitudini di benessere psicologico.");
    }

    return {
      testInfo: {
        name: "DASS-21 - Depression Anxiety Stress Scale",
        date: new Date().toLocaleDateString("it-IT"),
        duration: "5-10 minuti"
      },
      subscales: {
        depression: {
          name: "Depressione",
          score: depressionScore,
          items: this.getDepressionItems(),
          interpretation: depressionInterp.interpretation,
          severity: depressionInterp.severity,
          percentile: depressionPercentile
        },
        anxiety: {
          name: "Ansia",
          score: anxietyScore,
          items: this.getAnxietyItems(),
          interpretation: anxietyInterp.interpretation,
          severity: anxietyInterp.severity,
          percentile: anxietyPercentile
        },
        stress: {
          name: "Stress",
          score: stressScore,
          items: this.getStressItems(),
          interpretation: stressInterp.interpretation,
          severity: stressInterp.severity,
          percentile: stressPercentile
        }
      },
      totalScore: {
        score: totalScore,
        interpretation: `Punteggio totale ${maxSeverity.toLowerCase()}`,
        severity: maxSeverity
      },
      clinicalNotes,
      recommendations
    };
  }
}
