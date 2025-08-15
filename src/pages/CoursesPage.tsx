import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getFromStorage, type Course } from '@/utils/storage';
import { BookOpen, Clock, Search, GraduationCap } from 'lucide-react';

interface CoursesPageProps {
  onLogout: () => void;
}

export const CoursesPage = ({ onLogout }: CoursesPageProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    const allCourses = getFromStorage<Course>('courses');
    setCourses(allCourses);
    setFilteredCourses(allCourses);
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Course Catalog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive cybersecurity curriculum designed to prepare you 
            for the challenges of the digital age
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 cyber-border"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="cyber-card hover:cyber-glow transition-all h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-primary border-primary/50">
                      {course.code}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.creditHours} Credits
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {course.description}
                  </CardDescription>
                  
                  {course.lecturer && (
                    <div className="flex items-center text-sm text-primary">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span>Instructor: {course.lecturer}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'No courses available at the moment'}
            </p>
          </div>
        )}

        {/* Course Levels Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cyber-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary mb-2">100-200 Level</div>
              <div className="text-sm text-muted-foreground">Foundation Courses</div>
              <p className="text-xs mt-2">Basic cybersecurity concepts and fundamentals</p>
            </CardContent>
          </Card>
          
          <Card className="cyber-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary mb-2">300-400 Level</div>
              <div className="text-sm text-muted-foreground">Advanced Courses</div>
              <p className="text-xs mt-2">Specialized topics and practical applications</p>
            </CardContent>
          </Card>
          
          <Card className="cyber-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent mb-2">500+ Level</div>
              <div className="text-sm text-muted-foreground">Expert Courses</div>
              <p className="text-xs mt-2">Research-focused and industry collaboration</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};