import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser } from '@/utils/auth';
import { 
  getFromStorage, 
  addToStorage, 
  updateInStorage, 
  deleteFromStorage,
  type Assignment, 
  type Note,
  type Attendance,
  type Course 
} from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  BookOpen, 
  Users,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Calendar
} from 'lucide-react';

interface LecturerDashboardProps {
  onLogout: () => void;
}

export const LecturerDashboard = ({ onLogout }: LecturerDashboardProps) => {
  const user = getCurrentUser();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('assignments');
  const { toast } = useToast();

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    courseCode: '',
    dueDate: '',
    uploadedBy: user?.name || ''
  });

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    courseCode: '',
    uploadedBy: user?.name || ''
  });

  const [attendanceForm, setAttendanceForm] = useState({
    studentId: '',
    studentName: '',
    courseCode: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAssignments(getFromStorage<Assignment>('assignments'));
    setNotes(getFromStorage<Note>('notes'));
    setAttendance(getFromStorage<Attendance>('attendance'));
    setCourses(getFromStorage<Course>('courses'));
  };

  const handleAssignmentSubmit = () => {
    if (editingItem) {
      const updated = updateInStorage('assignments', {
        ...editingItem,
        ...assignmentForm
      });
      if (updated) {
        toast({ title: "Assignment updated successfully!" });
      }
    } else {
      addToStorage('assignments', {
        ...assignmentForm,
        id: Date.now().toString()
      });
      toast({ title: "Assignment created successfully!" });
    }
    
    setAssignmentForm({ title: '', description: '', courseCode: '', dueDate: '', uploadedBy: user?.name || '' });
    setEditingItem(null);
    setIsDialogOpen(false);
    loadData();
  };

  const handleNoteSubmit = () => {
    if (editingItem) {
      const updated = updateInStorage('notes', {
        ...editingItem,
        ...noteForm,
        date: new Date().toISOString().split('T')[0]
      });
      if (updated) {
        toast({ title: "Note updated successfully!" });
      }
    } else {
      addToStorage('notes', {
        ...noteForm,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      });
      toast({ title: "Note uploaded successfully!" });
    }
    
    setNoteForm({ title: '', content: '', courseCode: '', uploadedBy: user?.name || '' });
    setEditingItem(null);
    setIsDialogOpen(false);
    loadData();
  };

  const handleAttendanceSubmit = () => {
    if (editingItem) {
      const updated = updateInStorage('attendance', {
        ...editingItem,
        ...attendanceForm
      });
      if (updated) {
        toast({ title: "Attendance updated successfully!" });
      }
    } else {
      addToStorage('attendance', {
        ...attendanceForm,
        id: Date.now().toString()
      });
      toast({ title: "Attendance recorded successfully!" });
    }
    
    setAttendanceForm({ studentId: '', studentName: '', courseCode: '', date: new Date().toISOString().split('T')[0], status: 'present' });
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
    
    if (type === 'assignments') {
      setAssignmentForm({ title: item.title, description: item.description, courseCode: item.courseCode, dueDate: item.dueDate, uploadedBy: item.uploadedBy });
    } else if (type === 'notes') {
      setNoteForm({ title: item.title, content: item.content, courseCode: item.courseCode, uploadedBy: item.uploadedBy });
    } else if (type === 'attendance') {
      setAttendanceForm({ studentId: item.studentId, studentName: item.studentName, courseCode: item.courseCode, date: item.date, status: item.status });
    }
    
    setIsDialogOpen(true);
  };

  const getAttendanceStats = () => {
    const totalRecords = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    
    return { totalRecords, presentCount, absentCount, lateCount };
  };

  const printAttendance = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const attendanceHTML = `
        <html>
          <head><title>Attendance Report</title></head>
          <body>
            <h1>Attendance Report</h1>
            <table border="1" style="border-collapse: collapse; width: 100%;">
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Course Code</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
              ${attendance.map(record => `
                <tr>
                  <td>${record.studentId}</td>
                  <td>${record.studentName}</td>
                  <td>${record.courseCode}</td>
                  <td>${record.date}</td>
                  <td>${record.status}</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(attendanceHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!user || user.role !== 'lecturer') {
    return <div>Access denied. Lecturers only.</div>;
  }

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Lecturer Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses, assignments, and student attendance</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Assignment Management</CardTitle>
                    <CardDescription>Create and manage course assignments</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeTab === 'assignments'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="cyber-glow" onClick={() => { setEditingItem(null); setAssignmentForm({ title: '', description: '', courseCode: '', dueDate: '', uploadedBy: user?.name || '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Assignment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
                        <DialogDescription>Fill in the assignment details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignment-title">Title</Label>
                          <Input
                            id="assignment-title"
                            value={assignmentForm.title}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignment-description">Description</Label>
                          <Textarea
                            id="assignment-description"
                            value={assignmentForm.description}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="assignment-course">Course Code</Label>
                            <Select value={assignmentForm.courseCode} onValueChange={(value) => setAssignmentForm({ ...assignmentForm, courseCode: value })}>
                              <SelectTrigger className="cyber-border">
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                              <SelectContent>
                                {courses.map((course) => (
                                  <SelectItem key={course.id} value={course.code}>
                                    {course.code} - {course.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="assignment-due">Due Date</Label>
                            <Input
                              id="assignment-due"
                              type="date"
                              value={assignmentForm.dueDate}
                              onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                              className="cyber-border"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAssignmentSubmit} className="cyber-glow">
                          {editingItem ? 'Update' : 'Create'} Assignment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="cyber-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>
                              {assignment.courseCode} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit('assignments', assignment)} className="cyber-glow">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete('assignments', assignment.id)} className="cyber-glow">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Course Notes</CardTitle>
                    <CardDescription>Upload and manage course materials</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeTab === 'notes'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="cyber-glow" onClick={() => { setEditingItem(null); setNoteForm({ title: '', content: '', courseCode: '', uploadedBy: user?.name || '' }); }}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Note' : 'Upload Note'}</DialogTitle>
                        <DialogDescription>Fill in the note details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="note-title">Title</Label>
                          <Input
                            id="note-title"
                            value={noteForm.title}
                            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note-content">Content</Label>
                          <Textarea
                            id="note-content"
                            value={noteForm.content}
                            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                            rows={6}
                            className="cyber-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note-course">Course Code</Label>
                          <Select value={noteForm.courseCode} onValueChange={(value) => setNoteForm({ ...noteForm, courseCode: value })}>
                            <SelectTrigger className="cyber-border">
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.code}>
                                  {course.code} - {course.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleNoteSubmit} className="cyber-glow">
                          {editingItem ? 'Update' : 'Upload'} Note
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="cyber-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                            <CardDescription>
                              {note.courseCode} • {new Date(note.date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit('notes', note)} className="cyber-glow">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete('notes', note.id)} className="cyber-glow">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{note.content.substring(0, 200)}...</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="cyber-card">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <div className="text-lg font-bold">{stats.totalRecords}</div>
                      <div className="text-xs text-muted-foreground">Total Records</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cyber-card">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <div className="text-lg font-bold">{stats.presentCount}</div>
                      <div className="text-xs text-muted-foreground">Present</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cyber-card">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <div>
                      <div className="text-lg font-bold">{stats.absentCount}</div>
                      <div className="text-xs text-muted-foreground">Absent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cyber-card">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-yellow-500" />
                    <div>
                      <div className="text-lg font-bold">{stats.lateCount}</div>
                      <div className="text-xs text-muted-foreground">Late</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Attendance Management</CardTitle>
                    <CardDescription>Record and manage student attendance</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={printAttendance} variant="outline" className="cyber-glow">
                      <Download className="h-4 w-4 mr-2" />
                      Print Report
                    </Button>
                    <Dialog open={isDialogOpen && activeTab === 'attendance'} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="cyber-glow" onClick={() => { setEditingItem(null); setAttendanceForm({ studentId: '', studentName: '', courseCode: '', date: new Date().toISOString().split('T')[0], status: 'present' }); }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Record Attendance
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="cyber-card">
                        <DialogHeader>
                          <DialogTitle>{editingItem ? 'Edit Attendance' : 'Record Attendance'}</DialogTitle>
                          <DialogDescription>Fill in the attendance details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="student-id">Student ID</Label>
                              <Input
                                id="student-id"
                                value={attendanceForm.studentId}
                                onChange={(e) => setAttendanceForm({ ...attendanceForm, studentId: e.target.value })}
                                className="cyber-border"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="student-name">Student Name</Label>
                              <Input
                                id="student-name"
                                value={attendanceForm.studentName}
                                onChange={(e) => setAttendanceForm({ ...attendanceForm, studentName: e.target.value })}
                                className="cyber-border"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="attendance-course">Course Code</Label>
                              <Select value={attendanceForm.courseCode} onValueChange={(value) => setAttendanceForm({ ...attendanceForm, courseCode: value })}>
                                <SelectTrigger className="cyber-border">
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                  {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.code}>
                                      {course.code} - {course.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="attendance-date">Date</Label>
                              <Input
                                id="attendance-date"
                                type="date"
                                value={attendanceForm.date}
                                onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                                className="cyber-border"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="attendance-status">Status</Label>
                            <Select value={attendanceForm.status} onValueChange={(value: 'present' | 'absent' | 'late') => setAttendanceForm({ ...attendanceForm, status: value })}>
                              <SelectTrigger className="cyber-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="late">Late</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAttendanceSubmit} className="cyber-glow">
                            {editingItem ? 'Update' : 'Record'} Attendance
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendance.map((record) => (
                    <Card key={record.id} className="cyber-card">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-semibold">{record.studentName} ({record.studentId})</div>
                              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                <span>{record.courseCode}</span>
                                <span>•</span>
                                <span>{new Date(record.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge 
                              variant={record.status === 'present' ? 'default' : record.status === 'late' ? 'secondary' : 'destructive'}
                            >
                              {record.status}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit('attendance', record)} className="cyber-glow">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete('attendance', record.id)} className="cyber-glow">
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
        </Tabs>
      </div>
    </div>
  );
};