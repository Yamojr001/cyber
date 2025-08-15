import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getFromStorage, type Event, type Timetable } from '@/utils/storage';
import { Calendar, Clock, MapPin, Users, Star, BookOpen } from 'lucide-react';

interface CalendarPageProps {
  onLogout: () => void;
}

export const CalendarPage = ({ onLogout }: CalendarPageProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [selectedView, setSelectedView] = useState<'events' | 'schedule'>('events');

  useEffect(() => {
    setEvents(getFromStorage<Event>('events'));
    setTimetable(getFromStorage<Timetable>('timetable'));
  }, []);

  const getCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentWeek = getCurrentWeek();

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getTimetableForDay = (day: string) => {
    return timetable.filter(entry => entry.day.toLowerCase() === day.toLowerCase());
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const academicCalendar = [
    {
      title: 'Fall Semester 2024',
      events: [
        { name: 'Classes Begin', date: '2024-08-26' },
        { name: 'Add/Drop Deadline', date: '2024-09-09' },
        { name: 'Midterm Exams', date: '2024-10-14' },
        { name: 'Thanksgiving Break', date: '2024-11-25' },
        { name: 'Final Exams', date: '2024-12-09' },
        { name: 'Semester Ends', date: '2024-12-16' }
      ]
    },
    {
      title: 'Spring Semester 2025',
      events: [
        { name: 'Classes Begin', date: '2025-01-13' },
        { name: 'Add/Drop Deadline', date: '2025-01-27' },
        { name: 'Spring Break', date: '2025-03-10' },
        { name: 'Midterm Exams', date: '2025-03-24' },
        { name: 'Final Exams', date: '2025-05-05' },
        { name: 'Commencement', date: '2025-05-16' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Academic Calendar</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with important dates, events, and class schedules
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted/20 p-1 rounded-lg">
            <Button
              variant={selectedView === 'events' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('events')}
              className={selectedView === 'events' ? 'cyber-glow' : ''}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </Button>
            <Button
              variant={selectedView === 'schedule' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('schedule')}
              className={selectedView === 'schedule' ? 'cyber-glow' : ''}
            >
              <Clock className="h-4 w-4 mr-2" />
              Class Schedule
            </Button>
          </div>
        </div>

        {selectedView === 'events' ? (
          <div className="space-y-8">
            {/* Upcoming Events */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Don't miss these important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getUpcomingEvents().length > 0 ? getUpcomingEvents().map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/10 cyber-border">
                      <div>
                        <div className="font-semibold flex items-center">
                          {event.title}
                          {event.important && (
                            <Badge variant="default" className="ml-2">
                              <Star className="h-3 w-3 mr-1" />
                              Important
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{event.description}</div>
                      </div>
                      <Badge variant="outline" className="text-primary border-primary/50">
                        {new Date(event.date).toLocaleDateString()}
                      </Badge>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">No upcoming events</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Week */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">This Week</CardTitle>
                <CardDescription>
                  {currentWeek[0].toLocaleDateString()} - {currentWeek[6].toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {currentWeek.map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${isToday ? 'bg-primary/10 border-primary/50' : 'bg-muted/5 border-border'}`}
                      >
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            {weekDays[index]}
                          </div>
                          <div className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                            {date.getDate()}
                          </div>
                          {dayEvents.length > 0 && (
                            <div className="mt-1">
                              <div className="w-2 h-2 bg-primary rounded-full mx-auto"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Academic Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {academicCalendar.map((semester, index) => (
                <Card key={index} className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-secondary">{semester.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {semester.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{event.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weekly Schedule */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Weekly Class Schedule
                </CardTitle>
                <CardDescription>Current semester class timetable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {weekDays.slice(0, 5).map((day) => {
                    const dayClasses = getTimetableForDay(day);
                    
                    return (
                      <div key={day} className="space-y-2">
                        <h3 className="font-semibold text-primary text-center p-2 rounded-lg bg-primary/10">
                          {day}
                        </h3>
                        <div className="space-y-2">
                          {dayClasses.length > 0 ? dayClasses.map((classItem) => (
                            <Card key={classItem.id} className="cyber-card">
                              <CardContent className="p-3">
                                <div className="text-sm font-semibold mb-1">
                                  {classItem.courseName}
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {classItem.time}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {classItem.room}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {classItem.lecturer}
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs mt-2">
                                  {classItem.courseCode}
                                </Badge>
                              </CardContent>
                            </Card>
                          )) : (
                            <div className="text-center p-4 text-muted-foreground text-sm">
                              No classes
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots Overview */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Common Time Slots</CardTitle>
                <CardDescription>Standard class periods throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-secondary">Morning Sessions</h4>
                    <div className="text-sm space-y-1">
                      <div>8:00 - 9:30 AM</div>
                      <div>9:45 - 11:15 AM</div>
                      <div>11:30 AM - 1:00 PM</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-secondary">Afternoon Sessions</h4>
                    <div className="text-sm space-y-1">
                      <div>2:00 - 3:30 PM</div>
                      <div>3:45 - 5:15 PM</div>
                      <div>5:30 - 7:00 PM</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-secondary">Evening Sessions</h4>
                    <div className="text-sm space-y-1">
                      <div>7:15 - 8:45 PM</div>
                      <div>9:00 - 10:30 PM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};