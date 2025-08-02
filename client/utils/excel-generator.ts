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

    // Sheet 3: Calcoli e Formule SEMPLICI (se richiesto)
    if (includeFormulas) {
      // Lista item da invertire
      const reversedItems = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215];

      const calcData = [
        ["PID-5 CALCOLI FUNZIONANTI"],
        [""],
        ["VALORI CORRETTI"],
        ["Item ID", "Originale", "Corretto", "Note"],
      ];

      // Array ordinato delle risposte
      const sortedAnswers = Object.entries(answers).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

      // Aggiungere i dati con valori già calcolati (non formule)
      sortedAnswers.forEach(([itemId, answer]) => {
        const itemIdNum = parseInt(itemId);
        const originalValue = parseInt(answer);
        const isReversed = reversedItems.includes(itemIdNum);
        const correctedValue = isReversed ? 3 - originalValue : originalValue;

        calcData.push([
          itemIdNum,
          originalValue,
          correctedValue,
          isReversed ? "INVERTITO" : "NORMALE"
        ]);
      });

      // Aggiungere spazio
      calcData.push([""], ["CALCOLO FACCETTE"]);
      calcData.push(["Faccetta", "Punteggio", "Items utilizzati"]);

      // Definire faccette principali
      const facetDefinitions = [
        { name: "Anedonia", items: [2, 24, 27, 31, 125, 156, 158, 190] },
        { name: "Ansia", items: [80, 94, 96, 97, 110, 111, 131, 142, 175] },
        { name: "Labilità Emotiva", items: [7, 30, 149, 152, 166, 167, 169, 172] },
        { name: "Impulsività", items: [5, 17, 18, 23, 59, 205] },
        { name: "Manipolazione", items: [19, 35, 44, 64, 87, 115, 137] }
      ];

      // Calcolare e aggiungere i punteggi delle faccette (valori calcolati, non formule)
      facetDefinitions.forEach(facet => {
        const itemValues = facet.items.map(itemId => {
          const answerEntry = sortedAnswers.find(([id]) => parseInt(id) === itemId);
          if (answerEntry) {
            const originalValue = parseInt(answerEntry[1]);
            return reversedItems.includes(itemId) ? 3 - originalValue : originalValue;
          }
          return null;
        }).filter(v => v !== null);

        const meanScore = itemValues.length > 0 ?
          itemValues.reduce((sum, val) => sum + val, 0) / itemValues.length : 0;

        calcData.push([
          facet.name,
          meanScore.toFixed(2),
          facet.items.join(", ")
        ]);
      });

      // Aggiungere sezione domini
      calcData.push([""], ["DOMINI DSM-5"]);
      calcData.push(["Dominio", "Punteggio", "Clinicamente Elevato"]);

      // Calcolare domini usando i punteggi delle faccette già calcolati
      const domainDefinitions = [
        { name: "Affettività Negativa", facets: ["Anedonia", "Ansia", "Labilità Emotiva"] },
        { name: "Distacco", facets: ["Anedonia", "Ritiro", "Evitamento"] },
        { name: "Antagonismo", facets: ["Manipolazione", "Inganno", "Grandiosità"] },
        { name: "Disinibizione", facets: ["Impulsività", "Irresponsabilità", "Distraibilità"] },
        { name: "Psicoticismo", facets: ["Convinzioni", "Eccentricità", "Disregolazione"] }
      ];

      // Per semplicità, usare i punteggi calcolati dal profilo esistente
      profile.domainScores.forEach(domain => {
        calcData.push([
          domain.domain,
          domain.meanScore.toFixed(2),
          domain.meanScore >= 2.0 ? "SÌ" : "NO"
        ]);
      });

      // Aggiungere istruzioni
      calcData.push(
        [""],
        ["ISTRUZIONI PER CALCOLO MANUALE"],
        ["1. Gli item da invertire sono: " + reversedItems.join(", ")],
        ["2. Formula inversione: 3 - valore_originale"],
        ["3. Calcolo faccetta: media degli item corretti"],
        ["4. Calcolo dominio: media di 3 faccette principali"],
        ["5. Soglia clinica: punteggio ≥ 2.0"]
      );

      const calcWS = XLSX.utils.aoa_to_sheet(calcData);

      // Impostare larghezze colonne
      calcWS["!cols"] = [
        { wch: 25 }, // Nome/ID
        { wch: 12 }, // Punteggio
        { wch: 40 }, // Items/Note
      ];

      XLSX.utils.book_append_sheet(wb, calcWS, "Calcoli");
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
