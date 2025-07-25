import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  Play,
} from "lucide-react";

export default function Index() {
  const [activeTests] = useState([
    {
      id: 1,
      title:
        "PID-5 - Inventario della Personalità per DSM-5 (Versione Completa)",
      description:
        "Strumento completo di valutazione dei tratti di personalità maladattivi con 220 item secondo il modello dimensionale del DSM-5",
      duration: "40-45 min",
      questions: 220,
      completions: 847,
      category: "Clinico",
      difficulty: "Professionale",
    },
    {
      id: 2,
      title: "Assessment Intelligenza Emotiva",
      description: "Misura le competenze emotive e relazionali",
      duration: "10-15 min",
      questions: 40,
      completions: 892,
      category: "Emozioni",
      difficulty: "Facile",
    },
    {
      id: 3,
      title: "Test Orientamento Professionale",
      description: "Scopri le carriere più adatte alle tue attitudini",
      duration: "20-25 min",
      questions: 80,
      completions: 2156,
      category: "Carriera",
      difficulty: "Avanzato",
    },
  ]);

  const stats = [
    { icon: ClipboardList, label: "Test Disponibili", value: "15+" },
    { icon: Users, label: "Utenti Attivi", value: "12.5K" },
    { icon: BarChart3, label: "Test Completati", value: "45.2K" },
    { icon: CheckCircle, label: "Accuratezza", value: "94%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TestPro</h1>
                <p className="text-sm text-gray-600">
                  Piattaforma di Assessment Professionale
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Sistema Attivo
              </Badge>
              <Button variant="outline" size="sm">
                Dashboard Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Somministrazione Test
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Professionale Online
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Piattaforma avanzata per l'amministrazione di test psicologici e
              di valutazione con elaborazione automatica dei risultati e
              reportistica dettagliata.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Test Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTests.map((test) => (
              <Card
                key={test.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className={`${
                        test.category === "Clinico"
                          ? "bg-red-100 text-red-800"
                          : test.category === "Emozioni"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {test.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {test.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {test.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{test.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {test.questions} domande
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completamenti</span>
                      <span className="font-medium">
                        {test.completions.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <Link to={`/test/${test.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group">
                      <Play className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      Inizia Test
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Pronto per iniziare la valutazione?
                </h3>
                <p className="text-blue-100 mb-6">
                  Scegli un test dalla lista sopra e ricevi risultati
                  dettagliati con analisi personalizzata e suggerimenti
                  professionali.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/results">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-50"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Visualizza Risultati
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Scopri di Più
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
