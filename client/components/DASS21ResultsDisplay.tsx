import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  Heart,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import type { DASS21Profile } from "@/utils/dass21-scoring";

interface DASS21ResultsDisplayProps {
  profile: DASS21Profile;
}

export default function DASS21ResultsDisplay({
  profile,
}: DASS21ResultsDisplayProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "normale":
        return "bg-green-100 text-green-800 border-green-200";
      case "lieve":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "moderato":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "severo":
        return "bg-red-100 text-red-800 border-red-200";
      case "estremamente severo":
        return "bg-red-200 text-red-900 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "normale":
        return <CheckCircle className="w-5 h-5" />;
      case "lieve":
      case "moderato":
        return <AlertTriangle className="w-5 h-5" />;
      case "severo":
      case "estremamente severo":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getSubscaleIcon = (subscaleName: string) => {
    switch (subscaleName.toLowerCase()) {
      case "depressione":
        return <Heart className="w-6 h-6" />;
      case "ansia":
        return <Brain className="w-6 h-6" />;
      case "stress":
        return <Zap className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Test Info Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                {profile.testInfo.name}
              </h2>
              <p className="text-blue-700 text-sm">
                Completato il {profile.testInfo.date} • Durata:{" "}
                {profile.testInfo.duration}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Overall Summary */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <span>Punteggio Totale</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-indigo-900">
              {profile.totalScore.score}
            </div>
            <Badge
              variant="secondary"
              className={`text-lg px-4 py-2 ${getSeverityColor(profile.totalScore.severity)}`}
            >
              {profile.totalScore.severity}
            </Badge>
            <p className="text-gray-600">{profile.totalScore.interpretation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Subscales Results */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(profile.subscales).map(([key, subscale]) => (
          <Card key={key} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    key === "depression"
                      ? "bg-red-100"
                      : key === "anxiety"
                        ? "bg-yellow-100"
                        : "bg-purple-100"
                  }`}
                >
                  {getSubscaleIcon(subscale.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{subscale.name}</h3>
                  <p className="text-sm text-gray-500">
                    {subscale.items.length} item
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {subscale.score}
                </div>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Badge
                    variant="secondary"
                    className={`${getSeverityColor(subscale.severity)} flex items-center space-x-1`}
                  >
                    {getSeverityIcon(subscale.severity)}
                    <span>{subscale.severity}</span>
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Percentile</span>
                  <span className="font-medium">{subscale.percentile}°</span>
                </div>
                <Progress value={subscale.percentile || 0} className="h-2" />
              </div>

              <p className="text-sm text-gray-600">{subscale.interpretation}</p>

              <details className="text-xs">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Item utilizzati
                </summary>
                <p className="mt-2 text-gray-500">
                  {subscale.items.join(", ")}
                </p>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Clinical Notes */}
      {profile.clinicalNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Note Cliniche</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.clinicalNotes.map((note, index) => (
                <Alert key={index} className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    {note}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {profile.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Raccomandazioni</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.recommendations.map((rec, index) => (
                <Alert key={index} className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {rec}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reference Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Informazioni di Riferimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>DASS-21</strong> è una versione ridotta della Depression
              Anxiety Stress Scale, validata per la popolazione italiana
              (Bottesi et al., 2015).
            </p>
            <p>
              <strong>Interpretazione:</strong> I punteggi sono confrontati con
              norme di popolazione generale italiana. Punteggi elevati indicano
              livelli significativi di distress.
            </p>
            <p>
              <strong>Uso clinico:</strong> Questo strumento è utile per
              screening e monitoraggio, ma non sostituisce una valutazione
              clinica completa.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
