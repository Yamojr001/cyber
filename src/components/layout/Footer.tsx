import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-card/50 backdrop-blur">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary/10 cyber-glow">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient">Digital Fortress</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Leading the future of cybersecurity education and research through innovation and excellence.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/courses" className="block text-sm hover:text-primary transition-colors">
                Courses
              </Link>
              <Link to="/gallery" className="block text-sm hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link to="/calendar" className="block text-sm hover:text-primary transition-colors">
                Calendar
              </Link>
              <Link to="/contact" className="block text-sm hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Programs</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Bachelor in Cybersecurity</p>
              <p className="text-sm text-muted-foreground">Master in Information Security</p>
              <p className="text-sm text-muted-foreground">PhD in Cyber Defense</p>
              <p className="text-sm text-muted-foreground">Certificate Programs</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Cyber Street, Tech City, TC 12345</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@cybersec.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Cyber Security Department. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};