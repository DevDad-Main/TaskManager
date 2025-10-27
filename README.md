# 📋 Task Manager Application

A modern, feature-rich task management system built with React, TypeScript, and a sleek animated UI. Organize your workflow efficiently with folders, filters, and drag-and-drop functionality.

![Task Manager](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80)

## ✨ Features

### 🎯 Core Functionality

- **Task Management**: Create, edit, delete, and complete tasks with ease
- **Folder Organization**: Group related tasks into customizable folders
- **Smart Filtering**: Filter by date, priority, completion status, and tags
- **Search**: Quickly find tasks with real-time search
- **Completion Tracking**: Mark tasks complete and hide them from the main view

### 🎨 User Experience

- **Smooth Animations**: Powered by Framer Motion for delightful transitions
- **Responsive Design**: Fully optimized for desktop and mobile devices
- **Grid & List Views**: Switch between viewing modes based on preference
- **Collapsible Sections**: Keep your workspace clean with expandable folders and task lists
- **Visual Indicators**: Color-coded priorities and completion status

### 🔐 Authentication (Planned)

- User registration and login
- Secure data sync across devices
- Personal task workspaces

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend (Planned)

- **Node.js** - Runtime environment
- **TypeScript** - End-to-end type safety
- **PostgreSQL** - Robust relational database
- **Sequelize** - ORM for database operations
- **Express** - Web framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL 14+ (for backend)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/DevDad-Main/TaskManager
cd TaskManager
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Setup (Coming Soon)

1. **Install backend dependencies**

```bash
cd backend
npm install
```

2. **Configure PostgreSQL**

```bash
# Create a .env file
DATABASE_URL=postgresql://username:password@localhost:5432/taskmanager
JWT_SECRET=your-secret-key
```

3. **Run migrations**

```bash
npm run migrate
```

4. **Start the backend server**

```bash
npm run dev
```

## 📁 Project Structure

```
TaskManager/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Main dashboard components
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   └── FolderList.tsx
│   │   └── ui/             # Reusable UI components (shadcn)
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── package.json
```

## 🎯 Roadmap

- [x] Task CRUD operations
- [x] Folder organization
- [x] Advanced filtering
- [x] Completion tracking
- [x] Responsive design
- [ ] User authentication
- [ ] Backend API with PostgreSQL
- [ ] Data persistence
- [ ] Drag-and-drop reordering
- [ ] Task due date reminders
- [ ] Collaborative workspaces
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the MIT License.

## 🧑‍💻 Author

**Olly** - Aspiring _Backend Developer_
📨 [softwaredevdad@gmail.com]

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide](https://lucide.dev/) for the icon set
- [Framer Motion](https://www.framer.com/motion/) for animations

---

Built with ❤️ using React, TypeScript, and modern web technologies
