
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import BugIdentification from "@/components/BugIdentification";
import BugMap from "@/components/BugMap";
import SearchBugs from "@/components/SearchBugs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Map, Search, Heart, Bug } from "lucide-react";

const Index = () => {
  const [identifiedBug, setIdentifiedBug] = useState(null);
  const [activeTab, setActiveTab] = useState("identify");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">BugAway</h1>
                <p className="text-sm text-emerald-600 font-medium">정체불명 벌레, 사진 한 장으로 끝!</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
              <Heart className="w-4 h-4 mr-2" />
              즐겨찾기
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="identify" className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <Camera className="w-4 h-4" />
              <span>벌레 식별</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <Map className="w-4 h-4" />
              <span>지역 정보</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <Search className="w-4 h-4" />
              <span>검색</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identify" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                벌레 사진을 업로드하세요
              </h2>
              <p className="text-gray-600">
                AI가 5초 이내에 벌레를 식별하고 대응 방법을 알려드려요
              </p>
            </div>
            
            <ImageUpload onImageAnalyzed={setIdentifiedBug} />
            
            {identifiedBug && (
              <BugIdentification bugData={identifiedBug} />
            )}
          </TabsContent>

          <TabsContent value="map">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                우리 동네 벌레 출몰 지도
              </h2>
              <p className="text-gray-600">
                주변의 벌레 신고 사례를 확인하고 위험도를 파악해보세요
              </p>
            </div>
            <BugMap />
          </TabsContent>

          <TabsContent value="search">
            <SearchBugs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
