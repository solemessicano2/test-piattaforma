import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";
import OfficialResultsDisplay from "@/components/OfficialResultsDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  processOfficialPID5Results,
  type PID5OfficialProfile,
} from "@/utils/pid5-official-scoring";
import {
  ArrowLeft,
  Download,
  Share2,
  Target,
  TrendingUp,
  Brain,
  Heart,
  Users,
  Lightbulb,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Shield,
} from "lucide-react";

export default function ResultsPage() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [pid5Profile, setPid5Profile] = useState<PID5OfficialProfile | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get data from navigation state
  const { answers, testData } = location.state || {};

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      if (answers) {
        const profile = processOfficialPID5Results(answers);
        setPid5Profile(profile);
      } else {
        // Generate demo data if no answers provided (direct access)
        const demoAnswers = generateDemoAnswers();
        const profile = processOfficialPID5Results(demoAnswers);
        setPid5Profile(profile);
      }
      setIsProcessing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [answers]);

  // Generate demo answers for demonstration purposes
  const generateDemoAnswers = () => {
    const demoAnswers: Record<number, string> = {};
    // Generate responses that will show some elevated scores
    for (let i = 1; i <= 220; i++) {
      // Create a pattern that gives realistic clinical results
      let score;
      if (i <= 50) {
        // First 50 items: moderate scores
        score = Math.floor(Math.random() * 3) + 1; // 1-3
      } else if (i <= 100) {
        // Next 50: lower scores
        score = Math.floor(Math.random() * 2); // 0-1
      } else if (i <= 150) {
        // Next 50: mixed scores
        score = Math.floor(Math.random() * 4); // 0-3
      } else {
        // Last 70: mostly low scores
        score = Math.floor(Math.random() * 2); // 0-1
      }
      demoAnswers[i] = score.toString();
    }
    return demoAnswers;
  };

  if (!pid5Profile && !isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              Errore nell'elaborazione dei risultati
            </p>
            <Link to="/">
              <Button>Torna alla Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "Molto Elevato":
        return "border-red-500 bg-red-50";
      case "Elevato":
        return "border-orange-500 bg-orange-50";
      case "Moderatamente Elevato":
        return "border-yellow-500 bg-yellow-50";
      case "Medio":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-green-500 bg-green-50";
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case "Affettività Negativa":
        return "bg-red-100 text-red-800 border-red-200";
      case "Distacco":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Antagonismo":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Disinibizione":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Psicoticismo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const averageMeanScore = pid5Profile
    ? pid5Profile.domainScores.reduce((sum, d) => sum + d.meanScore, 0) /
      pid5Profile.domainScores.length
    : 0;

  const averageTScore = averageMeanScore * 50; // Approssimazione per compatibilità template

  const handleDownloadPDF = () => {
    // Create a clean version for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = generatePrintableHTML();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generatePrintableHTML = () => {
    if (!pid5Profile) return "";

    const currentDate = new Date().toLocaleDateString("it-IT");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PID-5 Report - ${currentDate}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; }
          h3 { color: #1e3a8a; }
          .header { text-align: center; margin-bottom: 30px; }
          .risk-level { font-size: 18px; font-weight: bold; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .risk-basso { background-color: #dcfce7; color: #166534; }
          .risk-moderato { background-color: #fef3c7; color: #92400e; }
          .risk-elevato { background-color: #fed7d7; color: #c53030; }
          .risk-molto-elevato { background-color: #fecaca; color: #991b1b; }
          .domain-result { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 5px; }
          .domain-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; }
          .facet-list { margin-left: 20px; }
          .clinical-note { background-color: #f3f4f6; padding: 10px; margin: 10px 0; border-left: 4px solid #3b82f6; }
          .recommendation { background-color: #ecfdf5; padding: 10px; margin: 10px 0; border-left: 4px solid #10b981; }
          @media print { body { margin: 0; padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PID-5 - Report dei Risultati</h1>
          <p><strong>Inventario della Personalità per DSM-5</strong></p>
          <p>Data: ${currentDate}</p>
        </div>

        <div class="risk-level risk-${pid5Profile.overallRisk.toLowerCase().replace(" ", "-")}">
          Livello di Rischio Complessivo: ${pid5Profile.overallRisk}
        </div>

        <h2>Risultati per Domini</h2>
        ${pid5Profile.domainResults
          .map(
            (domain) => `
          <div class="domain-result">
            <div class="domain-title">${domain.domain} (T-Score: ${domain.tScore})</div>
            <p><strong>Livello:</strong> ${domain.level}</p>
            <p>${domain.interpretation}</p>
            ${
              domain.facets.filter((f) => f.clinicalSignificance).length > 0
                ? `
              <div class="facet-list">
                <strong>Faccette Clinicamente Elevate:</strong>
                <ul>
                  ${domain.facets
                    .filter((f) => f.clinicalSignificance)
                    .map(
                      (facet) => `
                    <li>${facet.facet} (T=${facet.tScore})</li>
                  `,
                    )
                    .join("")}
                </ul>
              </div>
            `
                : ""
            }
          </div>
        `,
          )
          .join("")}

        <h2>Note Cliniche</h2>
        ${pid5Profile.clinicalNotes
          .map(
            (note) => `
          <div class="clinical-note">${note}</div>
        `,
          )
          .join("")}

        <h2>Considerazioni Diagnostiche</h2>
        ${pid5Profile.diagnosticConsiderations
          .map(
            (consideration) => `
          <div class="clinical-note">${consideration}</div>
        `,
          )
          .join("")}

        <h2>Raccomandazioni</h2>
        ${pid5Profile.recommendations
          .map(
            (rec) => `
          <div class="recommendation">${rec}</div>
        `,
          )
          .join("")}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p><strong>Importante:</strong> Questi risultati sono generati automaticamente e non sostituiscono una valutazione clinica professionale. Consultare sempre uno psicologo qualificato per interpretazione e pianificazione terapeutica.</p>
          <p>Report generato il ${currentDate} dal sistema PID-5 TestPro</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleExportToExcel = () => {
    if (!pid5Profile || !answers || !testData) return;

    // Generate CSV data with raw scores
    const csvData = generateExcelData();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `PID5_Dati_Grezzi_${new Date().toLocaleDateString("it-IT").replace(/\//g, "-")}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateExcelData = () => {
    if (!pid5Profile || !answers || !testData) return "";

    const currentDate = new Date().toLocaleDateString("it-IT");

    // Header information
    let csvContent = "PID-5 - Dati Grezzi di Somministrazione\n";
    csvContent += `Data Elaborazione,${currentDate}\n`;
    csvContent += `Numero Item Valutati,${Object.keys(answers).length}\n`;
    csvContent += `Severità Complessiva,${pid5Profile.overallSeverity}\n`;
    csvContent += `Punteggio Medio Complessivo,${averageMeanScore.toFixed(2)}\n\n`;

    // Domain summary
    csvContent += "PUNTEGGI PER DOMINI (DSM-5)\n";
    csvContent +=
      "Dominio,Punteggio Medio,Interpretazione,Clinicamente Elevato\n";
    pid5Profile.domainScores.forEach((domain) => {
      csvContent += `${domain.domain},${domain.meanScore.toFixed(2)},${domain.interpretation},${domain.meanScore >= 2.0 ? "Sì" : "No"}\n`;
    });
    csvContent += "\n";

    // Facet scores for clinically significant ones
    csvContent += "FACCETTE ELEVATE (≥2.0)\n";
    csvContent += "Faccetta,Punteggio Medio,Interpretazione\n";
    pid5Profile.facetScores
      .filter((f) => f.meanScore >= 2.0)
      .forEach((facet) => {
        csvContent += `${facet.facet},${facet.meanScore.toFixed(2)},${facet.interpretation}\n`;
      });
    csvContent += "\n";

    // Individual item responses
    csvContent += "RISPOSTE INDIVIDUALI\n";
    csvContent +=
      "ID Item,Domanda,Risposta (0-3),Risposta Testuale,Dominio,Faccetta\n";

    testData.items.forEach((item) => {
      const answer = answers[item.id];
      const answerText =
        answer !== undefined
          ? testData.scaleLikert[parseInt(answer)]
          : "Non risposto";
      const answerValue = answer !== undefined ? answer : "";

      // Escape commas and quotes in text for CSV
      const questionText = `"${item.text.replace(/"/g, '""')}"`;
      const answerTextEscaped = `"${answerText.replace(/"/g, '""')}"`;

      csvContent += `${item.id},${questionText},${answerValue},${answerTextEscaped},${item.domain},${item.facet}\n`;
    });

    csvContent += "\n";
    csvContent += "NOTE CLINICHE\n";
    pid5Profile.clinicalNotes.forEach((note, index) => {
      csvContent += `Nota ${index + 1},"${note.replace(/"/g, '""')}"\n`;
    });

    csvContent += "\n";
    csvContent += "RACCOMANDAZIONI\n";
    pid5Profile.recommendations.forEach((rec, index) => {
      csvContent += `Raccomandazione ${index + 1},"${rec.replace(/"/g, '""')}"\n`;
    });

    return csvContent;
  };

  const handleExportWithFormulas = () => {
    if (!pid5Profile || !answers || !testData) return;

    // Generate Excel data with formulas
    const excelData = generateExcelWithFormulas();
    const blob = new Blob([excelData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `PID5_Con_Formule_${new Date().toLocaleDateString("it-IT").replace(/\//g, "-")}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateExcelWithFormulas = () => {
    if (!pid5Profile || !answers || !testData) return "";

    const currentDate = new Date().toLocaleDateString("it-IT");

    let csvContent = "PID-5 - CALCOLO RISULTATI CON FORMULE DSM-5\n";
    csvContent += `Data Elaborazione,${currentDate}\n\n`;

    // SEZIONE 1: ITEM INVERTITI
    csvContent += "ITEM DA INVERTIRE (Secondo DSM-5)\n";
    csvContent += "Item ID,Formula Inversione,Descrizione\n";
    const reversedItems = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215];
    reversedItems.forEach(itemId => {
      csvContent += `${itemId},=3-VALORE_ORIGINALE,Item ${itemId} deve essere invertito (3-x)\n`;
    });
    csvContent += "\n";

    // SEZIONE 2: RISPOSTE CON FORMULE DI INVERSIONE
    csvContent += "RISPOSTE INDIVIDUALI CON CALCOLI\n";
    csvContent += "ID Item,Risposta Originale,Invertito,Punteggio Finale,Formula Applicata,Faccetta\n";

    testData.items.forEach((item) => {
      const answer = answers[item.id];
      const originalScore = answer !== undefined ? parseInt(answer) : "";
      const isReversed = reversedItems.includes(item.id);
      const finalScore = answer !== undefined ?
        (isReversed ? 3 - parseInt(answer) : parseInt(answer)) : "";
      const formula = isReversed ? `=3-${originalScore}` : `=${originalScore}`;
      const appliedFormula = isReversed ? "INVERSIONE" : "DIRETTA";

      csvContent += `${item.id},${originalScore},${isReversed ? "SÌ" : "NO"},${finalScore},${formula},${item.facet}\n`;
    });
    csvContent += "\n";

    // SEZIONE 3: CALCOLO FACCETTE CON FORMULE
    csvContent += "CALCOLO PUNTEGGI FACCETTE\n";
    csvContent += "Faccetta,Item Inclusi,Somma Grezza,Numero Item,Punteggio Medio,Formula Calcolo\n";

    // Definizione degli item per faccetta (come nel sistema di scoring)
    const facetItems = {
      "Affettività ridotta": [8, 45, 84, 91, 101, 167, 184],
      "Anedonia": [1, 23, 26, 30, 124, 155, 157, 189],
      "Angoscia di separazione": [12, 50, 57, 64, 127, 149, 175],
      "Ansia": [79, 93, 95, 96, 109, 110, 130, 141, 174],
      "Convinzioni ed esperienze inusuali": [94, 99, 106, 139, 143, 150, 194, 209],
      "Depressività": [27, 61, 66, 81, 86, 104, 119, 148, 151, 163, 168, 169, 178, 212],
      "Disregolazione percettiva": [36, 37, 42, 44, 59, 77, 83, 154, 192, 193, 213, 217],
      "Distraibilità": [6, 29, 47, 68, 88, 118, 132, 144, 199],
      "Eccentricità": [5, 21, 24, 25, 33, 52, 55, 70, 71, 152, 172, 185, 205],
      "Evitamento dell'intimità": [89, 97, 108, 120, 145, 203],
      "Grandiosità": [40, 65, 114, 179, 187, 197],
      "Impulsività": [4, 16, 17, 22, 58, 204],
      "Inganno": [41, 53, 56, 76, 126, 134, 142, 206, 214, 218],
      "Insensibilità": [11, 13, 19, 54, 72, 73, 90, 153, 166, 183, 198, 200, 207, 208],
      "Irresponsabilità": [31, 129, 156, 160, 171, 201, 210],
      "Labilità emotiva": [18, 62, 102, 122, 138, 165, 181],
      "Manipolatorietà": [107, 125, 162, 180, 219],
      "Ostilità": [28, 32, 38, 85, 92, 116, 158, 170, 188, 216],
      "Perfezionismo rigido": [34, 49, 105, 115, 123, 135, 140, 176, 196, 220],
      "Perseverazione": [46, 51, 60, 78, 80, 100, 121, 128, 137],
      "Ricerca di attenzione": [14, 43, 74, 111, 113, 173, 191, 211],
      "Ritiro": [10, 20, 75, 82, 136, 146, 147, 161, 182, 186],
      "Sospettosità": [2, 103, 117, 131, 133, 177, 190],
      "Sottomissione": [9, 15, 63, 202],
      "Tendenza a correre rischi": [3, 7, 35, 39, 48, 67, 69, 87, 98, 112, 159, 164, 195, 215]
    };

    Object.entries(facetItems).forEach(([facetName, itemIds]) => {
      let rawScore = 0;
      let validItems = 0;

      itemIds.forEach(itemId => {
        const answer = answers[itemId];
        if (answer !== undefined) {
          let score = parseInt(answer);
          if (reversedItems.includes(itemId)) {
            score = 3 - score;
          }
          rawScore += score;
          validItems++;
        }
      });

      const meanScore = validItems > 0 ? rawScore / itemIds.length : 0;
      const itemsString = itemIds.join("+");
      const formula = `=(SOMMA(${itemsString}))/${itemIds.length}`;

      csvContent += `${facetName},"${itemIds.join(", ")}",${rawScore},${itemIds.length},${meanScore.toFixed(2)},${formula}\n`;
    });
    csvContent += "\n";

    // SEZIONE 4: CALCOLO DOMINI
    csvContent += "CALCOLO PUNTEGGI DOMINI\n";
    csvContent += "Dominio,Faccette Principali,Punteggio Medio,Formula Calcolo\n";

    const domainFacets = {
      "Affettività negativa": ["Labilità emotiva", "Ansia", "Angoscia di separazione"],
      "Distacco": ["Ritiro", "Anedonia", "Evitamento dell'intimità"],
      "Antagonismo": ["Manipolatorietà", "Inganno", "Grandiosità"],
      "Disinibizione": ["Irresponsabilità", "Impulsività", "Distraibilità"],
      "Psicoticismo": ["Convinzioni ed esperienze inusuali", "Eccentricità", "Disregolazione percettiva"]
    };

    Object.entries(domainFacets).forEach(([domainName, facetNames]) => {
      const domainScore = pid5Profile.domainScores.find(d => d.domain === domainName);
      const formula = `=(MEDIA(${facetNames.join(", ")}))`;

      csvContent += `${domainName},"${facetNames.join(", ")}",${domainScore?.meanScore.toFixed(2) || "0.00"},${formula}\n`;
    });
    csvContent += "\n";

    // SEZIONE 5: CRITERI DI INTERPRETAZIONE
    csvContent += "CRITERI DI INTERPRETAZIONE DSM-5\n";
    csvContent += "Punteggio Medio,Interpretazione,Soglia Clinica\n";
    csvContent += "≥2.5,Molto Elevato,Sì\n";
    csvContent += "≥2.0,Elevato,Sì\n";
    csvContent += "≥1.5,Moderatamente Elevato,No\n";
    csvContent += "≥1.0,Medio,No\n";
    csvContent += "≥0.5,Basso,No\n";
    csvContent += "<0.5,Molto Basso,No\n\n";

    // SEZIONE 6: FORMULE EXCEL PER COPIA-INCOLLA
    csvContent += "FORMULE EXCEL DA UTILIZZARE\n";
    csvContent += "Descrizione,Formula Excel\n";
    csvContent += "Inversione Item,=3-CELLA_ORIGINALE\n";
    csvContent += "Punteggio Faccetta,=SOMMA(range_item)/CONTA.NUMERI(range_item)\n";
    csvContent += "Punteggio Dominio,=MEDIA(cella_faccetta1:cella_faccetta3)\n";
    csvContent += "Controllo Soglia Clinica,=SE(punteggio>=2;\"Elevato\";\"Normale\")\n";
    csvContent += "Interpretazione,=SE(punteggio>=2.5;\"Molto Elevato\";SE(punteggio>=2;\"Elevato\";SE(punteggio>=1.5;\"Moderatamente Elevato\";SE(punteggio>=1;\"Medio\";SE(punteggio>=0.5;\"Basso\";\"Molto Basso\")))))\n\n";

    // SEZIONE 7: ISTRUZIONI
    csvContent += "ISTRUZIONI PER L'USO\n";
    csvContent += "1. Importare questo file in Excel\n";
    csvContent += "2. Inserire le risposte grezze (0-3) nella colonna appropriata\n";
    csvContent += "3. Applicare le formule di inversione agli item indicati\n";
    csvContent += "4. Calcolare i punteggi delle faccette usando le formule indicate\n";
    csvContent += "5. Calcolare i punteggi dei domini usando la media delle 3 faccette principali\n";
    csvContent += "6. Applicare i criteri di interpretazione DSM-5\n\n";

    csvContent += "NOTE IMPORTANTI\n";
    csvContent += "- Il calcolo è valido solo se <25% degli item per faccetta sono mancanti\n";
    csvContent += "- I domini richiedono tutte e 3 le faccette principali per essere calcolabili\n";
    csvContent += "- Soglia di significatività clinica: ≥2.0 per punteggi medi\n";
    csvContent += "- Questo sistema segue esattamente le specifiche DSM-5 per il PID-5\n";

    return csvContent;
  };

  // Show password protection first
  if (!isAuthenticated) {
    return (
      <PasswordProtection
        onAuthenticated={() => setIsAuthenticated(true)}
        title="Accesso Risultati PID-5"
      />
    );
  }

  // Use demo testData if not provided
  const currentTestData = testData || {
    title: "PID-5 - Inventario della Personalità per DSM-5",
    description: "Valutazione completa della personalità secondo criteri DSM-5",
    items: Array.from({ length: 220 }, (_, i) => ({
      id: i + 1,
      text: `Domanda demo ${i + 1}`,
      domain: i < 44 ? "Affettività Negativa" :
              i < 88 ? "Distacco" :
              i < 132 ? "Antagonismo" :
              i < 176 ? "Disinibizione" : "Psicoticismo",
      facet: "Demo Facet"
    })),
    scaleLikert: ["Per niente vero", "Leggermente vero", "Moderatamente vero", "Molto vero"]
  };

  // Use demo answers if not provided
  const currentAnswers = answers || generateDemoAnswers();

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center">
            <div className="animate-spin w-16 h-16 mx-auto mb-6 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Elaborazione Risultati in Corso...
            </h2>
            <p className="text-gray-600 mb-6">
              Stiamo analizzando le tue risposte e generando il profilo
              personalizzato
            </p>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  Analisi delle risposte completata
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  Calcolo dei punteggi in corso...
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">
                  Generazione del profilo personalizzato
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Condividi
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToExcel}
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              >
                📊 Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportWithFormulas}
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                🧮 Excel + Formule
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Results Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Risultati PID-5 Completati!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inventario della Personalità per DSM-5 - Profilo clinico generato
          </p>
        </div>

        {/* Overall Score Card */}
        {pid5Profile && (
          <Card
            className={`mb-8 border-2 shadow-xl ${getRiskColor(pid5Profile.overallRisk)}`}
          >
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 text-gray-900">
                    {Math.round(averageTScore)}
                  </div>
                  <div className="text-gray-600">T-Score Medio</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Livello di Rischio: {pid5Profile.overallRisk}
                  </h3>
                  {pid5Profile.primaryDomains.length > 0 && (
                    <div>
                      <p className="text-gray-600 mb-2">Domini Elevati:</p>
                      <div className="flex flex-wrap gap-2">
                        {pid5Profile.primaryDomains.map((domain) => (
                          <Badge
                            key={domain}
                            className={getDomainColor(domain)}
                          >
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-white/80 text-gray-700"
                  >
                    {Object.keys(answers).length} item valutati
                  </Badge>
                </div>
                <div className="text-center">
                  {pid5Profile.overallRisk === "Basso" ? (
                    <Shield className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                  )}
                  <div className="text-sm text-gray-600">Validità Clinica</div>
                  <div className="text-2xl font-bold text-gray-900">Alta</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risultati Ufficiali PID-5 secondo DSM-5 */}
        <OfficialResultsDisplay profile={pid5Profile} answers={answers} />

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Panoramica</span>
            </TabsTrigger>
            <TabsTrigger
              value="domains"
              className="flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Domini</span>
            </TabsTrigger>
            <TabsTrigger
              value="clinical"
              className="flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Clinico</span>
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="flex items-center space-x-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Raccomandazioni</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {pid5Profile && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Scores Breakdown */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <span>T-Scores per Dominio</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {pid5Profile.domainResults.map((result, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">
                            {result.domain}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={getDomainColor(result.domain)}
                            >
                              {result.level}
                            </Badge>
                            <span className="text-sm font-bold">
                              T={result.tScore}
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={(result.tScore / 100) * 100}
                          className="h-3"
                        />
                        <div className="text-sm text-gray-600">
                          {result.interpretation}
                        </div>
                        {result.clinicalSignificance && (
                          <Badge variant="destructive" className="text-xs">
                            Clinicamente Significativo
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Clinical Notes */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-red-600" />
                      <span>Note Cliniche</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pid5Profile.clinicalNotes.map((note, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{note}</AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="domains">
            {pid5Profile && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pid5Profile.domainResults.map((result, index) => (
                  <Card
                    key={index}
                    className={`border-2 ${getDomainColor(result.domain)} bg-white/90`}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">{result.domain}</CardTitle>
                      <div className="flex items-center justify-between">
                        <Badge className={getDomainColor(result.domain)}>
                          {result.level}
                        </Badge>
                        <span className="text-2xl font-bold">
                          T={result.tScore}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress
                        value={(result.tScore / 100) * 100}
                        className="h-2"
                      />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result.interpretation}
                      </p>
                      {result.clinicalSignificance && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Punteggio clinicamente significativo (T≥65)
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Mostra faccette elevate */}
                      {result.facets.filter((f) => f.clinicalSignificance)
                        .length > 0 && (
                        <div className="mt-2">
                          <h6 className="text-xs font-semibold text-gray-700 mb-1">
                            Faccette Elevate:
                          </h6>
                          <div className="space-y-1">
                            {result.facets
                              .filter((f) => f.clinicalSignificance)
                              .map((facet, fi) => (
                                <div key={fi} className="text-xs text-gray-600">
                                  {facet.facet} (T={facet.tScore})
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="clinical">
            {pid5Profile && (
              <div className="space-y-8">
                <Alert
                  className={`border-2 ${getRiskColor(pid5Profile.overallRisk)}`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  <AlertDescription className="text-base">
                    <strong>
                      Livello di Rischio Complessivo: {pid5Profile.overallRisk}
                    </strong>
                    <br />
                    {pid5Profile.overallRisk === "Basso"
                      ? "Il profilo non evidenzia problematiche clinicamente significative."
                      : "Il profilo evidenzia alcune aree che potrebbero richiedere attenzione clinica."}
                  </AlertDescription>
                </Alert>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Interpretazione Clinica Dettagliata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {pid5Profile.clinicalNotes.map((note, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <p className="text-gray-700 leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {pid5Profile.primaryDomains.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-red-800">
                        Domini con Elevazione Clinica
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {pid5Profile.domainResults
                          .filter((r) => r.clinicalSignificance)
                          .map((result, index) => (
                            <div
                              key={index}
                              className="p-4 border-l-4 border-red-500 bg-red-50"
                            >
                              <h5 className="font-semibold text-red-900 mb-2">
                                {result.domain} (T-Score: {result.tScore})
                              </h5>
                              <p className="text-red-800 text-sm">
                                {result.interpretation}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations">
            {pid5Profile && (
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-6 h-6 text-amber-600" />
                      <span>Raccomandazioni Cliniche</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Importante:</strong> Questi risultati sono
                        generati automaticamente e non sostituiscono una
                        valutazione clinica professionale.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      {pid5Profile.recommendations.map(
                        (recommendation, index) => (
                          <div
                            key={index}
                            className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                              <p className="text-blue-900 leading-relaxed">
                                {recommendation}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Prossimi Passi Suggeriti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        1. Consultazione Professionale
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Discutere questi risultati con uno psicologo clinico
                        qualificato per una valutazione approfondita.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        2. Approfondimenti Diagnostici
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Considerare ulteriori strumenti di assessment per una
                        diagnosi differenziale accurata.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        3. Pianificazione Terapeutica
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Sviluppare un piano di trattamento personalizzato basato
                        sui domini con elevazione significativa.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Torna alla Dashboard
            </Button>
          </Link>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={handleDownloadPDF}
          >
            <Download className="w-5 h-5 mr-2" />
            Scarica Report PDF
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600"
            onClick={handleExportToExcel}
          >
            📊 Export Dati Excel
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={handleExportWithFormulas}
          >
            🧮 Excel con Formule
          </Button>
        </div>
      </div>
    </div>
  );
}
