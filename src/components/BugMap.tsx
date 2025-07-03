
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Clock, User, Navigation } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import L from 'leaflet';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

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

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet map
    const center: L.LatLngExpression = [37.4583, 126.9510]; // Seoul National University area
    
    leafletMapRef.current = L.map(mapRef.current).setView(center, 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMapRef.current);

    // Add markers for bug reports
    mockBugReports.forEach((report) => {
      const marker = L.marker([report.lat, report.lng], {
        icon: createCustomIcon(getDangerColor(report.dangerLevel))
      }).addTo(leafletMapRef.current!);

      marker.on('click', () => {
        setSelectedReport(report);
      });

      // Add popup
      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <strong>${report.bugName}</strong><br/>
          <span style="color: ${getDangerColor(report.dangerLevel)};">${report.dangerLevel} 위험</span><br/>
          ${report.location}<br/>
          <small>${report.reportTime}</small>
        </div>
      `);
    });

    // Add current location marker
    const currentLocationIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker(center, { icon: currentLocationIcon })
      .addTo(leafletMapRef.current)
      .bindPopup('현재 위치');

    toast({
      title: "지도가 로드되었습니다!",
      description: "주변 벌레 신고 사례를 확인해보세요.",
    });

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
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
            className="w-full h-64 rounded-lg border border-green-200"
            style={{ minHeight: '400px' }}
          />
          
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
