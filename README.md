# 📱 Framez - Mobile Social Application (Supabase Edition)

A modern, Instagram-inspired mobile social media app built with React Native, Expo, Supabase, and TypeScript.

## ✨ Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Persistent Sessions**: Users remain logged in after closing the app
- **Create Posts**: Share text and images with the community
- **Real-time Feed**: View all posts in chronological order with automatic updates
- **User Profile**: View personal profile and all your posts
- **Image Upload**: Pick and upload images to Supabase Storage
- **Modern UI**: Clean, Instagram-inspired design with smooth animations

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 50)
- **Language**: TypeScript
- **Backend**: Supabase (Authentication, Database, Storage, Realtime)
- **State Management**: Zustand
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Supabase account
- iOS Simulator (Mac) or Android Emulator

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/framez.git
cd framez
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase

#### Create a Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for the project to be set up

#### Run Database Migrations
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and run the SQL schema provided in the documentation
3. This creates the `users` and `posts` tables with proper policies

#### Set up Storage
1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `posts`
3. Make it **Public**
4. Add the storage policies from the documentation

#### Get Your Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

### 4. Create environment file

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Start the development server
```bash
npx expo start
```

### 6. Run the app
- **iOS**: Press `i` (requires Xcode on Mac)
- **Android**: Press `a` (requires Android Studio)
- **Physical Device**: Scan QR code with Expo Go app

## 📱 Testing on Physical Device

1. Install **Expo Go** from App Store (iOS) or Google Play (Android)
2. Run `npx expo start`
3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## 🗄️ Database Structure

### users table
```typescript
{
  id: UUID (references auth.users)
  email: TEXT
  display_name: TEXT
  created_at: TIMESTAMP
}
```

### posts table
```typescript
{
  id: UUID
  user_id: UUID (references users)
  user_name: TEXT
  user_email: TEXT
  content: TEXT
  image_url: TEXT (nullable)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Authentication**: Required for creating posts
- **Authorization**: Users can only modify their own content
- **Storage Policies**: Restricted file uploads and access

## 🎨 Key Features Explained

### Real-time Updates
Supabase Realtime subscriptions automatically update the feed when:
- New posts are created
- Posts are updated or deleted
- No manual refresh needed (pull-to-refresh available)

### Image Handling
- Images are converted to base64
- Uploaded to Supabase Storage
- Public URLs are stored in the database
- Automatic cleanup on post deletion

### Session Management
- Sessions persist using AsyncStorage
- Automatic token refresh
- Secure authentication flow

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache
npx expo start -c

# Clean installation
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection errors
- Verify `.env` file has correct values
- Check Supabase project is running
- Ensure database tables are created
- Verify storage bucket exists

### Image upload issues
- Check Storage bucket is public
- Verify storage policies are set
- Ensure proper permissions
- Check internet connection

### Authentication issues
- Confirm email verification settings in Supabase Auth
- Check RLS policies are correct
- Verify user table exists

## 🌐 Deployment to Appetize.io

### Build the app
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile preview

# Build for Android
eas build --platform android --profile preview
```

### Upload to Appetize.io
1. Download the `.app` (iOS) or `.apk` (Android) file
2. Go to [appetize.io](https://appetize.io)
3. Click "Upload"
4. Select your build file
5. Get the shareable link

## 📝 Future Enhancements

- [ ] Like and comment functionality
- [ ] Follow/unfollow users
- [ ] Direct messaging
- [ ] Push notifications
- [ ] Story feature
- [ ] Dark mode support
- [ ] Profile picture upload
- [ ] Post editing and deletion UI
- [ ] Image filters
- [ ] Hashtags and search

## 🔑 Environment Variables
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👏 Acknowledgments

- Inspired by Instagram's clean, modern design
- Built with love using React Native and Supabase
- Special thanks to the Expo and Supabase teams

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase documentation: https://supabase.com/docs
- Check Expo documentation: https://docs.expo.dev
- Open an issue on GitHub

---

**Built with ❤️ using React Native & Supabase**