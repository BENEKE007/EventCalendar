# Firebase Integration Setup Guide

## Prerequisites
- Firebase project created with project ID: `events-calendar-1d1ed`
- Firebase project configured with Firestore database

## Step 1: Get Your Firebase Configuration

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your "Events Calendar" project
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click "Add app" and select the web icon (</>)
7. Register your app with a nickname (e.g., "Event Calendar Web")
8. Copy the Firebase configuration object

## Step 2: Update Firebase Configuration

Replace the placeholder values in `src/lib/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "events-calendar-1d1ed.firebaseapp.com",
  projectId: "events-calendar-1d1ed",
  storageBucket: "events-calendar-1d1ed.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 3: Set Up Firestore Database

1. In your Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Configure Firestore Security Rules

In the Firestore Database section, go to "Rules" tab and update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to events collection
    match /events/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to settings collection
    match /settings/{document} {
      allow read, write: if true;
    }
  }
}
```

**Note**: These rules allow public read/write access. For production, implement proper authentication and authorization.

## Step 5: Test the Integration

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the app
3. Add some test events
4. Check your Firebase Console > Firestore Database to see if events are being saved
5. Refresh the page to verify events are loaded from Firebase

## Step 6: Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Build your project:
   ```bash
   npm run build
   ```

5. Deploy:
   ```bash
   firebase deploy
   ```

## Troubleshooting

### Common Issues:

1. **CORS errors**: Make sure your domain is added to Firebase authorized domains
2. **Permission denied**: Check your Firestore security rules
3. **Configuration errors**: Verify all Firebase config values are correct
4. **Network errors**: Check your internet connection and Firebase project status

### Debug Mode:
- Open browser developer tools
- Check the Console tab for any error messages
- The app will fall back to localStorage if Firebase fails

## Data Structure

The app will create two collections in Firestore:

### Events Collection (`events`)
Each document contains:
- `club`: string (event club name)
- `date`: string (event date in YYYY-MM-DD format)
- `region`: string (KZN, Gauteng, or All)

### Settings Collection (`settings`)
Contains:
- `selectedRegion`: document with `value` field storing the selected region

## Offline Support

The app includes offline support with localStorage fallback:
- If Firebase is unavailable, data is saved to localStorage
- When Firebase becomes available, data syncs automatically
- No data loss occurs during network issues
