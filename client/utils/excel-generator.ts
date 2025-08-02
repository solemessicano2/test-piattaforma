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

    // Sheet 3: FORMULE CORRETTE (se richiesto)
    if (includeFormulas) {
      // Prima riorganizzare i dati in ordine sequenziale per le formule
      const formulaData = [
        ["PID-5 FORMULE CORRETTE E FUNZIONANTI"],
        [""],
        ["DATI PER FORMULE (ordinati per ID)"],
        ["Riga", "ID Item", "Risposta", "Invertito?", "Valore Corretto"],
      ];

      // Ordinare gli item per ID e creare riferimenti fissi
      const sortedItems = Object.entries(answers).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      const reversedItems = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215];

      // Creare i dati con formule per inversione
      sortedItems.forEach(([itemId, answer], index) => {
        const row = index + 5; // Righe 5+
        const isReversed = reversedItems.includes(parseInt(itemId));

        formulaData.push([
          row,
          parseInt(itemId),
          parseInt(answer),
          isReversed ? "SÌ" : "NO",
          null // Sarà riempito con formula
        ]);
      });

      // Separatore per calcoli faccette
      formulaData.push(
        [""],
        ["CALCOLO FACCETTE"],
        ["Faccetta", "Punteggio", "Items utilizzati"]
      );

      // Definire faccette principali con items specifici
      const mainFacets = [
        { name: "Anedonia", items: [2, 24, 27, 31, 125, 156, 158, 190] },
        { name: "Ansia", items: [80, 94, 96, 97, 110, 111, 131, 142, 175] },
        { name: "Labilità Emotiva", items: [7, 30, 149, 152, 166, 167, 169, 172] },
        { name: "Impulsività", items: [5, 17, 18, 23, 59, 205] },
        { name: "Manipolazione", items: [19, 35, 44, 64, 87, 115, 137] }
      ];

      // Aggiungere le faccette alla tabella
      mainFacets.forEach(facet => {
        formulaData.push([
          facet.name,
          null, // Punteggio da calcolare con formula
          facet.items.join(", ")
        ]);
      });

      const formulaWS = XLSX.utils.aoa_to_sheet(formulaData);

      // Aggiungere formule per inversione (colonna E)
      sortedItems.forEach(([itemId, answer], index) => {
        const row = index + 5;
        const isReversed = reversedItems.includes(parseInt(itemId));

        if (isReversed) {
          // Formula per inversione: 3 - valore originale
          formulaWS[`E${row}`] = { f: `3-C${row}` };
        } else {
          // Formula per copiare il valore: = valore originale
          formulaWS[`E${row}`] = { f: `C${row}` };
        }
      });

      // Calcolare la riga di inizio per le faccette
      const facetStartRow = sortedItems.length + 9;

      // Aggiungere formule per le faccette
      mainFacets.forEach((facet, index) => {
        const row = facetStartRow + index;

        // Trovare le righe corrispondenti agli item della faccetta
        const cellRefs = facet.items.map(itemId => {
          const itemIndex = sortedItems.findIndex(([id]) => parseInt(id) === itemId);
          if (itemIndex >= 0) {
            return `E${itemIndex + 5}`; // Punta alla colonna E (valore corretto)
          }
          return null;
        }).filter(Boolean);

        if (cellRefs.length > 0) {
          // Formula MEDIA con riferimenti diretti alle celle
          const formula = `MEDIA(${cellRefs.join(";")})`;
          formulaWS[`B${row}`] = { f: formula };
        }
      });

      // Impostare larghezze colonne
      formulaWS["!cols"] = [
        { wch: 8 },  // Riga
        { wch: 12 }, // ID Item
        { wch: 12 }, // Risposta
        { wch: 12 }, // Invertito?
        { wch: 15 }, // Valore Corretto
      ];

      XLSX.utils.book_append_sheet(wb, formulaWS, "Formule");
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
