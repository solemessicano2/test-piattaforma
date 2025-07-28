import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";
import OfficialResultsDisplay from "@/components/OfficialResultsDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  processOfficialPID5Results,
  type PID5OfficialProfile,
} from "@/utils/pid5-official-scoring";
import { ExcelGenerator } from "@/utils/excel-generator";
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Shield,
  Cloud,
  FileSpreadsheet,
} from "lucide-react";

export default function ResultsPage() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [pid5Profile, setPid5Profile] = useState<PID5OfficialProfile | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get data from navigation state
  const { answers, testData } = location.state || {};

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      try {
        let answersToProcess = answers;

        if (!answers) {
          // Generate simple demo data if no answers provided
          answersToProcess = {};
          for (let i = 1; i <= 220; i++) {
            // Simple random pattern
            const score = Math.floor(Math.random() * 4);
            answersToProcess[i] = score.toString();
          }
        }

        const profile = processOfficialPID5Results(answersToProcess);
        setPid5Profile(profile);
      } catch (error) {
        console.error("Error processing results:", error);
      }
      setIsProcessing(false);
    }, 1000); // Ridotto a 1 secondo per test più rapidi
    return () => clearTimeout(timer);
  }, [answers]);

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

  // Auto-upload on results completion (only for real test results, not demo)
  useEffect(() => {
    console.log('Auto-upload effect triggered:', {
      hasPid5Profile: !!pid5Profile,
      hasAnswers: !!answers,
      isUploading
    });

    if (pid5Profile && answers && !isUploading) {
      console.log('Starting auto-upload timer...');
      toast({
        title: "Auto-upload programmato",
        description: "I risultati verranno salvati automaticamente su Drive tra 2 secondi"
      });

      // Auto-upload to Drive when results are ready (only for real tests)
      const timer = setTimeout(() => {
        console.log('Executing auto-upload...');
        handleUploadToDrive();
      }, 2000); // Wait 2 seconds after results are ready

      return () => {
        console.log('Cleaning up auto-upload timer');
        clearTimeout(timer);
      };
    }
  }, [pid5Profile, answers]);

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
    try {
      const printContent = generatePrintableHTML();
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        toast({
          title: "Errore",
          description:
            "Impossibile aprire la finestra di stampa. Controlla le impostazioni del browser.",
          variant: "destructive",
        });
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      toast({
        title: "PDF Generato",
        description: "Il report PDF è stato aperto per la stampa/salvataggio",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Errore PDF",
        description: "Errore nella generazione del PDF",
        variant: "destructive",
      });
    }
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

        <div class="risk-level risk-${pid5Profile.overallSeverity.toLowerCase().replace(" ", "-")}">
          Severità Complessiva: ${pid5Profile.overallSeverity}
        </div>

        <h2>Risultati per Domini</h2>
        ${pid5Profile.domainScores
          .map(
            (domain) => `
          <div class="domain-result">
            <div class="domain-title">${domain.domain} (Punteggio: ${domain.meanScore.toFixed(2)})</div>
            <p><strong>Interpretazione:</strong> ${domain.interpretation}</p>
            ${
              domain.facets.filter((f) => f.meanScore >= 2.0).length > 0
                ? `
              <div class="facet-list">
                <strong>Faccette Clinicamente Elevate:</strong>
                <ul>
                  ${domain.facets
                    .filter((f) => f.meanScore >= 2.0)
                    .map(
                      (facet) => `
                    <li>${facet.facet} (${facet.meanScore.toFixed(2)})</li>
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
    if (!pid5Profile) return;

    try {
      const workbook = ExcelGenerator.generateResultsWorkbook({
        profile: pid5Profile,
        answers: currentAnswers,
        includeFormulas: false,
      });

      const fileName = `PID5_Risultati_${new Date().toLocaleDateString("it-IT").replace(/\//g, "-")}.xlsx`;
      ExcelGenerator.downloadExcel(fileName, workbook);

      toast({
        title: "Excel Scaricato",
        description: "Il file Excel con i risultati è stato scaricato",
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Errore Excel",
        description: "Errore nell'esportazione Excel",
        variant: "destructive",
      });
    }
  };

  const handleExportWithFormulas = () => {
    if (!pid5Profile) return;

    try {
      const workbook = ExcelGenerator.generateResultsWorkbook({
        profile: pid5Profile,
        answers: currentAnswers,
        includeFormulas: true,
      });

      const fileName = `PID5_Con_Formule_${new Date().toLocaleDateString("it-IT").replace(/\//g, "-")}.xlsx`;
      ExcelGenerator.downloadExcel(fileName, workbook);

      toast({
        title: "Excel con Formule Scaricato",
        description: "Il file Excel con formule di calcolo è stato scaricato",
      });
    } catch (error) {
      console.error("Excel with formulas export error:", error);
      toast({
        title: "Errore Excel",
        description: "Errore nell'esportazione Excel con formule",
        variant: "destructive",
      });
    }
  };

  const testDriveConnection = async () => {
    try {
      setIsUploading(true);

      // Test with simple JSON first
      const testData = {
        test: "connection",
        timestamp: new Date().toISOString()
      };

      const response = await fetch("/api/drive/upload-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: testData,
          fileName: `Test_Connection_${Date.now()}.json`
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Drive API Error:', error);
        throw new Error(`HTTP ${response.status}: ${error}`);
      }

      const result = await response.json();
      console.log('Drive upload success:', result);

      toast({
        title: "Test Connessione Riuscito",
        description: `File di test caricato: ${result.fileName}`,
      });
    } catch (error) {
      console.error("Drive connection test failed:", error);
      toast({
        title: "Errore Connessione Drive",
        description: `Errore: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadToDrive = async () => {
    if (!pid5Profile) return;

    setIsUploading(true);
    try {
      // Generate Excel file
      const workbook = ExcelGenerator.generateResultsWorkbook({
        profile: pid5Profile,
        answers: currentAnswers,
        includeFormulas: true,
      });

      const buffer = ExcelGenerator.generateBuffer(workbook);
      const fileName = `PID5_Risultati_${new Date().toLocaleDateString("it-IT").replace(/\//g, "-")}_${Date.now()}.xlsx`;

      // Create FormData for upload
      const formData = new FormData();
      const file = new File([buffer], fileName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      formData.append("file", file);
      formData.append("fileName", fileName);

      // Upload to Google Drive
      const response = await fetch("/api/drive/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      toast({
        title: "Upload Completato",
        description: `File salvato su Google Drive: ${result.fileName}`,
      });

      // Also upload JSON summary
      await uploadJSONToDrive();
    } catch (error) {
      console.error("Drive upload error:", error);
      toast({
        title: "Errore Upload",
        description: "Errore nell'upload su Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadJSONToDrive = async () => {
    if (!pid5Profile) return;

    try {
      const summaryData = {
        timestamp: new Date().toISOString(),
        testType: "PID-5",
        overallSeverity: pid5Profile.overallSeverity,
        domainScores: pid5Profile.domainScores.map((domain) => ({
          domain: domain.domain,
          meanScore: domain.meanScore,
          interpretation: domain.interpretation,
          clinicallyElevated: domain.meanScore >= 2.0,
        })),
        elevatedFacets: pid5Profile.facetScores
          .filter((f) => f.meanScore >= 2.0)
          .map((facet) => ({
            facet: facet.facet,
            meanScore: facet.meanScore,
            interpretation: facet.interpretation,
          })),
        clinicalNotes: pid5Profile.clinicalNotes,
        recommendations: pid5Profile.recommendations,
        rawAnswers: currentAnswers,
      };

      const fileName = `PID5_Summary_${new Date().toLocaleDateString("it-IT").replace(/\//g, "-")}_${Date.now()}.json`;

      await fetch("/api/drive/upload-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: summaryData,
          fileName,
        }),
      });
    } catch (error) {
      console.error("JSON upload error:", error);
    }
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

  // Simple demo data
  const demoAnswers: Record<number, string> = {};
  if (!answers) {
    for (let i = 1; i <= 220; i++) {
      demoAnswers[i] = Math.floor(Math.random() * 4).toString();
    }
  }

  const currentAnswers = answers || demoAnswers;
  const currentTestData = testData || {
    title: "PID-5 Demo",
    items: Array.from({ length: 220 }, (_, i) => ({
      id: i + 1,
      text: `Domanda ${i + 1}`,
      domain: "Demo",
      facet: "Demo",
    })),
    scaleLikert: ["Per niente", "Poco", "Moderatamente", "Molto"],
  };

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
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadToDrive}
                disabled={isUploading}
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                <Cloud className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Salva su Drive"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testDriveConnection}
                disabled={isUploading}
                className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
              >
                🧪 Test Drive
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
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportWithFormulas}
                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              >
                🧮 Excel + Formule
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Demo Banner */}
        {!answers && (
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-yellow-800 font-semibold">
                    Risultati Demo
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    Questi sono risultati di esempio generati automaticamente.
                    Per ottenere risultati reali, completa prima il test PID-5.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auto-upload Banner */}
        {answers && isUploading && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Cloud className="w-6 h-6 text-blue-600 animate-pulse" />
                <div>
                  <h3 className="text-blue-800 font-semibold">
                    Upload Automatico in Corso
                  </h3>
                  <p className="text-blue-700 text-sm">
                    I risultati vengono salvati automaticamente su Google
                    Drive...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {!answers ? "Risultati PID-5 Demo" : "Risultati PID-5 Completati!"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inventario della Personalità per DSM-5 - Profilo clinico generato
          </p>
        </div>

        {/* Overall Score Card */}
        {pid5Profile && (
          <Card
            className={`mb-8 border-2 shadow-xl ${getRiskColor(pid5Profile.overallSeverity)}`}
          >
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 text-gray-900">
                    {averageMeanScore.toFixed(2)}
                  </div>
                  <div className="text-gray-600">Punteggio Medio</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Severità: {pid5Profile.overallSeverity}
                  </h3>
                  {pid5Profile.domainScores.filter((d) => d.meanScore >= 2.0)
                    .length > 0 && (
                    <div>
                      <p className="text-gray-600 mb-2">Domini Elevati:</p>
                      <div className="flex flex-wrap gap-2">
                        {pid5Profile.domainScores
                          .filter((d) => d.meanScore >= 2.0)
                          .map((domain) => (
                            <Badge
                              key={domain.domain}
                              className={getDomainColor(domain.domain)}
                            >
                              {domain.domain}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-white/80 text-gray-700"
                  >
                    {Object.keys(currentAnswers).length} item valutati
                  </Badge>
                </div>
                <div className="text-center">
                  {pid5Profile.overallSeverity === "Basso" ||
                  pid5Profile.overallSeverity === "Molto Basso" ? (
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
        <OfficialResultsDisplay
          profile={pid5Profile}
          answers={currentAnswers}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Torna alla Dashboard
            </Button>
          </Link>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600"
            onClick={handleUploadToDrive}
            disabled={isUploading}
          >
            <Cloud className="w-5 h-5 mr-2" />
            {isUploading ? "Uploading..." : "Salva su Google Drive"}
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600"
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
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Export Excel
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600"
            onClick={handleExportWithFormulas}
          >
            🧮 Excel con Formule
          </Button>
        </div>
      </div>
    </div>
  );
}
