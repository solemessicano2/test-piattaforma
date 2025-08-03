import * as XLSX from "xlsx";
import type { DASS21Profile } from "@/utils/dass21-scoring";

export interface DASS21ExcelOptions {
  profile: DASS21Profile;
  answers: Record<number, number>;
}

export class DASS21ExcelGenerator {
  static generateResultsWorkbook(options: DASS21ExcelOptions): XLSX.WorkBook {
    const { profile, answers } = options;
    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary Results
    const summaryData = [
      ["DASS-21 - Risultati Elaborazione"],
      ["Data Elaborazione", new Date().toLocaleDateString("it-IT")],
      [""],
      ["PUNTEGGI SOTTOSCALE"],
      ["Sottoscala", "Punteggio", "Severità", "Percentile", "Interpretazione"],
      [
        "Depressione",
        profile.subscales.depression.score,
        profile.subscales.depression.severity,
        profile.subscales.depression.percentile + "°",
        profile.subscales.depression.interpretation
      ],
      [
        "Ansia",
        profile.subscales.anxiety.score,
        profile.subscales.anxiety.severity,
        profile.subscales.anxiety.percentile + "°",
        profile.subscales.anxiety.interpretation
      ],
      [
        "Stress",
        profile.subscales.stress.score,
        profile.subscales.stress.severity,
        profile.subscales.stress.percentile + "°",
        profile.subscales.stress.interpretation
      ],
      [""],
      ["PUNTEGGIO TOTALE"],
      ["Totale", profile.totalScore.score, profile.totalScore.severity, "", profile.totalScore.interpretation],
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWS["!cols"] = [
      { wch: 20 }, // Sottoscala
      { wch: 12 }, // Punteggio
      { wch: 18 }, // Severità
      { wch: 12 }, // Percentile
      { wch: 40 }, // Interpretazione
    ];

    XLSX.utils.book_append_sheet(wb, summaryWS, "Risultati");

    // Sheet 2: Raw Data
    const rawData = [
      ["RISPOSTE INDIVIDUALI"],
      ["ID Item", "Risposta (0-3)", "Risposta Testuale", "Sottoscala"],
      ...Object.entries(answers).map(([itemId, answer]) => [
        parseInt(itemId),
        answer,
        this.getAnswerText(answer),
        this.getItemSubscale(parseInt(itemId))
      ]),
    ];

    const rawWS = XLSX.utils.aoa_to_sheet(rawData);
    rawWS["!cols"] = [
      { wch: 10 }, // ID Item
      { wch: 15 }, // Risposta
      { wch: 30 }, // Risposta Testuale
      { wch: 15 }, // Sottoscala
    ];

    XLSX.utils.book_append_sheet(wb, rawWS, "Dati Grezzi");

    // Sheet 3: Clinical Notes and Recommendations
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
      [""],
      ["INFORMAZIONI TECNICHE"],
      ["Test", "DASS-21 - Depression Anxiety Stress Scale"],
      ["Riferimento", "Bottesi, Ghisi, Altoè, Conforti, Melli, & Sica (2015)"],
      ["Versione", "Italiana - 21 item"],
      ["Data somministrazione", new Date().toLocaleDateString("it-IT")],
      [""],
      ["SCORING"],
      ["Depressione: Item 3, 5, 10, 13, 16, 17, 21"],
      ["Ansia: Item 2, 4, 7, 9, 15, 19, 20"],
      ["Stress: Item 1, 6, 8, 11, 12, 14, 18"],
      [""],
      ["NORME POPOLAZIONE GENERALE"],
      ["Depressione", "Media: 3.5", "DS: 3.2"],
      ["Ansia", "Media: 2.4", "DS: 2.6"],
      ["Stress", "Media: 6.4", "DS: 3.8"],
      ["Totale", "Media: 12.3", "DS: 8.3"],
    ];

    const clinicalWS = XLSX.utils.aoa_to_sheet(clinicalData);
    clinicalWS["!cols"] = [{ wch: 25 }, { wch: 60 }];

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
      "Non mi è mai accaduto",
      "Mi è capitato qualche volta",
      "Mi è capitato con una certa frequenza",
      "Mi è capitato quasi sempre",
    ];
    return scale[score] || "Non risposto";
  }

  private static getItemSubscale(itemId: number): string {
    const depressionItems = [3, 5, 10, 13, 16, 17, 21];
    const anxietyItems = [2, 4, 7, 9, 15, 19, 20];
    const stressItems = [1, 6, 8, 11, 12, 14, 18];

    if (depressionItems.includes(itemId)) return "Depressione";
    if (anxietyItems.includes(itemId)) return "Ansia";
    if (stressItems.includes(itemId)) return "Stress";
    return "Sconosciuto";
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
