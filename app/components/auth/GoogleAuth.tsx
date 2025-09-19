// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import {
//   TouchableOpacity,
//   View,
//   Text,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import React from "react";

// interface AuthOptionsProps {
//   isLoading: boolean;
//   handleGoogleSignIn: (userData: {
//     email: string;
//     name: string;
//     sub: string;
//   }) => void;
// }



// export default function AuthOptions({
//   isLoading,
//   handleGoogleSignIn,
// }: AuthOptionsProps) {
//   // Configure Google Sign-In (should only run once)
//   React.useEffect(() => {
//     GoogleSignin.configure({
//       scopes: [
//         "profile", // Gets basic profile info
//         "email", // Gets email address
//         "openid", // Gets OpenID information
//       ],
//       webClientId:
//         "725112630139-rgj27jcug4ggeco8ggujmn415j2ptr39.apps.googleusercontent.com",
//       offlineAccess: true, // If you need server-side access
//     });
//   }, []);

//   const handleGoogleSignInPress = async () => {
//     if (isLoading) return;

//     try {
//       // 1. Check if Play Services are available
//       await GoogleSignin.hasPlayServices({
//         showPlayServicesUpdateDialog: true,
//       });

//       // 2. Perform the sign-in
//       const response = await GoogleSignin.signIn();

//       // 3. Call the parent handler with the relevant data
//       handleGoogleSignIn({
//         email: response.user.email,
//         name: response.user.name,
//         sub: response.user.id,
//       });
//     } catch (error: any) {
//       handleAuthError(error);
//     }
//   };

//   const handleAuthError = (error: any) => {
//     switch (error.code) {
//       case statusCodes.SIGN_IN_CANCELLED:
//         // User cancelled, no need to show alert
//         break;
//       case statusCodes.IN_PROGRESS:
//         console.log("Signin in progress");
//         break;
//       case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//         Alert.alert(
//           "Error",
//           "Google Play services are not available or outdated"
//         );
//         break;
//       default:
//         console.log("Google Sign-In Error:", error);
//         Alert.alert("Error", "Unable to sign in with Google");
//     }
//   };

//   return (
//     <View className="w-full items-center mb-5">
//       <View style={{ width: "100%" }}>
//         <GoogleSigninButton
//           style={{ width: "100%", height: 48 }}
//           size={GoogleSigninButton.Size.Wide}
//           color={GoogleSigninButton.Color.Dark}
//           onPress={handleGoogleSignInPress}
//           disabled={isLoading}
//         />
//       </View>
//       {isLoading && <ActivityIndicator className="mt-2.5" />}
//     </View>
//   );
// }
