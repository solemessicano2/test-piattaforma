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

    // Sheet 3: Calcoli con Formule (se richiesto)
    if (includeFormulas) {
      // Creare prima il sheet dei dati con formule
      const calcData = [
        ["PID-5 CALCOLO AUTOMATICO CON FORMULE"],
        [""],
        ["RISPOSTE CORRETTE (con inversioni)"],
        ["Item", "Risposta Grezza", "Risposta Corretta", "Descrizione"],
      ];

      // Aggiungere tutte le risposte con formule di inversione
      const reversedItems = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215];
      const sortedAnswers = Object.entries(answers).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

      sortedAnswers.forEach(([itemId, answer], index) => {
        const row = index + 5; // Inizia dalla riga 5
        const isReversed = reversedItems.includes(parseInt(itemId));

        calcData.push([
          parseInt(itemId),
          parseInt(answer),
          isReversed ? null : parseInt(answer), // Sarà sostituita con formula se invertita
          isReversed ? "ITEM INVERTITO" : "ITEM NORMALE"
        ]);
      });

      const calcWS = XLSX.utils.aoa_to_sheet(calcData);

      // Aggiungere formule di inversione per gli item invertiti
      sortedAnswers.forEach(([itemId, answer], index) => {
        const row = index + 5; // Inizia dalla riga 5
        const isReversed = reversedItems.includes(parseInt(itemId));

        if (isReversed) {
          // Formula di inversione: 3 - valore originale
          calcWS[`C${row}`] = { f: `3-B${row}` };
        }
      });

      // Aggiungere sezione calcolo faccette
      const facetsStartRow = sortedAnswers.length + 8;
      const facetData = [
        [""],
        ["CALCOLO FACCETTE"],
        ["Faccetta", "Punteggio Medio", "Items"],
        // Esempi di calcolo per le principali faccette
        ["Anedonia", null, "Items: 2,24,27,31,125,156,158,190"],
        ["Ansia", null, "Items: 80,94,96,97,110,111,131,142,175"],
        ["Labilità Emotiva", null, "Items: 7,30,149,152,166,167,169,172"],
        ["Impulsività", null, "Items: 5,17,18,23,59,205"],
        ["Manipolazione", null, "Items: 19,35,44,64,87,115,137"],
        ["Inganno", null, "Items: 60,90,109,128,153,179,199"],
      ];

      // Aggiungere i dati delle faccette al calcWS
      facetData.forEach((row, i) => {
        const excelRow = facetsStartRow + i;
        row.forEach((cell, j) => {
          const excelCol = String.fromCharCode(65 + j); // A, B, C, etc.
          if (cell !== null) {
            calcWS[`${excelCol}${excelRow}`] = { v: cell };
          }
        });
      });

      // Aggiungere formule effettive per il calcolo delle faccette
      // Anedonia (esempio con formula reale)
      const anhedoniaItems = [2, 24, 27, 31, 125, 156, 158, 190];
      const anhedoniaFormula = anhedoniaItems.map(item => {
        const itemRow = sortedAnswers.findIndex(([id]) => parseInt(id) === item) + 5;
        return `C${itemRow}`;
      }).join(";");
      calcWS[`B${facetsStartRow + 3}`] = { f: `AVERAGE(${anhedoniaFormula})` };

      // Ansia
      const anxietyItems = [80, 94, 96, 97, 110, 111, 131, 142, 175];
      const anxietyFormula = anxietyItems.map(item => {
        const itemRow = sortedAnswers.findIndex(([id]) => parseInt(id) === item) + 5;
        return itemRow > 4 ? `C${itemRow}` : null;
      }).filter(Boolean).join(";");
      if (anxietyFormula) {
        calcWS[`B${facetsStartRow + 4}`] = { f: `AVERAGE(${anxietyFormula})` };
      }

      // Impostare larghezze colonne
      calcWS["!cols"] = [
        { wch: 12 }, // Colonna A - Item
        { wch: 15 }, // Colonna B - Risposta Grezza
        { wch: 15 }, // Colonna C - Risposta Corretta
        { wch: 25 }, // Colonna D - Descrizione
      ];

      XLSX.utils.book_append_sheet(wb, calcWS, "Calcoli Formule");

      // Sheet separato con istruzioni dettagliate
      const instructData = [
        ["ISTRUZIONI PER CALCOLO PID-5"],
        [""],
        ["ITEM DA INVERTIRE (Formula: 3 - valore_originale)"],
        ["Item ID", "Descrizione", "Formula Excel"],
        [7, "Tensione emotiva", "=3-[cella_valore_originale]"],
        [30, "Preoccupazione", "=3-[cella_valore_originale]"],
        [35, "Manipolazione", "=3-[cella_valore_originale]"],
        [58, "Rigidità", "=3-[cella_valore_originale]"],
        [87, "Inganno", "=3-[cella_valore_originale]"],
        [90, "Disonestà", "=3-[cella_valore_originale]"],
        [96, "Paura", "=3-[cella_valore_originale]"],
        [97, "Ansia", "=3-[cella_valore_originale]"],
        [98, "Separazione", "=3-[cella_valore_originale]"],
        [131, "Ansia sociale", "=3-[cella_valore_originale]"],
        [142, "Nervosismo", "=3-[cella_valore_originale]"],
        [155, "Evitamento", "=3-[cella_valore_originale]"],
        [164, "Routine", "=3-[cella_valore_originale]"],
        [177, "Rispetto regole", "=3-[cella_valore_originale]"],
        [210, "Conformità", "=3-[cella_valore_originale]"],
        [215, "Metodicità", "=3-[cella_valore_originale]"],
        [""],
        ["CALCOLO DOMINI DSM-5"],
        ["Dominio", "Faccette Componenti", "Formula Excel"],
        ["Affettività Negativa", "Labilità + Ansia + Separazione", "=AVERAGE(facet1;facet2;facet3)"],
        ["Distacco", "Ritiro + Anedonia + Evitamento", "=AVERAGE(facet1;facet2;facet3)"],
        ["Antagonismo", "Manipolazione + Inganno + Grandiosità", "=AVERAGE(facet1;facet2;facet3)"],
        ["Disinibizione", "Irresponsabilità + Impulsività + Distraibilità", "=AVERAGE(facet1;facet2;facet3)"],
        ["Psicoticismo", "Convinzioni + Eccentricità + Disregolazione", "=AVERAGE(facet1;facet2;facet3)"],
        [""],
        ["SOGLIE CLINICHE"],
        ["- Punteggio medio faccetta ≥ 2.0 = Clinicamente elevato"],
        ["- Punteggio medio dominio ≥ 2.0 = Clinicamente significativo"],
      ];

      const instructWS = XLSX.utils.aoa_to_sheet(instructData);
      instructWS["!cols"] = [{ wch: 15 }, { wch: 35 }, { wch: 40 }];

      XLSX.utils.book_append_sheet(wb, instructWS, "Istruzioni Calcolo");
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
