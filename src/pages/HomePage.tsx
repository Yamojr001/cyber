import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getFromStorage, type Newsletter, type Event } from '@/utils/storage';
import { getCurrentUser } from '@/utils/auth';
import {
  Shield,
  Users,
  BookOpen,
  Award,
  Calendar,
  Bell,
  ArrowRight,
  Eye,
  Target,
  Star
} from 'lucide-react';

interface HomePageProps {
  onLogout: () => void;
}

export const HomePage = ({ onLogout }: HomePageProps) => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    setNewsletters(getFromStorage<Newsletter>('newsletters').slice(0, 3));
    setEvents(getFromStorage<Event>('events').slice(0, 4));
  }, []);

  const stats = [
    { icon: Users, label: 'Students Enrolled', value: '500+' },
    { icon: BookOpen, label: 'Courses Offered', value: '15+' },
    { icon: Award, label: 'Research Projects', value: '25+' },
    { icon: Shield, label: 'Years of Excellence', value: '10+' }
  ];

  const facultyMembers = [
    {
      name: 'Dr. ',
      position: 'Department Head',
      specialization: 'Network Security & Cryptography',
      image: '/placeholder.svg'
    },
    {
      name: 'Prof. ',
      position: 'Senior Lecturer',
      specialization: 'Digital Forensics & Incident Response',
      image: '/placeholder.svg'
    },
    {
      name: 'Dr. ',
      position: 'Research Director',
      specialization: 'AI Security & Machine Learning',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="text-gradient">Digital Fortress</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary">
                Cyber Security Department
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Protecting the digital frontier through cutting-edge education, innovative research, 
                and real-world security solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="cyber-glow">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="cyber-glow">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="cyber-card text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10 cyber-glow">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To provide world-class cybersecurity education that prepares students for the
                  evolving challenges of digital security. We foster innovation, critical thinking,
                  and ethical responsibility in protecting our digital infrastructure and society.
                </p>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-6 w-6 text-secondary" />
                  <CardTitle className="text-2xl text-secondary">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To be a global leader in cybersecurity education and research, producing
                  skilled professionals who will shape the future of digital security and
                  create a safer cyberspace for all.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Latest News & Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest happenings in our department
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Recent News
              </h3>
              <div className="space-y-4">
                {newsletters.map((newsletter) => (
                  <Card key={newsletter.id} className="cyber-card hover:cyber-glow transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                      <CardDescription>
                        By {newsletter.author} • {new Date(newsletter.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {newsletter.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-secondary" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="cyber-card hover:cyber-glow transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        {event.important && (
                          <Badge variant="secondary" className="ml-2">
                            <Star className="h-3 w-3 mr-1" />
                            Important
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {new Date(event.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Faculty</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet our experienced faculty members who are leading experts in cybersecurity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facultyMembers.map((faculty, index) => (
              <Card key={index} className="cyber-card text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 cyber-glow flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{faculty.name}</h3>
                  <p className="text-primary text-sm mb-2">{faculty.position}</p>
                  <p className="text-xs text-muted-foreground">{faculty.specialization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
  
};