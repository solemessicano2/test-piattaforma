import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart3
} from "lucide-react";

interface TestResult {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  interpretation: string;
  description: string;
}

interface PersonalityProfile {
  type: string;
  title: string;
  description: string;
  strengths: string[];
  areasForGrowth: string[];
  idealCareers: string[];
  workStyle: string;
}

export default function ResultsPage() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  
  // Get data from navigation state
  const { answers, testData } = location.state || {};

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mock results processing
  const processResults = (): TestResult[] => {
    if (!answers) return [];
    
    return [
      {
        category: "Estroversione",
        score: 7,
        maxScore: 10,
        percentage: 70,
        interpretation: "Moderatamente Estroverso",
        description: "Bilanci bene l'interazione sociale con il tempo per riflettere"
      },
      {
        category: "Intuizione",
        score: 8,
        maxScore: 10,
        percentage: 80,
        interpretation: "Altamente Intuitivo",
        description: "Preferisci guardare al quadro generale e alle possibilità future"
      },
      {
        category: "Pensiero",
        score: 6,
        maxScore: 10,
        percentage: 60,
        interpretation: "Equilibrato",
        description: "Combini logica e considerazioni emotive nelle decisioni"
      },
      {
        category: "Giudizio",
        score: 9,
        maxScore: 10,
        percentage: 90,
        interpretation: "Molto Organizzato",
        description: "Preferisci struttura, pianificazione e decisioni tempestive"
      }
    ];
  };

  const getPersonalityProfile = (): PersonalityProfile => {
    return {
      type: "ENTJ",
      title: "Il Comandante",
      description: "Leader naturale con una forte visione strategica e capacità di motivare gli altri verso obiettivi ambiziosi.",
      strengths: [
        "Leadership naturale",
        "Pensiero strategico",
        "Decisionalità",
        "Capacità organizzative",
        "Orientamento agli obiettivi"
      ],
      areasForGrowth: [
        "Pazienza con processi lenti",
        "Delega efficace",
        "Gestione dell'emotività altrui",
        "Flessibilità nei piani"
      ],
      idealCareers: [
        "CEO/Dirigente",
        "Consulente di strategia",
        "Project Manager",
        "Avvocato",
        "Imprenditore"
      ],
      workStyle: "Ama sfide complesse, preferisce autonomia decisionale e risponde bene a obiettivi chiari e ambiziosi."
    };
  };

  const results = processResults();
  const personalityProfile = getPersonalityProfile();
  const overallScore = results.reduce((sum, result) => sum + result.percentage, 0) / results.length;

  if (!answers || !testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Nessun risultato trovato</p>
            <Link to="/">
              <Button>Torna alla Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Stiamo analizzando le tue risposte e generando il profilo personalizzato
            </p>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Analisi delle risposte completata</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Calcolo dei punteggi in corso...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Generazione del profilo personalizzato</span>
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
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
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
            Risultati del Test Completati!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {testData.title} - Il tuo profilo personalizzato è pronto
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{Math.round(overallScore)}%</div>
                <div className="text-blue-100">Punteggio Complessivo</div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Il tuo tipo: {personalityProfile.type}</h3>
                <p className="text-blue-100">{personalityProfile.title}</p>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {Object.keys(answers).length} risposte analizzate
                </Badge>
              </div>
              <div className="text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-blue-200" />
                <div className="text-sm text-blue-100">Affidabilità Analisi</div>
                <div className="text-2xl font-bold">94%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Panoramica</span>
            </TabsTrigger>
            <TabsTrigger value="personality" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Personalità</span>
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Carriera</span>
            </TabsTrigger>
            <TabsTrigger value="development" className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>Sviluppo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Scores Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Analisi per Categoria</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {results.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{result.category}</span>
                        <Badge variant="outline">{result.interpretation}</Badge>
                      </div>
                      <Progress value={result.percentage} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{result.description}</span>
                        <span className="font-medium">{result.score}/{result.maxScore}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Insights */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span>Insight Principali</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-900">Stile Cognitivo</div>
                        <div className="text-sm text-blue-700">Pensatore strategico con focus sui risultati</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-green-900">Dinamiche Sociali</div>
                        <div className="text-sm text-green-700">Leader naturale, ispira fiducia negli altri</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <div className="font-medium text-purple-900">Gestione Emotiva</div>
                        <div className="text-sm text-purple-700">Decisioni basate su logica e obiettivi</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personality">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Profilo di Personalità: {personalityProfile.type}</CardTitle>
                <p className="text-gray-600 text-lg">{personalityProfile.title}</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {personalityProfile.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Punti di Forza</span>
                    </h4>
                    <ul className="space-y-2">
                      {personalityProfile.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Aree di Crescita</span>
                    </h4>
                    <ul className="space-y-2">
                      {personalityProfile.areasForGrowth.map((area, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <span>Orientamento Professionale</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Stile di Lavoro Ideale</h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {personalityProfile.workStyle}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Carriere Consigliate</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personalityProfile.idealCareers.map((career, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="font-medium text-gray-900">{career}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
                  <span>Piano di Sviluppo Personale</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                      <h5 className="font-semibold text-blue-900 mb-3">A Breve Termine (1-3 mesi)</h5>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Praticare l'ascolto attivo</li>
                        <li>• Sviluppare pazienza con i processi</li>
                        <li>• Delegare piccole responsabilità</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6">
                      <h5 className="font-semibold text-green-900 mb-3">Medio Termine (3-6 mesi)</h5>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• Corso di leadership emotiva</li>
                        <li>• Mentoring di colleghi junior</li>
                        <li>• Feedback a 360 gradi</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                    <CardContent className="p-6">
                      <h5 className="font-semibold text-purple-900 mb-3">Lungo Termine (6+ mesi)</h5>
                      <ul className="space-y-2 text-sm text-purple-800">
                        <li>• Executive coaching</li>
                        <li>• Progetti di trasformazione</li>
                        <li>• Leadership strategica</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Esplora Altri Test
            </Button>
          </Link>
          <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600">
            <Download className="w-5 h-5 mr-2" />
            Scarica Report Completo
          </Button>
        </div>
      </div>
    </div>
  );
}
