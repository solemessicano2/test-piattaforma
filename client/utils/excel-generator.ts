import * as XLSX from "xlsx";
import type { PID5OfficialProfile } from "@/utils/pid5-official-scoring";

export interface ExcelGeneratorOptions {
  profile: PID5OfficialProfile;
  answers: Record<number, string>;
  includeFormulas?: boolean;
}

export class ExcelGenerator {
  static generateResultsWorkbook(
    options: ExcelGeneratorOptions,
  ): XLSX.WorkBook {
    const { profile, answers, includeFormulas = false } = options;
    const wb = XLSX.utils.book_new();

    // Sheet 1: Risultati Summary
    const summaryData = [
      ["PID-5 - Risultati Elaborazione"],
      ["Data Elaborazione", new Date().toLocaleDateString("it-IT")],
      [""],
      ["PUNTEGGI DOMINI (DSM-5)"],
      ["Dominio", "Punteggio Medio", "Interpretazione", "Clinicamente Elevato"],
      ...profile.domainScores.map((domain) => [
        domain.domain,
        domain.meanScore.toFixed(2),
        domain.interpretation,
        domain.meanScore >= 2.0 ? "SÌ" : "NO",
      ]),
      [""],
      ["FACCETTE ELEVATE (≥2.0)"],
      ["Faccetta", "Punteggio Medio", "Interpretazione"],
      ...profile.facetScores
        .filter((f) => f.meanScore >= 2.0)
        .map((facet) => [
          facet.facet,
          facet.meanScore.toFixed(2),
          facet.interpretation,
        ]),
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);

    // Styling per il summary sheet
    summaryWS["!cols"] = [
      { wch: 25 }, // Colonna A
      { wch: 15 }, // Colonna B
      { wch: 30 }, // Colonna C
      { wch: 15 }, // Colonna D
    ];

    XLSX.utils.book_append_sheet(wb, summaryWS, "Risultati");

    // Sheet 2: Dati Grezzi
    const rawData = [
      ["RISPOSTE INDIVIDUALI"],
      ["ID Item", "Risposta (0-3)", "Risposta Testuale", "Dominio", "Faccetta"],
      ...Object.entries(answers).map(([itemId, answer]) => [
        parseInt(itemId),
        answer,
        this.getAnswerText(parseInt(answer)),
        "", // Dominio - da popolare se necessario
        "", // Faccetta - da popolare se necessario
      ]),
    ];

    const rawWS = XLSX.utils.aoa_to_sheet(rawData);
    rawWS["!cols"] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    XLSX.utils.book_append_sheet(wb, rawWS, "DatiGrezzi");

    // Sheet 3: Calcoli e Formule (se richiesto)
    if (includeFormulas) {
      const formulaData = [
        ["PID-5 CALCOLI E FORMULE DI RIFERIMENTO"],
        [""],
        ["ITEM DA INVERTIRE"],
        ["Item ID", "Formula", "Descrizione"],
        [7, "=3-[valore]", "Tensione emotiva"],
        [30, "=3-[valore]", "Preoccupazione"],
        [35, "=3-[valore]", "Manipolazione"],
        [58, "=3-[valore]", "Rigidità"],
        [87, "=3-[valore]", "Inganno"],
        [90, "=3-[valore]", "Disonestà"],
        [96, "=3-[valore]", "Paura"],
        [97, "=3-[valore]", "Ansia"],
        [98, "=3-[valore]", "Separazione"],
        [131, "=3-[valore]", "Ansia sociale"],
        [142, "=3-[valore]", "Nervosismo"],
        [155, "=3-[valore]", "Evitamento"],
        [164, "=3-[valore]", "Routine"],
        [177, "=3-[valore]", "Rispetto regole"],
        [210, "=3-[valore]", "Conformità"],
        [215, "=3-[valore]", "Metodicità"],
        [""],
        ["FACCETTE PRINCIPALI (calcolo manuale)"],
        ["Faccetta", "Items", "Calcolo suggerito"],
        ["Anedonia", "2,24,27,31,125,156,158,190", "=MEDIA dei valori corretti"],
        ["Ansia", "80,94,96,97,110,111,131,142,175", "=MEDIA dei valori corretti"],
        ["Labilità Emotiva", "7,30,149,152,166,167,169,172", "=MEDIA dei valori corretti"],
        ["Impulsività", "5,17,18,23,59,205", "=MEDIA dei valori corretti"],
        ["Manipolazione", "19,35,44,64,87,115,137", "=MEDIA dei valori corretti"],
        ["Inganno", "60,90,109,128,153,179,199", "=MEDIA dei valori corretti"],
        [""],
        ["DOMINI DSM-5"],
        ["Dominio", "Composizione", "Soglia Clinica"],
        ["Affettività Negativa", "Media di 3 faccette principali", "≥ 2.0"],
        ["Distacco", "Media di 3 faccette principali", "≥ 2.0"],
        ["Antagonismo", "Media di 3 faccette principali", "≥ 2.0"],
        ["Disinibizione", "Media di 3 faccette principali", "≥ 2.0"],
        ["Psicoticismo", "Media di 3 faccette principali", "≥ 2.0"],
        [""],
        ["ISTRUZIONI"],
        ["1. Usa i valori dal foglio 'DatiGrezzi'"],
        ["2. Applica le inversioni agli item indicati sopra"],
        ["3. Calcola la media per ogni faccetta"],
        ["4. Calcola la media di 3 faccette per ogni dominio"],
        ["5. Punteggi ≥ 2.0 sono clinicamente significativi"],
      ];

      const formulaWS = XLSX.utils.aoa_to_sheet(formulaData);

      // Impostare larghezze colonne
      formulaWS["!cols"] = [
        { wch: 20 }, // Colonna A
        { wch: 40 }, // Colonna B
        { wch: 30 }, // Colonna C
      ];

      XLSX.utils.book_append_sheet(wb, formulaWS, "Guida Calcoli");
    }

    // Sheet 4: Note Cliniche
    const clinicalData = [
      ["NOTE CLINICHE E RACCOMANDAZIONI"],
      [""],
      ["NOTE CLINICHE"],
      ...profile.clinicalNotes.map((note, index) => [
        `Nota ${index + 1}`,
        note,
      ]),
      [""],
      ["RACCOMANDAZIONI"],
      ...profile.recommendations.map((rec, index) => [
        `Raccomandazione ${index + 1}`,
        rec,
      ]),
    ];

    const clinicalWS = XLSX.utils.aoa_to_sheet(clinicalData);
    clinicalWS["!cols"] = [{ wch: 20 }, { wch: 80 }];

    XLSX.utils.book_append_sheet(wb, clinicalWS, "Note Cliniche");

    return wb;
  }

  static generateBuffer(workbook: XLSX.WorkBook): Buffer {
    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    });
  }

  private static getAnswerText(score: number): string {
    const scale = [
      "Per niente vero",
      "Leggermente vero",
      "Moderatamente vero",
      "Molto vero",
    ];
    return scale[score] || "Non risposto";
  }

  static downloadExcel(filename: string, workbook: XLSX.WorkBook): void {
    const buffer = this.generateBuffer(workbook);
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
