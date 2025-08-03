export interface DASS21Item {
  id: number;
  text: string;
  subscale: 'depression' | 'anxiety' | 'stress';
}

export interface DASS21Test {
  id: string;
  title: string;
  description: string;
  duration: string;
  itemCount: number;
  items: DASS21Item[];
  scaleOptions: {
    value: number;
    label: string;
    description: string;
  }[];
}

export const dass21Test: DASS21Test = {
  id: "dass-21",
  title: "DASS-21 - Depression Anxiety Stress Scale",
  description: "Scala per la valutazione di Depressione, Ansia e Stress negli ultimi 7 giorni",
  duration: "5-10 minuti",
  itemCount: 21,
  scaleOptions: [
    {
      value: 0,
      label: "0",
      description: "Non mi è mai accaduto"
    },
    {
      value: 1,
      label: "1",
      description: "Mi è capitato qualche volta"
    },
    {
      value: 2,
      label: "2",
      description: "Mi è capitato con una certa frequenza"
    },
    {
      value: 3,
      label: "3",
      description: "Mi è capitato quasi sempre"
    }
  ],
  items: [
    {
      id: 1,
      text: "Ho provato molta tensione e ho avuto difficoltà a recuperare uno stato di calma.",
      subscale: "stress"
    },
    {
      id: 2,
      text: "Mi sono accorto di avere la bocca secca.",
      subscale: "anxiety"
    },
    {
      id: 3,
      text: "Non riuscivo proprio a provare delle emozioni positive.",
      subscale: "depression"
    },
    {
      id: 4,
      text: "Mi sono sentito molto in affanno con difficoltà a respirare (per es. respiro molto accelerato, sensazione di forte affanno in assenza di sforzo fisico).",
      subscale: "anxiety"
    },
    {
      id: 5,
      text: "Ho avuto un'estrema difficoltà nel cominciare quello che dovevo fare.",
      subscale: "depression"
    },
    {
      id: 6,
      text: "Ho avuto la tendenza a reagire in maniera eccessiva alle situazioni.",
      subscale: "stress"
    },
    {
      id: 7,
      text: "Ho avuto tremori (per es. alle mani).",
      subscale: "anxiety"
    },
    {
      id: 8,
      text: "Ho sentito che stavo impiegando molta energia nervosa.",
      subscale: "stress"
    },
    {
      id: 9,
      text: "Ho temuto di trovarmi in situazioni in cui sarei potuto andare nel panico e rendermi ridicolo.",
      subscale: "anxiety"
    },
    {
      id: 10,
      text: "Non vedevo nulla di buono nel mio futuro.",
      subscale: "depression"
    },
    {
      id: 11,
      text: "Mi sono sentito stressato.",
      subscale: "stress"
    },
    {
      id: 12,
      text: "Ho avuto difficoltà a rilassarmi.",
      subscale: "stress"
    },
    {
      id: 13,
      text: "Mi sono sentito scoraggiato e depresso.",
      subscale: "depression"
    },
    {
      id: 14,
      text: "Non riuscivo a tollerare per nulla eventi o situazioni che mi impedivano di portare avanti ciò che stavo facendo.",
      subscale: "stress"
    },
    {
      id: 15,
      text: "Ho sentito di essere vicino ad avere un attacco di panico.",
      subscale: "anxiety"
    },
    {
      id: 16,
      text: "Non c'era nulla che mi dava entusiasmo.",
      subscale: "depression"
    },
    {
      id: 17,
      text: "Sentivo di valere poco come persona.",
      subscale: "depression"
    },
    {
      id: 18,
      text: "Mi sono sentito piuttosto irritabile.",
      subscale: "stress"
    },
    {
      id: 19,
      text: "Ho percepito distintamente il battito del mio cuore senza aver fatto uno sforzo fisico (per es. battito cardiaco accelerato o perdita di un battito).",
      subscale: "anxiety"
    },
    {
      id: 20,
      text: "Mi sono sentito spaventato senza ragione.",
      subscale: "anxiety"
    },
    {
      id: 21,
      text: "Sentivo la vita priva di significato.",
      subscale: "depression"
    }
  ]
};

// Norme per popolazione generale e clinica
export interface DASS21Norms {
  general: {
    depression: { mean: number; sd: number };
    anxiety: { mean: number; sd: number };
    stress: { mean: number; sd: number };
    total: { mean: number; sd: number };
  };
  clinical: {
    depression: { mean: number; sd: number };
    anxiety: { mean: number; sd: number };
    stress: { mean: number; sd: number };
    total: { mean: number; sd: number };
  };
}

export const dass21Norms: DASS21Norms = {
  general: {
    depression: { mean: 3.5, sd: 3.2 },
    anxiety: { mean: 2.4, sd: 2.6 },
    stress: { mean: 6.4, sd: 3.8 },
    total: { mean: 12.3, sd: 8.3 }
  },
  clinical: {
    depression: { mean: 7.7, sd: 5.6 },
    anxiety: { mean: 5.5, sd: 4.6 },
    stress: { mean: 8.9, sd: 4.2 },
    total: { mean: 22.1, sd: 12.1 }
  }
};
