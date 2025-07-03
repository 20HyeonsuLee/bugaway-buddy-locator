
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Clock, User } from "lucide-react";

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

  useEffect(() => {
    // Mock current location (Seoul National University area)
    setCurrentLocation({ lat: 37.4583, lng: 126.9510 });
  }, []);

  const getDangerColor = (level: string) => {
    switch (level) {
      case "높음": return "bg-red-500";
      case "중간": return "bg-yellow-500";
      case "낮음": return "bg-green-500";
      default: return "bg-gray-500";
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

  return (
    <div className="space-y-4">
      {/* Map placeholder with location info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            우리 동네 벌레 출몰 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4 relative">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">현재 위치: 서울시 관악구</p>
              <p className="text-sm text-gray-500">반경 2km 내 신고 사례</p>
            </div>
            
            {/* Mock map markers */}
            <div className="absolute top-4 left-8">
              <div className={`w-4 h-4 ${getDangerColor("높음")} rounded-full border-2 border-white shadow-lg cursor-pointer`}
                   onClick={() => setSelectedReport(mockBugReports[0])}></div>
            </div>
            <div className="absolute top-12 right-12">
              <div className={`w-4 h-4 ${getDangerColor("낮음")} rounded-full border-2 border-white shadow-lg cursor-pointer`}
                   onClick={() => setSelectedReport(mockBugReports[1])}></div>
            </div>
            <div className="absolute bottom-8 left-16">
              <div className={`w-4 h-4 ${getDangerColor("중간")} rounded-full border-2 border-white shadow-lg cursor-pointer`}
                   onClick={() => setSelectedReport(mockBugReports[2])}></div>
            </div>
            <div className="absolute bottom-4 right-8">
              <div className={`w-4 h-4 ${getDangerColor("높음")} rounded-full border-2 border-white shadow-lg cursor-pointer`}
                   onClick={() => setSelectedReport(mockBugReports[3])}></div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-sm">
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
          </div>
        </CardContent>
      </Card>

      {/* Selected report details */}
      {selectedReport && (
        <Card className="border-blue-200 bg-blue-50">
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
                <div className="text-blue-600 font-medium">
                  거리: {selectedReport.distance}
                </div>
              </div>
              <p className="text-gray-700 bg-white p-3 rounded">
                {selectedReport.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent reports list */}
      <Card>
        <CardHeader>
          <CardTitle>최근 신고 사례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBugReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                   onClick={() => setSelectedReport(report)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{report.bugName}</span>
                    <Badge variant={getBadgeVariant(report.dangerLevel)} className="text-xs">
                      {report.dangerLevel}
                    </Badge>
                  </div>
                  <span className="text-sm text-blue-600">{report.distance}</span>
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
