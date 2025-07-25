import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { PID5_COMPLETE, type PID5Item } from "@/data/pid5-complete";



export default function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get PID-5 complete test data
  const testData = PID5_COMPLETE;

  // Debug logging
  console.log('PID5_COMPLETE:', PID5_COMPLETE);
  console.log('testData:', testData);

  // Safety check
  if (!testData || !testData.items || testData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Errore nel caricamento del test</p>
            <Button onClick={() => navigate("/")}>Torna alla Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(time => time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < testData.items.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Navigate to results page with answers
    navigate(`/results/${testId}`, { state: { answers, testData } });
  };

  const currentQ = testData.items[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.items.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  // Safety check for currentQ
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Errore nel caricamento della domanda</p>
            <Button onClick={() => navigate("/")}>Torna alla Dashboard</Button>
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
              <span>Torna alla Dashboard</span>
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className={`font-mono font-medium ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge variant="secondary">
                {answeredQuestions}/{testData.questions.length} risposte
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Test Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{testData.title}</h1>
          <p className="text-gray-600">{testData.description}</p>
        </div>

        {/* Progress */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-blue-600">
                  {currentQuestion + 1}
                </span>
                <span className="text-gray-500">di {testData.items.length}</span>
              </div>
              <Badge variant="outline" className={`${
                currentQ.domain === 'Affettività Negativa' ? 'bg-red-50 text-red-700 border-red-200' :
                currentQ.domain === 'Distacco' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                currentQ.domain === 'Antagonismo' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                currentQ.domain === 'Disinibizione' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {currentQ.domain}
              </Badge>
            </div>
            <Progress value={progress} className="h-3 mb-2" />
            <div className="text-sm text-gray-600 text-right">
              {Math.round(progress)}% completato
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl leading-relaxed text-gray-900">
              {currentQ.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
              className="space-y-4"
            >
              {(testData.scaleLikert || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700 leading-relaxed">
                    <span className="font-medium text-blue-600 mr-2">{index}</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Precedente</span>
          </Button>

          <div className="flex items-center space-x-4">
            {answeredQuestions < testData.items.length && (
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {testData.items.length - answeredQuestions} domande rimanenti
                </span>
              </div>
            )}
            
            {answeredQuestions === testData.items.length && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Tutte le domande completate</span>
              </div>
            )}
          </div>

          {currentQuestion < testData.items.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <span>Successiva</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={answeredQuestions < testData.items.length}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Completa Test</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
