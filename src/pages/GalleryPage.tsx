import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getFromStorage, addToStorage, type GalleryImage } from '@/utils/storage';
import { getCurrentUser } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Camera,
  Calendar,
  Eye
} from 'lucide-react';

interface GalleryPageProps {
  onLogout: () => void;
}

export const GalleryPage = ({ onLogout }: GalleryPageProps) => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    url: ''
  });
  const user = getCurrentUser();
  const { toast } = useToast();

  // Default gallery images
  const defaultImages: GalleryImage[] = [
    {
      id: '1',
      url: '/placeholder.svg',
      title: 'Cybersecurity Conference 2024',
      description: 'Annual cybersecurity conference featuring industry experts and research presentations.',
      date: '2024-03-15'
    },
    {
      id: '2',
      url: '/placeholder.svg',
      title: 'Research Lab Opening',
      description: 'Grand opening of our new Advanced Cyber Defense Research Lab.',
      date: '2024-02-20'
    },
    {
      id: '3',
      url: '/placeholder.svg',
      title: 'Student Graduation 2024',
      description: 'Celebrating our cybersecurity graduates and their achievements.',
      date: '2024-01-10'
    },
    {
      id: '4',
      url: '/placeholder.svg',
      title: 'Ethical Hacking Workshop',
      description: 'Hands-on workshop on ethical hacking and penetration testing.',
      date: '2023-12-05'
    },
    {
      id: '5',
      url: '/placeholder.svg',
      title: 'Industry Partnership Signing',
      description: 'Signing ceremony with leading cybersecurity companies for internship programs.',
      date: '2023-11-18'
    },
    {
      id: '6',
      url: '/placeholder.svg',
      title: 'Faculty Research Showcase',
      description: 'Faculty presenting their latest research findings in cybersecurity.',
      date: '2023-10-30'
    }
  ];

  useEffect(() => {
    let images = getFromStorage<GalleryImage>('gallery');
    if (images.length === 0) {
      // Initialize with default images
      defaultImages.forEach(img => addToStorage('gallery', img));
      images = defaultImages;
    }
    setGallery(images);
    setFilteredImages(images);
  }, []);

  useEffect(() => {
    const filtered = gallery.filter(
      (image) =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImages(filtered);
  }, [searchTerm, gallery]);

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.url) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newImage: GalleryImage = {
      id: Date.now().toString(),
      title: uploadForm.title,
      description: uploadForm.description,
      url: uploadForm.url,
      date: new Date().toISOString().split('T')[0]
    };

    addToStorage('gallery', newImage);
    setGallery(prev => [...prev, newImage]);
    setUploadForm({ title: '', description: '', url: '' });
    setIsUploadOpen(false);
    
    toast({
      title: "Image uploaded successfully!",
      description: "Your image has been added to the gallery."
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadForm({ ...uploadForm, url: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore moments from our department's journey through education, research, 
            and community engagement
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 cyber-border"
            />
          </div>

          {/* Upload Button - Only for authenticated users */}
          {user && (
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="cyber-glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="cyber-card">
                <DialogHeader>
                  <DialogTitle>Upload Photo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="photo-title">Title</Label>
                    <Input
                      id="photo-title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="cyber-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo-description">Description</Label>
                    <Input
                      id="photo-description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="cyber-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo-upload">Photo</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cyber-border"
                      />
                      <Camera className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {uploadForm.url && (
                      <div className="mt-2">
                        <img 
                          src={uploadForm.url} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <Button onClick={handleUpload} className="cyber-glow w-full">
                    Upload Photo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card 
                key={image.id} 
                className="cyber-card hover:cyber-glow transition-all cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center text-white text-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Click to view
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-primary mb-2">{image.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {image.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(image.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'No images available in the gallery'}
            </p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="cyber-card max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedImage.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <div>
                  <p className="text-muted-foreground mb-2">{selectedImage.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(selectedImage.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Footer />
    </div>
  );
};