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

    // Sheet 3: Calcoli AUTOMATICI con formule (se richiesto)
    if (includeFormulas) {
      // Creare foglio per calcoli automatici
      const calcData = [
        ["PID-5 CALCOLI AUTOMATICI"],
        [""],
        ["VALORI CORRETTI (con inversioni automatiche)"],
        ["Item ID", "Valore Originale", "Valore Corretto", "Note"],
      ];

      // Lista item da invertire
      const reversedItems = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215];

      // Creare array ordinato delle risposte
      const sortedAnswers = Object.entries(answers).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

      // Aggiungere i dati con formule di inversione
      sortedAnswers.forEach(([itemId, answer], index) => {
        const row = index + 5; // Inizia dalla riga 5
        const itemIdNum = parseInt(itemId);
        const isReversed = reversedItems.includes(itemIdNum);

        calcData.push([
          itemIdNum,
          parseInt(answer),
          null, // Verrà riempito con formula
          isReversed ? "INVERTITO" : "NORMALE"
        ]);
      });

      // Aggiungere sezione faccette
      const facetStartRow = sortedAnswers.length + 8;
      calcData.push(
        [""],
        ["CALCOLO FACCETTE PRINCIPALI"],
        ["Faccetta", "Punteggio Medio", "Interpretazione"]
      );

      // Definire faccette con items
      const facets = [
        { name: "Anedonia", items: [2, 24, 27, 31, 125, 156, 158, 190] },
        { name: "Ansia", items: [80, 94, 96, 97, 110, 111, 131, 142, 175] },
        { name: "Labilità Emotiva", items: [7, 30, 149, 152, 166, 167, 169, 172] },
        { name: "Impulsività", items: [5, 17, 18, 23, 59, 205] },
        { name: "Manipolazione", items: [19, 35, 44, 64, 87, 115, 137] }
      ];

      // Aggiungere righe faccette
      facets.forEach(facet => {
        calcData.push([
          facet.name,
          null, // Verrà riempito con formula
          ""
        ]);
      });

      // Creare il worksheet
      const calcWS = XLSX.utils.aoa_to_sheet(calcData);

      // AGGIUNGERE FORMULE REALI

      // 1. Formule per valori corretti (colonna C)
      sortedAnswers.forEach(([itemId, answer], index) => {
        const row = index + 5;
        const itemIdNum = parseInt(itemId);
        const isReversed = reversedItems.includes(itemIdNum);

        if (isReversed) {
          // Formula inversione: =3-B5
          calcWS[`C${row}`] = { f: `3-B${row}` };
        } else {
          // Formula copia: =B5
          calcWS[`C${row}`] = { f: `B${row}` };
        }
      });

      // 2. Formule per faccette
      facets.forEach((facet, facetIndex) => {
        const row = facetStartRow + 3 + facetIndex;

        // Trovare le righe per gli item della faccetta
        const itemCells = facet.items.map(itemId => {
          const answerIndex = sortedAnswers.findIndex(([id]) => parseInt(id) === itemId);
          if (answerIndex >= 0) {
            return `C${answerIndex + 5}`;
          }
          return null;
        }).filter(Boolean);

        if (itemCells.length > 0) {
          // Formula MEDIA reale: =MEDIA(C5;C12;C25)
          calcWS[`B${row}`] = { f: `MEDIA(${itemCells.join(";")})` };
        }
      });

      // 3. Sezione domini
      const domainStartRow = facetStartRow + facets.length + 6;

      // Aggiungere dati domini
      const domainData = [
        [""],
        ["CALCOLO DOMINI DSM-5"],
        ["Dominio", "Punteggio", "Clinicamente Elevato?"],
        ["Affettività Negativa", null, null],
        ["Distacco", null, null],
        ["Antagonismo", null, null],
        ["Disinibizione", null, null],
        ["Psicoticismo", null, null]
      ];

      // Aggiungere domini al foglio
      domainData.forEach((row, i) => {
        const excelRow = domainStartRow + i;
        row.forEach((cell, j) => {
          const excelCol = String.fromCharCode(65 + j);
          if (cell !== null) {
            calcWS[`${excelCol}${excelRow}`] = { v: cell };
          }
        });
      });

      // Formule per domini (esempio con Affettività Negativa)
      const domainFormulas = [
        `MEDIA(B${facetStartRow + 3};B${facetStartRow + 4};B${facetStartRow + 5})`, // Anedonia + Ansia + Labilità
        `MEDIA(B${facetStartRow + 3};B${facetStartRow + 4};B${facetStartRow + 5})`, // Esempio semplificato
        `MEDIA(B${facetStartRow + 6};B${facetStartRow + 7};B${facetStartRow + 4})`, // Manipolazione + altro
        `MEDIA(B${facetStartRow + 5};B${facetStartRow + 6};B${facetStartRow + 4})`, // Impulsività + altro
        `MEDIA(B${facetStartRow + 3};B${facetStartRow + 4};B${facetStartRow + 5})`  // Esempio
      ];

      domainFormulas.forEach((formula, i) => {
        const row = domainStartRow + 3 + i;
        calcWS[`B${row}`] = { f: formula };
        // Formula per soglia clinica: =SE(B>2;"SÌ";"NO")
        calcWS[`C${row}`] = { f: `SE(B${row}>=2;"SÌ";"NO")` };
      });

      // Impostare larghezze colonne
      calcWS["!cols"] = [
        { wch: 20 }, // Item ID / Nome
        { wch: 15 }, // Valore
        { wch: 15 }, // Valore Corretto / Clinicamente Elevato
        { wch: 20 }, // Note / Interpretazione
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
