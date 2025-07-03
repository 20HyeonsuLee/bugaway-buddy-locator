
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Loader2, Bug } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock bug identification data
const mockBugData = [
  {
    id: 1,
    name: "바퀴벌레",
    scientificName: "Blattella germanica",
    dangerLevel: "높음",
    description: "주방이나 화장실 등 습한 곳에서 주로 발견되는 해충입니다.",
    treatments: [
      "붕산 가루를 틈새에 뿌리기",
      "바퀴벌레 전용 살충제 사용",
      "습도 조절 및 청결 유지",
      "음식물 밀폐 보관"
    ],
    prevention: "틈새 차단, 물기 제거, 정기적인 청소",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "러브버그",
    scientificName: "Plecia nearctica",
    dangerLevel: "낮음",
    description: "봄철에 대량 발생하는 작은 검은 벌레입니다.",
    treatments: [
      "창문 방충망 점검",
      "LED 조명으로 교체 (유인 효과 감소)",
      "진공청소기로 제거",
      "자연적 소멸 대기"
    ],
    prevention: "방충망 설치, 조명 조절",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "집먼지진드기",
    scientificName: "Dermatophagoides pteronyssinus",
    dangerLevel: "중간",
    description: "침구류와 카펫에서 서식하며 알레르기를 유발할 수 있습니다.",
    treatments: [
      "60도 이상 뜨거운 물로 침구 세탁",
      "진드기 전용 청소기 사용",
      "습도 50% 이하 유지",
      "항알레르기 침구 사용"
    ],
    prevention: "정기적인 침구 교체, 습도 관리",
    image: "/placeholder.svg"
  }
];

interface ImageUploadProps {
  onImageAnalyzed: (bugData: any) => void;
}

const ImageUpload = ({ onImageAnalyzed }: ImageUploadProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      // Simulate AI analysis
      analyzeImage();
    }
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return random mock bug data
    const randomBug = mockBugData[Math.floor(Math.random() * mockBugData.length)];
    
    setIsAnalyzing(false);
    onImageAnalyzed(randomBug);
    
    toast({
      title: "분석 완료!",
      description: `${randomBug.name}로 식별되었습니다.`,
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto border-green-100 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {uploadedImage ? (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="업로드된 벌레 사진"
                className="w-full h-48 object-cover rounded-lg border border-green-200"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>AI가 분석 중입니다...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50/50">
              <Bug className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                벌레 사진을 업로드하거나<br />
                카메라로 촬영하세요
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="flex space-x-2">
            <Button 
              onClick={triggerFileInput} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isAnalyzing}
            >
              <Upload className="w-4 h-4 mr-2" />
              사진 업로드
            </Button>
            <Button 
              onClick={triggerFileInput} 
              variant="outline" 
              className="flex-1 border-green-300 hover:bg-green-50"
              disabled={isAnalyzing}
            >
              <Camera className="w-4 h-4 mr-2" />
              카메라
            </Button>
          </div>

          {isAnalyzing && (
            <div className="text-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              AI 분석 중... (약 5초 소요)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
