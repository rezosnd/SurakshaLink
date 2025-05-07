
interface EmergencyAlertParams {
  contacts: { name: string; phone: string; email: string }[];
  message: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  triggeredWord: string;
  userId?: string;
  userName?: string;
  userMobile?: string;
  mediaUrl?: string | null;
  mediaType?: 'image' | 'video' | null;
}

export const sendEmergencyAlert = async (params: EmergencyAlertParams) => {
  try {
    console.log("Sending emergency alert to Firebase function");
    
    const {
      contacts, message, location, triggeredWord,
      userId, userName, userMobile, mediaUrl, mediaType
    } = params;

    const endpointUrl = "https://us-central1-safewordsapp-6efbe.cloudfunctions.net/sendEmergencyAlert";

    if (mediaUrl && mediaUrl.includes("data:")) {
      console.log(`Sending alert with ${mediaType} attachment`);
      
      try {

        const base64Data = mediaUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        

        const sliceSize = 1024;
        for (let i = 0; i < byteCharacters.length; i += sliceSize) {
          const slice = byteCharacters.slice(i, i + sliceSize);
          const byteNumbers = new Array(slice.length);
          
          for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        

        const mimeType = mediaType === 'image' ? 'image/jpeg' : 'video/webm';
        const blob = new Blob(byteArrays, { type: mimeType });
        

        const formData = new FormData();
        const filename = `emergency-${Date.now()}.${mediaType === 'image' ? 'jpg' : 'webm'}`;
        formData.append('media', blob, filename);
        

        const jsonData = JSON.stringify({
          contacts,
          message,
          location,
          triggeredWord,
          userId,
          userName,
          userMobile,
          useFirebaseStorage: true
        });
        
        formData.append('data', jsonData);
        
        console.log("Sending form data with media");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout
        
        try {
          const response = await fetch(endpointUrl, {
            method: 'POST',
            body: formData,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.error(`Server responded with ${response.status}: ${response.statusText}`);
            const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
          }
          
          const result = await response.json();
          console.log("Response from server:", result);
          return result;
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          

          if (fetchError.name === 'AbortError' || fetchError.toString().includes('timeout')) {
            console.log("Request timed out, trying with embedded media");
            
            const response = await fetch(endpointUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contacts,
                message,
                location,
                triggeredWord,
                userId,
                userName,
                userMobile,
                mediaUrl: mediaUrl,  // Send the data URL directly
                mediaType: mediaType
              })
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }
            
            const result = await response.json();
            console.log("Response from direct embed approach:", result);
            return result;
          }
          
          // If that fails too, try without media
          return await sendWithoutMedia();
        }
      } catch (blobError) {
        console.error("Error processing media:", blobError);
        return await sendWithoutMedia();
      }
    } else {
      return await sendWithoutMedia();
    }
    
    async function sendWithoutMedia() {
      // No media, just send JSON data
      console.log("Sending alert without media attachment");
      
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contacts,
          message,
          location,
          triggeredWord,
          userId,
          userName,
          userMobile,
          useFirebaseStorage: false
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Response from server:", result);
      return result;
    }
    
  } catch (error) {
    console.error("Error sending emergency alert:", error);
    throw error;
  }
};
