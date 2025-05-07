import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User,
  updateProfile
} from "firebase/auth";
import { toast } from "sonner";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDosk-Sgt7zBaVzprup-0AkUQh7Db43PbU",
  authDomain: "safewordsapp-6efbe.firebaseapp.com",
  projectId: "safewordsapp-6efbe",
  storageBucket: "safewordsapp-6efbe.firebasestorage.app",
  messagingSenderId: "492983456170",
  appId: "1:492983456170:web:483e5c63dede27298e9bd3",
  measurementId: "G-YGMRVPXRSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user info to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", user.displayName || "User");
    localStorage.setItem("userEmail", user.email || "");
    localStorage.setItem("userPhoto", user.photoURL || "");
    localStorage.setItem("userId", user.uid);

    // Check if we already have the user's mobile number
    const userMobile = localStorage.getItem("userMobile");
    if (!userMobile) {
      // Ask for mobile number
      setTimeout(() => {
        askForMobileNumber();
      }, 1000);
    }
    
    return user;
  } catch (error: any) {
    toast.error(`Authentication failed: ${error.message}`);
    throw error;
  }
};

export const askForMobileNumber = () => {
  const mobileNumber = prompt("For emergency purposes, please enter your mobile number:");
  if (mobileNumber) {
    localStorage.setItem("userMobile", mobileNumber);
    toast.success("Mobile number saved for emergency alerts");
  } else {
    toast.warning("Mobile number not provided. You can add it later in your profile.");
  }
};

export const updateUserMobile = (mobileNumber: string) => {
  if (mobileNumber) {
    localStorage.setItem("userMobile", mobileNumber);
    toast.success("Mobile number updated successfully");
    return true;
  }
  return false;
};

export const getUserMobile = (): string => {
  return localStorage.getItem("userMobile") || "";
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("userId");
    localStorage.removeItem("whatsappSession");


    return true;
  } catch (error: any) {
    toast.error(`Logout failed: ${error.message}`);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export { auth };

