
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, AlertTriangle, Clock, User, Navigation } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock location-based bug reports data
const mockBugReports = [
  {
    id: 1,
    bugName: "바퀴벌레",
    location: "서울시 관악구 신림동",
    distance: "0.2km",
    reportTime: "2시간 전",
    reporter: "익명",
    description: "주방 싱크대 근처에서 발견",
    dangerLevel: "높음",
    lat: 37.4844,
    lng: 126.9291
  },
  {
    id: 2,
    bugName: "러브버그",
    location: "서울시 관악구 봉천동",
    distance: "0.5km",
    reportTime: "5시간 전",
    reporter: "관악구민",
    description: "창문 주변에 대량 발생",
    dangerLevel: "낮음",
    lat: 37.4826,
    lng: 126.9516
  },
  {
    id: 3,
    bugName: "집먼지진드기",
    location: "서울시 관악구 청룡동",
    distance: "0.8km",
    reportTime: "1일 전",
    reporter: "청룡동거주자",
    description: "침실 매트리스에서 알레르기 증상",
    dangerLevel: "중간",
    lat: 37.4751,
    lng: 126.9513
  },
  {
    id: 4,
    bugName: "바퀴벌레",
    location: "서울시 관악구 대학동",
    distance: "1.2km",
    reportTime: "1일 전",
    reporter: "대학생",
    description: "원룸 화장실에서 발견",
    dangerLevel: "높음",
    lat: 37.4601,
    lng: 126.9520
  }
];

const BugMap = () => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  const getDangerColor = (level: string) => {
    switch (level) {
      case "높음": return "#ef4444";
      case "중간": return "#f59e0b";
      case "낮음": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "높음": return "destructive";
      case "중간": return "secondary";
      case "낮음": return "default";
      default: return "default";
    }
  };

  const initializeMap = () => {
    if (!googleApiKey || !mapRef.current) return;

    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      (window as any).initMap = () => {
        createMap();
      };
      
      document.head.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    if (!mapRef.current) return;

    const center = { lat: 37.4583, lng: 126.9510 }; // Seoul National University area
    
    googleMapRef.current = new google.maps.Map(mapRef.current, {
      zoom: 14,
      center: center,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Add markers for bug reports
    mockBugReports.forEach((report) => {
      const marker = new google.maps.Marker({
        position: { lat: report.lat, lng: report.lng },
        map: googleMapRef.current,
        title: report.bugName,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getDangerColor(report.dangerLevel),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }
      });

      marker.addListener("click", () => {
        setSelectedReport(report);
      });
    });

    // Add current location marker
    new google.maps.Marker({
      position: center,
      map: googleMapRef.current,
      title: "현재 위치",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#3b82f6",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      }
    });

    setCurrentLocation(center);
    setShowApiKeyInput(false);
    
    toast({
      title: "지도가 로드되었습니다!",
      description: "주변 벌레 신고 사례를 확인해보세요.",
    });
  };

  const handleApiKeySubmit = () => {
    if (!googleApiKey.trim()) {
      toast({
        title: "API 키를 입력해주세요",
        description: "Google Maps API 키가 필요합니다.",
        variant: "destructive"
      });
      return;
    }
    initializeMap();
  };

  return (
    <div className="space-y-4">
      {/* API Key Input */}
      {showApiKeyInput && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Google Maps 연동
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                실제 지도를 보려면 Google Maps API 키가 필요합니다.
                <br />
                <a 
                  href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  여기서 API 키를 발급받으세요
                </a>
              </p>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Google Maps API 키를 입력하세요"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleApiKeySubmit} className="bg-blue-600 hover:bg-blue-700">
                  지도 로드
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center text-gray-800">
            <MapPin className="w-5 h-5 mr-2" />
            우리 동네 벌레 출몰 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef}
            className="w-full h-64 rounded-lg border border-green-200 bg-green-50 flex items-center justify-center"
          >
            {showApiKeyInput ? (
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-green-400" />
                <p>Google Maps API 키를 입력하여 실제 지도를 확인하세요</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>지도 로딩 중...</p>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-sm mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>높은 위험</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>중간 위험</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>낮은 위험</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>현재 위치</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected report details */}
      {selectedReport && (
        <Card className="border-blue-200 bg-blue-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              선택된 신고 사례
              <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                닫기
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{selectedReport.bugName}</h3>
                <Badge variant={getBadgeVariant(selectedReport.dangerLevel)}>
                  {selectedReport.dangerLevel}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedReport.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedReport.reportTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{selectedReport.reporter}</span>
                </div>
                <div className="text-emerald-600 font-medium">
                  거리: {selectedReport.distance}
                </div>
              </div>
              <p className="text-gray-700 bg-white p-3 rounded border border-green-100">
                {selectedReport.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent reports list */}
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-gray-800">최근 신고 사례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBugReports.map((report) => (
              <div 
                key={report.id} 
                className="border rounded-lg p-3 hover:bg-green-50 cursor-pointer transition-colors border-green-100"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{report.bugName}</span>
                    <Badge variant={getBadgeVariant(report.dangerLevel)} className="text-xs">
                      {report.dangerLevel}
                    </Badge>
                  </div>
                  <span className="text-sm text-emerald-600 font-medium">{report.distance}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{report.location}</p>
                  <p>{report.reportTime}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BugMap;
