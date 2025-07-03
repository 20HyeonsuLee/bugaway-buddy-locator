
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Star, Heart } from "lucide-react";

// Mock bug database
const mockBugDatabase = [
  {
    id: 1,
    name: "바퀴벌레",
    scientificName: "Blattella germanica",
    dangerLevel: "높음",
    description: "주방이나 화장실 등 습한 곳에서 주로 발견되는 해충",
    commonNames: ["독일바퀴벌레", "작은바퀴벌레"],
    season: "연중",
    size: "1-1.5cm"
  },
  {
    id: 2,
    name: "러브버그",
    scientificName: "Plecia nearctica",
    dangerLevel: "낮음",
    description: "봄철에 대량 발생하는 작은 검은 벌레",
    commonNames: ["연가시", "봄파리"],
    season: "3-5월",
    size: "0.5-1cm"
  },
  {
    id: 3,
    name: "집먼지진드기",
    scientificName: "Dermatophagoides pteronyssinus",
    dangerLevel: "중간",
    description: "침구류와 카펫에서 서식하며 알레르기 유발",
    commonNames: ["더스트마이트", "집진드기"],
    season: "연중",
    size: "0.1-0.5mm"
  },
  {
    id: 4,
    name: "개미",
    scientificName: "Tetramorium caespitum",
    dangerLevel: "낮음",
    description: "단 음식에 끌리며 행렬을 이루어 이동",
    commonNames: ["집개미", "일반개미"],
    season: "4-10월",
    size: "2-4mm"
  },
  {
    id: 5,
    name: "모기",
    scientificName: "Aedes albopictus",
    dangerLevel: "중간",
    description: "흡혈을 통해 질병을 전파할 수 있는 해충",
    commonNames: ["흰줄숲모기", "이집트숲모기"],
    season: "5-9월",
    size: "3-6mm"
  }
];

const SearchBugs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(mockBugDatabase);
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults(mockBugDatabase);
    } else {
      const filtered = mockBugDatabase.filter(bug =>
        bug.name.toLowerCase().includes(term.toLowerCase()) ||
        bug.scientificName.toLowerCase().includes(term.toLowerCase()) ||
        bug.commonNames.some(name => name.toLowerCase().includes(term.toLowerCase())) ||
        bug.description.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const toggleFavorite = (bugId: number) => {
    setFavorites(prev => 
      prev.includes(bugId) 
        ? prev.filter(id => id !== bugId)
        : [...prev, bugId]
    );
  };

  const getDangerColor = (level: string) => {
    switch (level) {
      case "높음": return "destructive";
      case "중간": return "secondary";
      case "낮음": return "default";
      default: return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle>벌레 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="벌레 이름을 검색하세요 (예: 바퀴벌레, 모기, 개미...)"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              "{searchTerm}"에 대한 검색 결과: {searchResults.length}개
            </p>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-3">
        {searchResults.map((bug) => (
          <Card key={bug.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{bug.name}</h3>
                    <Badge variant={getDangerColor(bug.dangerLevel)}>
                      {bug.dangerLevel}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 italic mb-2">
                    {bug.scientificName}
                  </p>
                  
                  <p className="text-gray-700 mb-3">
                    {bug.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">별명: </span>
                      <span>{bug.commonNames.join(", ")}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">활동 시기: </span>
                      <span>{bug.season}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">크기: </span>
                      <span>{bug.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(bug.id)}
                    className={favorites.includes(bug.id) ? "text-red-500" : ""}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(bug.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="sm">
                    상세보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {searchResults.length === 0 && searchTerm && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 키워드로 검색해보시거나<br />
              사진 업로드로 벌레를 식별해보세요
            </p>
          </CardContent>
        </Card>
      )}

      {/* Popular searches */}
      {!searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">인기 검색어</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["바퀴벌레", "모기", "개미", "러브버그", "집먼지진드기"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(term)}
                  className="text-sm"
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBugs;
