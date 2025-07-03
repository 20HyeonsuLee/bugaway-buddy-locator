
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, AlertTriangle, MessageCircle, Star } from "lucide-react";

// Mock user experiences data
const mockUserExperiences = [
  {
    id: 1,
    username: "서울시_관악구",
    rating: 5,
    date: "2024-01-15",
    content: "붕산 가루 정말 효과적이에요! 일주일 만에 완전 사라졌습니다.",
    helpful: 12,
    method: "붕산 가루"
  },
  {
    id: 2,
    username: "청소의_달인",
    rating: 4,
    date: "2024-01-10",
    content: "전용 살충제보다는 예방이 더 중요한 것 같아요. 틈새 차단이 핵심!",
    helpful: 8,
    method: "예방 중심"
  },
  {
    id: 3,
    username: "원룸_생활자",
    rating: 3,
    date: "2024-01-08",
    content: "처음엔 무서웠는데 차근차근 대응하니까 괜찮더라고요.",
    helpful: 5,
    method: "단계별 대응"
  }
];

interface BugIdentificationProps {
  bugData: {
    id: number;
    name: string;
    scientificName: string;
    dangerLevel: string;
    description: string;
    treatments: string[];
    prevention: string;
    image: string;
  };
}

const BugIdentification = ({ bugData }: BugIdentificationProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const getDangerColor = (level: string) => {
    switch (level) {
      case "높음": return "destructive";
      case "중간": return "secondary";
      case "낮음": return "default";
      default: return "default";
    }
  };

  const getDangerIcon = (level: string) => {
    switch (level) {
      case "높음": return <AlertTriangle className="w-4 h-4" />;
      case "중간": return <Shield className="w-4 h-4" />;
      case "낮음": return <Shield className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Bug Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{bugData.name}</CardTitle>
              <p className="text-sm text-gray-600 italic">{bugData.scientificName}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={isFavorited ? "text-red-500" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
              즐겨찾기
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getDangerColor(bugData.dangerLevel)} className="flex items-center space-x-1">
              {getDangerIcon(bugData.dangerLevel)}
              <span>위험도: {bugData.dangerLevel}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <img
              src={bugData.image}
              alt={bugData.name}
              className="w-full h-48 object-cover rounded-lg bg-gray-100"
            />
          </div>
          <p className="text-gray-700">{bugData.description}</p>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="treatment" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="treatment">퇴치 방법</TabsTrigger>
              <TabsTrigger value="prevention">예방법</TabsTrigger>
              <TabsTrigger value="experiences">사용자 후기</TabsTrigger>
            </TabsList>
            
            <TabsContent value="treatment" className="p-6">
              <h3 className="font-semibold mb-4">효과적인 퇴치 방법</h3>
              <ul className="space-y-3">
                {bugData.treatments.map((treatment, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{treatment}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="prevention" className="p-6">
              <h3 className="font-semibold mb-4">예방 수칙</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">{bugData.prevention}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="experiences" className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                다른 사용자들의 대응 경험
              </h3>
              <div className="space-y-4">
                {mockUserExperiences.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{exp.username}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < exp.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{exp.date}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{exp.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{exp.method}</Badge>
                      <span className="text-gray-500">도움됨 {exp.helpful}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BugIdentification;
