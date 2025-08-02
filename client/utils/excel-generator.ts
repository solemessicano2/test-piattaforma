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

    XLSX.utils.book_append_sheet(wb, rawWS, "Dati Grezzi");

    // Sheet 3: Calcoli con Formule FUNZIONANTI (se richiesto)
    if (includeFormulas) {
      const calcData = [
        ["PID-5 CALCOLO AUTOMATICO CON FORMULE EXCEL"],
        [""],
        ["FACCETTE CON FORMULE FUNZIONANTI"],
        ["Faccetta", "Punteggio", "Formula utilizzata", "Items coinvolti"],
      ];

      // Definire le faccette con i loro item (inclusi quelli da invertire)
      const facetDefinitions = [
        { name: "Anedonia", items: [2, 24, 27, 31, 125, 156, 158, 190] },
        { name: "Ansia", items: [80, 94, 96, 97, 110, 111, 131, 142, 175] },
        { name: "Labilità Emotiva", items: [7, 30, 149, 152, 166, 167, 169, 172] },
        { name: "Angoscia di Separazione", items: [98, 103, 113, 120, 146, 162, 180, 194] },
        { name: "Ritiro", items: [8, 33, 70, 116, 121, 168, 181, 218] },
        { name: "Evitamento dell'Intimità", items: [6, 53, 76, 122, 145, 155, 198, 213] },
        { name: "Manipolatorietà", items: [19, 35, 44, 64, 87, 115, 137] },
        { name: "Inganno", items: [60, 90, 109, 128, 153, 179, 199] },
        { name: "Grandiosità", items: [29, 39, 66, 84, 134, 171, 197] },
        { name: "Irresponsabilità", items: [3, 28, 46, 65, 104, 119, 177] },
        { name: "Impulsività", items: [5, 17, 18, 23, 59, 205] },
        { name: "Distraibilità", items: [9, 45, 67, 85, 126, 178, 220] },
      ];

      const reversedItems = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215];

      // Creare un mapping degli item alle righe nel foglio "Dati Grezzi"
      const sortedAnswers = Object.entries(answers).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      const itemToRowMap = new Map();
      sortedAnswers.forEach(([itemId, answer], index) => {
        itemToRowMap.set(parseInt(itemId), index + 3); // Riga 3+ nei "Dati Grezzi"
      });

      // Per ogni faccetta, creare una riga con la formula MEDIA() funzionante
      facetDefinitions.forEach((facet, index) => {
        const row = index + 5; // Inizia dalla riga 5

        // Costruire la formula che pesca dal foglio "Dati Grezzi"
        const formulaParts = facet.items.map(itemId => {
          const itemRow = itemToRowMap.get(itemId);
          if (!itemRow) return null; // Item non trovato

          if (reversedItems.includes(itemId)) {
            // Se l'item deve essere invertito: 3 - valore
            return `(3-'Dati Grezzi'.B${itemRow})`;
          } else {
            // Item normale
            return `'Dati Grezzi'.B${itemRow}`;
          }
        }).filter(Boolean); // Rimuove null

        const formula = formulaParts.length > 0 ? `MEDIA(${formulaParts.join(";")})` : "N/D";
        const itemsList = facet.items.join(", ");

        calcData.push([
          facet.name,
          null, // Sarà riempito con la formula
          formula,
          itemsList
        ]);
      });

      const calcWS = XLSX.utils.aoa_to_sheet(calcData);

      // Aggiungere le formule effettive alle celle
      facetDefinitions.forEach((facet, index) => {
        const row = index + 5;

        // Costruire la formula che pesca dal foglio "Dati Grezzi"
        const formulaParts = facet.items.map(itemId => {
          // Trovare la riga dell'item nel foglio "Dati Grezzi"
          const itemRow = Object.keys(answers).indexOf(itemId.toString()) + 3;

          if (reversedItems.includes(itemId)) {
            // Se l'item deve essere invertito: 3 - valore
            return `(3-'Dati Grezzi'.B${itemRow})`;
          } else {
            // Item normale
            return `'Dati Grezzi'.B${itemRow}`;
          }
        }).filter(part => part.includes('B')); // Solo celle valide

        if (formulaParts.length > 0) {
          const formula = `MEDIA(${formulaParts.join(";")})`;
          calcWS[`B${row}`] = { f: formula };
        }
      });

      // Aggiungere sezione domini
      const domainStartRow = facetDefinitions.length + 8;
      const domainData = [
        [""],
        ["DOMINI DSM-5 CON FORMULE"],
        ["Dominio", "Punteggio", "Formula", "Faccette coinvolte"],
        ["Affettività Negativa", null, "=MEDIA(B5;B6;B8)", "Anedonia + Ansia + Labilità"],
        ["Distacco", null, "=MEDIA(B5;B9;B10)", "Anedonia + Ritiro + Evitamento"],
        ["Antagonismo", null, "=MEDIA(B11;B12;B13)", "Manipolazione + Inganno + Grandiosità"],
        ["Disinibizione", null, "=MEDIA(B14;B15;B16)", "Irresponsabilità + Impulsività + Distraibilità"],
        ["Psicoticismo", null, "=MEDIA(B17;B18;B19)", "Convinzioni + Eccentricità + Disregolazione"],
      ];

      // Aggiungere i domini al foglio
      domainData.forEach((row, i) => {
        const excelRow = domainStartRow + i;
        row.forEach((cell, j) => {
          const excelCol = String.fromCharCode(65 + j);
          if (cell !== null) {
            calcWS[`${excelCol}${excelRow}`] = { v: cell };
          }
        });
      });

      // Aggiungere le formule dei domini
      const domainFormulas = [
        `MEDIA(B5;B6;B8)`,   // Affettività Negativa
        `MEDIA(B5;B9;B10)`,  // Distacco
        `MEDIA(B11;B12;B13)`, // Antagonismo
        `MEDIA(B14;B15;B16)`, // Disinibizione
        `MEDIA(B17;B18;B19)`  // Psicoticismo (riferimenti da aggiustare)
      ];

      domainFormulas.forEach((formula, i) => {
        const row = domainStartRow + 3 + i;
        calcWS[`B${row}`] = { f: formula };
      });

      // Impostare larghezze colonne
      calcWS["!cols"] = [
        { wch: 25 }, // Colonna A - Nome
        { wch: 15 }, // Colonna B - Punteggio
        { wch: 40 }, // Colonna C - Formula
        { wch: 30 }, // Colonna D - Items
      ];

      XLSX.utils.book_append_sheet(wb, calcWS, "Calcoli Automatici");
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
