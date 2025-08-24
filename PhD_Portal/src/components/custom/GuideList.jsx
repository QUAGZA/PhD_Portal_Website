import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Search } from "lucide-react";

const GuideList = ({ onSelectGuide }) => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch guides data - in a real app, replace with API call
  useEffect(() => {
    // Simulating API call with mock data
    const fetchGuides = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('/api/guides');
        // const data = await response.json();

        // Mock data for now
        const mockGuides = [
          {
            id: "g1",
            title: "Dr.",
            name: "Amit Sharma",
            department: "Computer Science",
            researchAreas: ["Machine Learning", "Deep Learning", "Computer Vision"],
            availability: "Available",
            currentStudents: 3,
            maxStudents: 5,
          },
          {
            id: "g2",
            title: "Dr.",
            name: "Priya Patel",
            department: "Electronics",
            researchAreas: ["VLSI Design", "Embedded Systems", "IoT"],
            availability: "Limited",
            currentStudents: 4,
            maxStudents: 5,
          },
          {
            id: "g3",
            title: "Dr.",
            name: "Rajesh Kumar",
            department: "Information Technology",
            researchAreas: ["Cybersecurity", "Blockchain", "Cloud Computing"],
            availability: "Available",
            currentStudents: 2,
            maxStudents: 5,
          },
          {
            id: "g4",
            title: "Dr.",
            name: "Neha Gupta",
            department: "Computer Science",
            researchAreas: ["Natural Language Processing", "AI Ethics", "Human-Computer Interaction"],
            availability: "Not Available",
            currentStudents: 5,
            maxStudents: 5,
          },
          {
            id: "g5",
            title: "Dr.",
            name: "Suresh Menon",
            department: "Data Science",
            researchAreas: ["Big Data Analytics", "Statistical Learning", "Data Visualization"],
            availability: "Available",
            currentStudents: 1,
            maxStudents: 5,
          }
        ];

        setGuides(mockGuides);
        setLoading(false);
      } catch (err) {
        setError("Failed to load guides data");
        setLoading(false);
        console.error("Error fetching guides:", err);
      }
    };

    fetchGuides();
  }, []);

  // Filter guides based on search query
  const filteredGuides = guides.filter(
    (guide) =>
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.researchAreas.some((area) =>
        area.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Handle guide selection
  const handleSelectGuide = (guide) => {
    if (onSelectGuide && guide.availability !== "Not Available") {
      onSelectGuide(guide);
    }
  };

  // Get badge color based on availability
  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case "Available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "Limited":
        return <Badge className="bg-yellow-500">Limited</Badge>;
      case "Not Available":
        return <Badge className="bg-red-500">Not Available</Badge>;
      default:
        return <Badge className="bg-gray-500">{availability}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading guides data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guides..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </div>

      <Table>
        <TableCaption>List of available PhD guides</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="hidden md:table-cell">Research Areas</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="hidden md:table-cell">Students</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
              <TableRow
                key={guide.id}
                className={
                  guide.availability === "Not Available"
                    ? "opacity-70"
                    : "hover:bg-muted/50 cursor-pointer"
                }
                onClick={() => handleSelectGuide(guide)}
              >
                <TableCell className="font-medium">
                  {guide.title} {guide.name}
                </TableCell>
                <TableCell>{guide.department}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {guide.researchAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {getAvailabilityBadge(guide.availability)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {guide.currentStudents}/{guide.maxStudents}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={
                      guide.availability === "Not Available" ? "outline" : "default"
                    }
                    disabled={guide.availability === "Not Available"}
                    className={
                      guide.availability !== "Not Available"
                        ? "bg-[#B7202E] hover:bg-[#9a1c27]"
                        : ""
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectGuide(guide);
                    }}
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No guides match your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuideList;
