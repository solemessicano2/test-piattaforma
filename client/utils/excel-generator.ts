import * as XLSX from 'xlsx';
import type { PID5OfficialProfile } from '@/utils/pid5-official-scoring';

export interface ExcelGeneratorOptions {
  profile: PID5OfficialProfile;
  answers: Record<number, string>;
  includeFormulas?: boolean;
}

export class ExcelGenerator {
  static generateResultsWorkbook(options: ExcelGeneratorOptions): XLSX.WorkBook {
    const { profile, answers, includeFormulas = false } = options;
    const wb = XLSX.utils.book_new();

    // Sheet 1: Risultati Summary
    const summaryData = [
      ['PID-5 - Risultati Elaborazione'],
      ['Data Elaborazione', new Date().toLocaleDateString('it-IT')],
      [''],
      ['PUNTEGGI DOMINI (DSM-5)'],
      ['Dominio', 'Punteggio Medio', 'Interpretazione', 'Clinicamente Elevato'],
      ...profile.domainScores.map(domain => [
        domain.domain,
        domain.meanScore.toFixed(2),
        domain.interpretation,
        domain.meanScore >= 2.0 ? 'SÌ' : 'NO'
      ]),
      [''],
      ['FACCETTE ELEVATE (≥2.0)'],
      ['Faccetta', 'Punteggio Medio', 'Interpretazione'],
      ...profile.facetScores
        .filter(f => f.meanScore >= 2.0)
        .map(facet => [
          facet.facet,
          facet.meanScore.toFixed(2),
          facet.interpretation
        ])
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Styling per il summary sheet
    summaryWS['!cols'] = [
      { wch: 25 }, // Colonna A
      { wch: 15 }, // Colonna B
      { wch: 30 }, // Colonna C
      { wch: 15 }  // Colonna D
    ];

    XLSX.utils.book_append_sheet(wb, summaryWS, 'Risultati');

    // Sheet 2: Dati Grezzi
    const rawData = [
      ['RISPOSTE INDIVIDUALI'],
      ['ID Item', 'Risposta (0-3)', 'Risposta Testuale', 'Dominio', 'Faccetta'],
      ...Object.entries(answers).map(([itemId, answer]) => [
        parseInt(itemId),
        answer,
        this.getAnswerText(parseInt(answer)),
        '', // Dominio - da popolare se necessario
        ''  // Faccetta - da popolare se necessario
      ])
    ];

    const rawWS = XLSX.utils.aoa_to_sheet(rawData);
    rawWS['!cols'] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(wb, rawWS, 'Dati Grezzi');

    // Sheet 3: Formule (se richiesto)
    if (includeFormulas) {
      const formulaData = [
        ['PID-5 CALCOLO CON FORMULE DSM-5'],
        [''],
        ['ITEM DA INVERTIRE'],
        ['Item ID', 'Formula'],
        [7, '=3-[CELLA_ORIGINALE]'],
        [30, '=3-[CELLA_ORIGINALE]'],
        [35, '=3-[CELLA_ORIGINALE]'],
        [58, '=3-[CELLA_ORIGINALE]'],
        [87, '=3-[CELLA_ORIGINALE]'],
        [90, '=3-[CELLA_ORIGINALE]'],
        [96, '=3-[CELLA_ORIGINALE]'],
        [97, '=3-[CELLA_ORIGINALE]'],
        [98, '=3-[CELLA_ORIGINALE]'],
        [131, '=3-[CELLA_ORIGINALE]'],
        [142, '=3-[CELLA_ORIGINALE]'],
        [155, '=3-[CELLA_ORIGINALE]'],
        [164, '=3-[CELLA_ORIGINALE]'],
        [177, '=3-[CELLA_ORIGINALE]'],
        [210, '=3-[CELLA_ORIGINALE]'],
        [215, '=3-[CELLA_ORIGINALE]'],
        [''],
        ['CALCOLO FACCETTE (Esempi)'],
        ['Faccetta', 'Formula Excel'],
        ['Anedonia', '=MEDIA(B2;B24;B27;B31;B125;B156;B158;B190)'],
        ['Ansia', '=MEDIA(B80;B94;B96;B97;B110;B111;B131;B142;B175)'],
        ['Impulsività', '=MEDIA(B5;B17;B18;B23;B59;B205)'],
        [''],
        ['CALCOLO DOMINI'],
        ['Dominio', 'Formula (Media 3 faccette principali)'],
        ['Affettività Negativa', '=MEDIA([Labilità];[Ansia];[Separazione])'],
        ['Distacco', '=MEDIA([Ritiro];[Anedonia];[Evitamento])'],
        ['Antagonismo', '=MEDIA([Manipolazione];[Inganno];[Grandiosità])'],
        ['Disinibizione', '=MEDIA([Irresponsabilità];[Impulsività];[Distraibilità])'],
        ['Psicoticismo', '=MEDIA([Convinzioni];[Eccentricità];[Disregolazione])']
      ];

      const formulaWS = XLSX.utils.aoa_to_sheet(formulaData);
      formulaWS['!cols'] = [
        { wch: 20 },
        { wch: 40 }
      ];

      XLSX.utils.book_append_sheet(wb, formulaWS, 'Formule');
    }

    // Sheet 4: Note Cliniche
    const clinicalData = [
      ['NOTE CLINICHE E RACCOMANDAZIONI'],
      [''],
      ['NOTE CLINICHE'],
      ...profile.clinicalNotes.map((note, index) => [`Nota ${index + 1}`, note]),
      [''],
      ['RACCOMANDAZIONI'],
      ...profile.recommendations.map((rec, index) => [`Raccomandazione ${index + 1}`, rec])
    ];

    const clinicalWS = XLSX.utils.aoa_to_sheet(clinicalData);
    clinicalWS['!cols'] = [
      { wch: 20 },
      { wch: 80 }
    ];

    XLSX.utils.book_append_sheet(wb, clinicalWS, 'Note Cliniche');

    return wb;
  }

  static generateBuffer(workbook: XLSX.WorkBook): Buffer {
    return XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true 
    });
  }

  private static getAnswerText(score: number): string {
    const scale = ['Per niente vero', 'Leggermente vero', 'Moderatamente vero', 'Molto vero'];
    return scale[score] || 'Non risposto';
  }

  static downloadExcel(filename: string, workbook: XLSX.WorkBook): void {
    const buffer = this.generateBuffer(workbook);
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}
