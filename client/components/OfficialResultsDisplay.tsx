import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, CheckCircle } from "lucide-react";
import type { PID5OfficialProfile } from "@/utils/pid5-official-scoring";

interface OfficialResultsDisplayProps {
  profile: PID5OfficialProfile;
  answers: Record<number, string>;
}

export default function OfficialResultsDisplay({
  profile,
  answers,
}: OfficialResultsDisplayProps) {
  const averageMeanScore =
    profile.domainScores.reduce((sum, d) => sum + d.meanScore, 0) /
    profile.domainScores.length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Molto Elevato":
        return "border-red-500 bg-red-50 text-red-800";
      case "Elevato":
        return "border-orange-500 bg-orange-50 text-orange-800";
      case "Moderatamente Elevato":
        return "border-yellow-500 bg-yellow-50 text-yellow-800";
      case "Medio":
        return "border-blue-500 bg-blue-50 text-blue-800";
      default:
        return "border-green-500 bg-green-50 text-green-800";
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case "Affettività negativa":
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

  return (
    <div className="space-y-8">
      {/* Punteggio Complessivo */}
      <Card
        className={`border-2 shadow-xl ${getSeverityColor(profile.overallSeverity)}`}
      >
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-gray-900">
                {averageMeanScore.toFixed(2)}
              </div>
              <div className="text-gray-600">Punteggio Medio Complessivo</div>
              <div className="text-sm text-gray-500">
                (Scala 0-3 secondo DSM-5)
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Severità: {profile.overallSeverity}
              </h3>
              {profile.domainScores.filter((d) => d.meanScore >= 2.0).length >
                0 && (
                <div>
                  <p className="text-gray-600 mb-2">Domini Elevati (≥2.0):</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.domainScores
                      .filter((d) => d.meanScore >= 2.0)
                      .map((domain) => (
                        <Badge
                          key={domain.domain}
                          className={getDomainColor(domain.domain)}
                        >
                          {domain.domain} ({domain.meanScore.toFixed(2)})
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              <Badge variant="secondary" className="bg-white/80 text-gray-700">
                {Object.keys(answers).length} item valutati
              </Badge>
            </div>
            <div className="text-center">
              {profile.overallSeverity === "Basso" ||
              profile.overallSeverity === "Molto Basso" ? (
                <Shield className="w-16 h-16 mx-auto mb-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-orange-600" />
              )}
              <div className="text-sm text-gray-600">Scoring DSM-5</div>
              <div className="text-2xl font-bold text-gray-900">Ufficiale</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risultati per Domini */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Risultati per Domini (Punteggi Medi DSM-5)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile.domainScores.map((domain, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {domain.domain}
                </span>
                <div className="flex items-center space-x-2">
                  <Badge className={getDomainColor(domain.domain)}>
                    {domain.interpretation}
                  </Badge>
                  <span className="text-lg font-bold">
                    {domain.meanScore.toFixed(2)}
                  </span>
                </div>
              </div>
              <Progress value={(domain.meanScore / 3) * 100} className="h-3" />
              <div className="text-sm text-gray-600">
                {domain.interpretation !==
                "Non calcolabile (faccette principali incomplete)" ? (
                  <>
                    <strong>Faccette principali:</strong>{" "}
                    {domain.facets.map((f) => f.facet).join(", ")}
                    <br />
                    <strong>Interpretazione:</strong> {domain.interpretation}
                  </>
                ) : (
                  domain.interpretation
                )}
              </div>
              {domain.meanScore >= 2.0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Punteggio clinicamente elevato (≥2.0) - Richiede attenzione
                    clinica
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Note Cliniche */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Note Cliniche (Basate su Scoring DSM-5)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.clinicalNotes.map((note, index) => (
            <Alert key={index} className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{note}</AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Raccomandazioni */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Raccomandazioni Cliniche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Questi risultati utilizzano il
              sistema di scoring ufficiale del DSM-5 e non sostituiscono una
              valutazione clinica professionale.
            </AlertDescription>
          </Alert>

          {profile.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-green-900 leading-relaxed">{rec}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Faccette Dettagliate */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Dettaglio Faccette (25 Tratti di Personalità)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.facetScores.map((facet, index) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                <div className="font-medium text-sm mb-1">{facet.facet}</div>
                <div className="text-xs text-gray-600 mb-2">
                  Punteggio: {facet.meanScore.toFixed(2)} (
                  {facet.interpretation})
                </div>
                <Progress value={(facet.meanScore / 3) * 100} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
