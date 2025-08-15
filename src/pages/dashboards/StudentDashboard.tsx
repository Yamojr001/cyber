import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser, updateUserProfile } from '@/utils/auth';
import { getFromStorage, type Course, type Event, type Assignment, type Note } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Upload, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Camera
} from 'lucide-react';

interface StudentDashboardProps {
  onLogout: () => void;
}

export const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const [user, setUser] = useState(getCurrentUser());
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    department: user?.department || ''
  });
  const { toast } = useToast();

  useEffect(() => {
    setCourses(getFromStorage<Course>('courses'));
    setEvents(getFromStorage<Event>('events').slice(0, 5));
    setAssignments(getFromStorage<Assignment>('assignments').slice(0, 5));
    setNotes(getFromStorage<Note>('notes').slice(0, 5));
  }, []);

  const handleProfileUpdate = () => {
    if (user) {
      const updatedUser = updateUserProfile(editForm);
      if (updatedUser) {
        setUser(updatedUser);
        setIsEditing(false);
        toast({
          title: "Profile updated successfully!",
          description: "Your profile information has been saved.",
        });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const updatedUser = updateUserProfile({ profileImage: imageUrl });
        if (updatedUser) {
          setUser(updatedUser);
          toast({
            title: "Profile photo updated!",
            description: "Your profile photo has been updated successfully.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div>Please log in to access the student dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cyber-card">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{courses.length}</div>
                      <div className="text-sm text-muted-foreground">Available Courses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cyber-card">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-secondary" />
                    <div>
                      <div className="text-2xl font-bold">{assignments.length}</div>
                      <div className="text-sm text-muted-foreground">Active Assignments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cyber-card">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-accent" />
                    <div>
                      <div className="text-2xl font-bold">{events.length}</div>
                      <div className="text-sm text-muted-foreground">Upcoming Events</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.length > 0 ? assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                        <div>
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-sm text-muted-foreground">{assignment.courseCode}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-sm">No assignments available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-primary">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.length > 0 ? events.map((event) => (
                      <div key={event.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/10">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">{event.description}</div>
                        </div>
                        <Badge variant={event.important ? "default" : "outline"} className="text-xs">
                          {new Date(event.date).toLocaleDateString()}
                        </Badge>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-sm">No upcoming events</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Available Courses</CardTitle>
                <CardDescription>Browse and view course information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="cyber-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{course.name}</CardTitle>
                          <Badge variant="outline">{course.code}</Badge>
                        </div>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {course.creditHours} Credit Hours
                          </span>
                          <Button size="sm" variant="outline" className="cyber-glow">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Assignments & Notes</CardTitle>
                <CardDescription>Access course materials and submit assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Assignments</h3>
                    <div className="space-y-3">
                      {assignments.length > 0 ? assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/10 cyber-border">
                          <div>
                            <div className="font-medium">{assignment.title}</div>
                            <div className="text-sm text-muted-foreground mb-2">{assignment.description}</div>
                            <Badge variant="outline" className="text-xs">
                              {assignment.courseCode} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </Badge>
                          </div>
                          <Button size="sm" className="cyber-glow">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      )) : (
                        <p className="text-muted-foreground text-sm">No assignments available</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Course Notes</h3>
                    <div className="space-y-3">
                      {notes.length > 0 ? notes.map((note) => (
                        <div key={note.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/10 cyber-border">
                          <div>
                            <div className="font-medium">{note.title}</div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {note.content.substring(0, 100)}...
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {note.courseCode} • {new Date(note.date).toLocaleDateString()}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline" className="cyber-glow">
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      )) : (
                        <p className="text-muted-foreground text-sm">No notes available</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Academic Calendar</CardTitle>
                <CardDescription>View important dates and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <Card key={event.id} className="cyber-card">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{event.title}</h3>
                          {event.important && (
                            <Badge variant="default" className="text-xs">Important</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Profile Management</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback>
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
                          <Camera className="h-3 w-3" />
                        </div>
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.role} • {user.studentId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={isEditing ? editForm.name : user.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!isEditing}
                      className="cyber-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={isEditing ? editForm.email : user.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      disabled={!isEditing}
                      className="cyber-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={isEditing ? editForm.studentId : user.studentId}
                      onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                      disabled={!isEditing}
                      className="cyber-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={isEditing ? editForm.department : user.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      disabled={!isEditing}
                      className="cyber-border"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="cyber-glow">
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleProfileUpdate} className="cyber-glow">
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: user.name,
                            email: user.email,
                            studentId: user.studentId || '',
                            department: user.department || ''
                          });
                        }}
                        className="cyber-glow"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};