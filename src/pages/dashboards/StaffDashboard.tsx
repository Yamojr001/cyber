import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser } from '@/utils/auth';
import { 
  getFromStorage, 
  addToStorage, 
  updateInStorage, 
  deleteFromStorage,
  type Newsletter, 
  type Event,
  type Timetable,
  type Course 
} from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Calendar, 
  Users, 
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin
} from 'lucide-react';

interface StaffDashboardProps {
  onLogout: () => void;
}

export const StaffDashboard = ({ onLogout }: StaffDashboardProps) => {
  const user = getCurrentUser();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('newsletters');
  const { toast } = useToast();

  const [newsletterForm, setNewsletterForm] = useState({
    title: '',
    content: '',
    author: user?.name || ''
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    type: 'event' as 'event' | 'notice',
    important: false
  });

  const [timetableForm, setTimetableForm] = useState({
    courseCode: '',
    courseName: '',
    day: '',
    time: '',
    room: '',
    lecturer: ''
  });

  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    description: '',
    creditHours: 3,
    lecturer: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setNewsletters(getFromStorage<Newsletter>('newsletters'));
    setEvents(getFromStorage<Event>('events'));
    setTimetable(getFromStorage<Timetable>('timetable'));
    setCourses(getFromStorage<Course>('courses'));
  };

  const handleNewsletterSubmit = () => {
    if (editingItem) {
      const updated = updateInStorage('newsletters', {
        ...editingItem,
        ...newsletterForm,
        date: new Date().toISOString().split('T')[0]
      });
      if (updated) {
        toast({ title: "Newsletter updated successfully!" });
      }
    } else {
      addToStorage('newsletters', {
        ...newsletterForm,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      });
      toast({ title: "Newsletter created successfully!" });
    }
    
    setNewsletterForm({ title: '', content: '', author: user?.name || '' });
    setEditingItem(null);
    setIsDialogOpen(false);
    loadData();
  };

  const handleEventSubmit = () => {
    if (editingItem) {
      const updated = updateInStorage('events', {
        ...editingItem,
        ...eventForm
      });
      if (updated) {
        toast({ title: "Event updated successfully!" });
      }
    } else {
      addToStorage('events', {
        ...eventForm,
        id: Date.now().toString()
      });
      toast({ title: "Event created successfully!" });
    }
    
    setEventForm({ title: '', description: '', date: '', type: 'event', important: false });
    setEditingItem(null);
    setIsDialogOpen(false);
    loadData();
  };

  const handleTimetableSubmit = () => {
    if (editingItem) {
      const updated = updateInStorage('timetable', {
        ...editingItem,
        ...timetableForm
      });
      if (updated) {
        toast({ title: "Timetable updated successfully!" });
      }
    } else {
      addToStorage('timetable', {
        ...timetableForm,
        id: Date.now().toString()
      });
      toast({ title: "Timetable entry created successfully!" });
    }
    
    setTimetableForm({ courseCode: '', courseName: '', day: '', time: '', room: '', lecturer: '' });
    setEditingItem(null);
    setIsDialogOpen(false);
    loadData();
  };

  const handleCourseSubmit = () => {
    if (editingItem) {
      const updated = updateInStorage('courses', {
        ...editingItem,
        ...courseForm
      });
      if (updated) {
        toast({ title: "Course updated successfully!" });
      }
    } else {
      addToStorage('courses', {
        ...courseForm,
        id: Date.now().toString()
      });
      toast({ title: "Course created successfully!" });
    }
    
    setCourseForm({ code: '', name: '', description: '', creditHours: 3, lecturer: '' });
    setEditingItem(null);
    setIsDialogOpen(false);
    loadData();
  };

  const handleDelete = (type: string, id: string) => {
    if (deleteFromStorage(type, id)) {
      toast({ title: `${type.slice(0, -1)} deleted successfully!` });
      loadData();
    }
  };

  const handleEdit = (type: string, item: any) => {
    setEditingItem(item);
    setActiveTab(type);
    
    if (type === 'newsletters') {
      setNewsletterForm({ title: item.title, content: item.content, author: item.author });
    } else if (type === 'events') {
      setEventForm({ title: item.title, description: item.description, date: item.date, type: item.type, important: item.important });
    } else if (type === 'timetable') {
      setTimetableForm({ courseCode: item.courseCode, courseName: item.courseName, day: item.day, time: item.time, room: item.room, lecturer: item.lecturer });
    } else if (type === 'courses') {
      setCourseForm({ code: item.code, name: item.name, description: item.description, creditHours: item.creditHours, lecturer: item.lecturer });
    }
    
    setIsDialogOpen(true);
  };

  if (!user || user.role !== 'staff') {
    return <div>Access denied. Staff only.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Staff Dashboard</h1>
          <p className="text-muted-foreground">Manage department content and resources</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="newsletters" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Newsletter Management</CardTitle>
                    <CardDescription>Create and manage department newsletters</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeTab === 'newsletters'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="cyber-glow" onClick={() => { setEditingItem(null); setNewsletterForm({ title: '', content: '', author: user?.name || '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Newsletter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Newsletter' : 'Create Newsletter'}</DialogTitle>
                        <DialogDescription>Fill in the newsletter details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newsletter-title">Title</Label>
                          <Input
                            id="newsletter-title"
                            value={newsletterForm.title}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, title: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newsletter-content">Content</Label>
                          <Textarea
                            id="newsletter-content"
                            value={newsletterForm.content}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                            rows={6}
                            className="cyber-border"
                          />
                        </div>
                        <Button onClick={handleNewsletterSubmit} className="cyber-glow">
                          {editingItem ? 'Update' : 'Create'} Newsletter
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsletters.map((newsletter) => (
                    <Card key={newsletter.id} className="cyber-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                            <CardDescription>By {newsletter.author} • {new Date(newsletter.date).toLocaleDateString()}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit('newsletters', newsletter)} className="cyber-glow">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete('newsletters', newsletter.id)} className="cyber-glow">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{newsletter.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Event Management</CardTitle>
                    <CardDescription>Manage events and notices</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeTab === 'events'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="cyber-glow" onClick={() => { setEditingItem(null); setEventForm({ title: '', description: '', date: '', type: 'event', important: false }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Event' : 'Create Event'}</DialogTitle>
                        <DialogDescription>Fill in the event details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-title">Title</Label>
                          <Input
                            id="event-title"
                            value={eventForm.title}
                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-description">Description</Label>
                          <Textarea
                            id="event-description"
                            value={eventForm.description}
                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-date">Date</Label>
                          <Input
                            id="event-date"
                            type="date"
                            value={eventForm.date}
                            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <Button onClick={handleEventSubmit} className="cyber-glow">
                          {editingItem ? 'Update' : 'Create'} Event
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} className="cyber-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center space-x-2">
                              <span>{event.title}</span>
                              {event.important && <Badge variant="default">Important</Badge>}
                            </CardTitle>
                            <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit('events', event)} className="cyber-glow">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete('events', event.id)} className="cyber-glow">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetable" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Timetable Management</CardTitle>
                    <CardDescription>Manage class schedules and timetables</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeTab === 'timetable'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="cyber-glow" onClick={() => { setEditingItem(null); setTimetableForm({ courseCode: '', courseName: '', day: '', time: '', room: '', lecturer: '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
                        <DialogDescription>Fill in the schedule details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="course-code">Course Code</Label>
                            <Input
                              id="course-code"
                              value={timetableForm.courseCode}
                              onChange={(e) => setTimetableForm({ ...timetableForm, courseCode: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="course-name">Course Name</Label>
                            <Input
                              id="course-name"
                              value={timetableForm.courseName}
                              onChange={(e) => setTimetableForm({ ...timetableForm, courseName: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="day">Day</Label>
                            <Input
                              id="day"
                              value={timetableForm.day}
                              onChange={(e) => setTimetableForm({ ...timetableForm, day: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              value={timetableForm.time}
                              onChange={(e) => setTimetableForm({ ...timetableForm, time: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="room">Room</Label>
                            <Input
                              id="room"
                              value={timetableForm.room}
                              onChange={(e) => setTimetableForm({ ...timetableForm, room: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lecturer">Lecturer</Label>
                            <Input
                              id="lecturer"
                              value={timetableForm.lecturer}
                              onChange={(e) => setTimetableForm({ ...timetableForm, lecturer: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                        </div>
                        <Button onClick={handleTimetableSubmit} className="cyber-glow">
                          {editingItem ? 'Update' : 'Add'} Schedule
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timetable.map((entry) => (
                    <Card key={entry.id} className="cyber-card">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{entry.courseName} ({entry.courseCode})</div>
                            <div className="text-sm text-muted-foreground flex items-center space-x-4">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {entry.day}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {entry.time}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {entry.room}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {entry.lecturer}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit('timetable', entry)} className="cyber-glow">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete('timetable', entry.id)} className="cyber-glow">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Course Management</CardTitle>
                    <CardDescription>Manage department courses</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeTab === 'courses'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="cyber-glow" onClick={() => { setEditingItem(null); setCourseForm({ code: '', name: '', description: '', creditHours: 3, lecturer: '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Course' : 'Add Course'}</DialogTitle>
                        <DialogDescription>Fill in the course details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="course-code-input">Course Code</Label>
                            <Input
                              id="course-code-input"
                              value={courseForm.code}
                              onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="credit-hours">Credit Hours</Label>
                            <Input
                              id="credit-hours"
                              type="number"
                              value={courseForm.creditHours}
                              onChange={(e) => setCourseForm({ ...courseForm, creditHours: parseInt(e.target.value) })}
                              className="cyber-border"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="course-name-input">Course Name</Label>
                          <Input
                            id="course-name-input"
                            value={courseForm.name}
                            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="course-description">Description</Label>
                          <Textarea
                            id="course-description"
                            value={courseForm.description}
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="course-lecturer">Lecturer</Label>
                          <Input
                            id="course-lecturer"
                            value={courseForm.lecturer}
                            onChange={(e) => setCourseForm({ ...courseForm, lecturer: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <Button onClick={handleCourseSubmit} className="cyber-glow">
                          {editingItem ? 'Update' : 'Add'} Course
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="cyber-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{course.name}</CardTitle>
                            <CardDescription>{course.code} • {course.creditHours} Credits</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit('courses', course)} className="cyber-glow">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete('courses', course.id)} className="cyber-glow">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                        {course.lecturer && (
                          <p className="text-xs text-primary">Lecturer: {course.lecturer}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};