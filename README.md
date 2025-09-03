# Kids Volunteer Hub 🌟

A colorful, fun volunteer management system designed specifically for kids! This app helps children sign up for community volunteer opportunities while ensuring they can only pick one task to focus their energy on.

## ✨ Features

### For Kids (Main App)
- **Colorful, animated interface** designed for children
- **One-task limit** using device fingerprinting
- **Real-time progress bars** showing how many volunteers each task has
- **Smart grid layout** that adapts to any number of tasks (3×3, 7×5, etc.)
- **Celebration animations** when volunteering
- **Return visitor recognition** - shows which task they already picked

### For Admins (Dashboard)
- **Master-detail layout** for managing tasks and volunteers
- **Real-time updates** as kids volunteer
- **Task management** - add, edit, delete tasks
- **Volunteer management** - remove individual volunteers
- **Bulk operations** - clear all volunteers from a task
- **CSV export** for volunteer lists
- **Reset functionality** for starting fresh

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- A Supabase account

### Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.local.example` to `.env.local` and add your credentials

3. **Set up the database:**
   - In your Supabase dashboard, go to SQL Editor
   - Copy and run the contents of `database/schema.sql`
   - This creates the tables and sample data

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
   - Main app: http://localhost:3000
   - Admin dashboard: http://localhost:3000/dashboard

## 🎨 Design Features

### Kid-Friendly Interface
- **Playful animations** using Framer Motion
- **Bright gradient backgrounds** and colorful cards
- **Large, chunky buttons** perfect for small fingers
- **Comic Sans font** for a fun, approachable feel
- **Celebration effects** with confetti and success animations

### Smart Grid System
The app automatically calculates the perfect grid layout:
- 9 tasks → 3×3 grid
- 16 tasks → 4×4 grid  
- 35 tasks → 7×5 grid
- Responsive design that works on all devices

### Real-time Updates
- Progress bars update instantly as kids volunteer
- Admin dashboard shows live volunteer counts
- Completed tasks turn green with celebration message

## 🛠 Technical Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS with custom animations
- **Backend:** Supabase (PostgreSQL + real-time subscriptions)
- **Animations:** Framer Motion
- **Device Tracking:** FingerprintJS2
- **Icons:** Lucide React

## 📊 Database Schema

### Tasks Table
- `id` - UUID primary key
- `name` - Task name (e.g., "Beach Cleanup")
- `max_volunteers` - Maximum number of volunteers needed
- `created_at` - Timestamp

### Volunteers Table  
- `id` - UUID primary key
- `task_id` - Foreign key to tasks
- `name` - Volunteer's name
- `device_fingerprint` - Unique device identifier
- `created_at` - Timestamp

## 🔒 Device Fingerprinting

The app uses device fingerprinting to ensure kids can only volunteer for one task, even if they:
- Clear their browser data
- Use incognito mode
- Reload the page multiple times

The fingerprint combines:
- Screen resolution
- Browser characteristics
- Canvas fingerprinting
- Other device-specific data

## 🎯 Usage

### For Kids
1. Enter your name
2. See all available volunteer opportunities with real-time progress
3. Click "I want to help!" on your chosen task
4. Confirm your choice
5. Celebrate! 🎉

### For Admins
1. Go to `/dashboard`
2. View all tasks and volunteer counts
3. Click on any task to see volunteer details
4. Add new tasks, edit existing ones, or manage volunteers
5. Export volunteer lists as CSV files
6. Use "Reset All" to start fresh for new events

## 🌈 Customization

### Adding New Task Colors
Edit the `cardColors` array in `components/TaskCard.tsx`:
```typescript
const cardColors = [
  'from-pink-400 to-purple-500',
  'from-blue-400 to-cyan-500',
  // Add your custom gradients here
]
```

### Changing Animations
Modify animation settings in `tailwind.config.js` or component files using Framer Motion.

### Adjusting Grid Layout
The grid calculation logic is in `lib/grid-calculator.ts` - customize the algorithm for your needs.

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🤝 Contributing

This project is designed to be simple and focused. If you'd like to contribute:
1. Keep the kid-friendly design philosophy
2. Maintain the colorful, playful aesthetic
3. Ensure all features work on mobile devices
4. Test with real kids if possible!

## 📝 License

MIT License - feel free to use this for your community events, schools, or organizations!

---

Built with ❤️ for kids who want to make a difference in their communities! 🌟