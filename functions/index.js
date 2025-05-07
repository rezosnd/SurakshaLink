
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const { Storage } = require('@google-cloud/storage');
const Busboy = require('busboy');

// Configure nodemailer with your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rehansuman41008@gmail.com',
    pass: 'izzo lcmm vcxj kogi' // Use an app password for Gmail
  }
});

// Cloud Storage setup
const storage = new Storage();
const bucket = storage.bucket('safewordsapp-6efbe.appspot.com');

// Export the function without runWith (compatible with GCF gen 1)
exports.sendEmergencyAlert = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({error: 'Method not allowed'});
    }

    try {
      let mediaUrl = null;
      let data = {};

      // Check if this is a multipart form (has file) or just JSON
      const contentType = req.headers['content-type'] || '';
      
      console.log('Request content type:', contentType);
      
      if (contentType.includes('multipart/form-data')) {
        // Handle multipart form data with media file
        const busboy = Busboy({ headers: req.headers });
        const fields = {};
        let fileBuffer = null;
        let fileName = null;
        let fileMimeType = null;

        // Process form fields
        busboy.on('field', (fieldname, val) => {
          console.log(`Received field: ${fieldname}`);
          if (fieldname === 'data') {
            try {
              data = JSON.parse(val);
              console.log('Parsed JSON data:', data);
            } catch (error) {
              console.error('Error parsing JSON data:', error);
            }
          } else {
            fields[fieldname] = val;
          }
        });

        // Process file upload
        busboy.on('file', (fieldname, file, info) => {
          console.log(`Received file: ${fieldname}, filename: ${info.filename}, mimeType: ${info.mimeType}`);
          const { filename, mimeType } = info;
          fileMimeType = mimeType;
          fileName = `emergency-${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          
          const chunks = [];
          file.on('data', (chunk) => {
            console.log(`Received ${chunk.length} bytes`);
            chunks.push(chunk);
          });
          file.on('end', () => {
            console.log(`File ${fileName} assembled`);
            fileBuffer = Buffer.concat(chunks);
            console.log(`Total file size: ${fileBuffer.length} bytes`);
          });
        });

        // Finalize processing
        busboy.on('finish', async () => {
          console.log('Busboy processing finished');
          // Upload file to Firebase Storage if we have one
          if (fileBuffer && fileName) {
            try {
              console.log(`Uploading file ${fileName} to storage (${fileBuffer.length} bytes)`);
              const file = bucket.file(`emergency-media/${fileName}`);
              
              await file.save(fileBuffer, {
                metadata: {
                  contentType: fileMimeType || 'application/octet-stream'
                }
              });
              
              // Make the file publicly accessible
              await file.makePublic();
              mediaUrl = `https://storage.googleapis.com/${bucket.name}/emergency-media/${fileName}`;
              console.log('File uploaded, URL:', mediaUrl);
            } catch (error) {
              console.error('Error uploading file:', error);
              console.error(error.stack);
            }
          } else {
            console.log('No file to upload or file data is missing');
          }

          // Send the emails with emergency alert
          await sendEmails(data, mediaUrl, res);
        });

        req.pipe(busboy);
        return;
      } else {
        // Handle JSON data without file
        console.log('Processing JSON request');
        data = req.body;
        console.log('Request body data:', data);
        
        // Check if the request includes a mediaUrl directly
        if (data.mediaUrl && data.mediaUrl.startsWith('data:')) {
          try {
            console.log('Processing embedded media data URL');
            const mediaType = data.mediaType || 'image';
            const base64Data = data.mediaUrl.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            const extension = mediaType === 'image' ? 'jpg' : 'webm';
            const fileName = `emergency-${Date.now()}.${extension}`;
            const fileType = mediaType === 'image' ? 'image/jpeg' : 'video/webm';
            
            const file = bucket.file(`emergency-media/${fileName}`);
            await file.save(buffer, {
              metadata: {
                contentType: fileType
              }
            });
            
            // Make file public
            await file.makePublic();
            mediaUrl = `https://storage.googleapis.com/${bucket.name}/emergency-media/${fileName}`;
            console.log('Embedded media uploaded, URL:', mediaUrl);
          } catch (error) {
            console.error('Error processing embedded media:', error);
            console.error(error.stack);
          }
        }
        
        await sendEmails(data, data.mediaUrl || mediaUrl, res);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      console.error(error.stack);
      res.status(500).json({success: false, error: error.message});
    }
  });
});

async function sendEmails(data, mediaUrl, res) {
  try {
    console.log('Starting sendEmails function with data:', data);
    console.log('Media URL:', mediaUrl);
    
    const {
      contacts,
      message,
      location,
      triggeredWord,
      userId,
      userName,
      userMobile
    } = data;

    // Validate contacts
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      console.error('No valid contacts provided:', contacts);
      return res.status(400).json({
        success: false, 
        error: 'No contacts provided for emergency alert'
      });
    }

    console.log(`Sending emergency alert to ${contacts.length} contacts`);
    const sentEmails = [];
    
    // Get current time
    const currentTime = new Date().toLocaleString();

    // Debug the media URL
    console.log('Media URL being included in email:', mediaUrl);
    if (mediaUrl) {
      console.log('Media URL type:', typeof mediaUrl);
      console.log('Media URL preview:', mediaUrl.substring(0, 100) + '...');
    } else {
      console.log('No media URL available');
    }

    // Send an email to each contact
    for (const contact of contacts) {
      // Verify the contact has an email
      if (!contact.email) {
        console.log(`Skipping contact without email: ${contact.name}`);
        continue;
      }
      
      console.log(`Processing email for contact: ${contact.name} <${contact.email}>`);
      
      // Create Google Maps link
      let mapLink = '';
      if (location && location.lat && location.lng) {
        mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      }
      
      // Create message content - improved format to avoid spam filters
      let htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #ff5722; border-bottom: 2px solid #ff5722; padding-bottom: 10px;">⚠️ EMERGENCY ALERT</h2>
          
          <p>Dear ${contact.name},</p>
          
          <p>This is an automated emergency alert generated by the safety system of:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #ff5722; margin: 15px 0;">
            <p><strong>🧑 Name:</strong> ${userName || 'Unknown User'}</p>
            <p><strong>📞 Mobile:</strong> ${userMobile || 'Not provided'}</p>
            <p><strong>⏰ Time:</strong> ${currentTime}</p>
            <p><strong>📍 Location:</strong> ${location && location.address ? location.address : 'Unknown location'}</p>
            ${mapLink ? `<p><a href="${mapLink}" style="color: #1a73e8; text-decoration: none;">View on Google Maps</a></p>` : ''}
            ${mediaUrl ? `<p><strong>📷 Evidence:</strong> <a href="${mediaUrl}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">VIEW MEDIA EVIDENCE</a></p>` : ''}
            ${triggeredWord ? `<p><strong>🔑 Triggered by code word:</strong> "${triggeredWord}"</p>` : ''}
          </div>
          
          <p>The sender has indicated that they are in distress and requires <strong>immediate assistance</strong>.</p>
          
          <div style="background-color: #fef8e8; padding: 15px; border-left: 4px solid #fbbc05; margin: 15px 0;">
            <p><strong>Please treat this situation with the highest level of urgency.</strong> This message has been sent to you as a trusted contact.</p>
            
            <p>If possible, please attempt to contact ${userName || 'the sender'} directly via the mobile number above and alert local emergency services immediately.</p>
          </div>
          
          <div style="background-color: #e8f4fe; padding: 15px; border-left: 4px solid #4285f4; margin: 15px 0;">
            <p><strong>📢 Important:</strong> Kindly check your spam/junk folder in case this alert was misdirected. Mark this sender as safe to avoid missing future alerts.</p>
          </div>
          
          <p>Thank you for your immediate attention.</p>
          
          <p>Stay alert and safe,<br>
          <strong>SafeWords Automated Emergency Alert System</strong></p>
        </div>
      `;

      // Email configuration with improved subject line to avoid spam filters
      const mailOptions = {
        from: '"SafeWords Alert System" <rehansuman41008@gmail.com>',
        to: contact.email,
        subject: `URGENT: Safety Alert from ${userName || 'Someone who needs help'} - Please Respond`,
        html: htmlContent
      };

      // Send email
      try {
        console.log(`Sending email to ${contact.name} <${contact.email}>`);
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${contact.email}`);
        sentEmails.push(contact.email);
      } catch (error) {
        console.error(`Failed to send email to ${contact.email}:`, error);
        console.error(error.stack);
      }
    }

    if (sentEmails.length > 0) {
      res.status(200).json({
        success: true, 
        message: 'Emergency alert emails sent successfully',
        sentTo: sentEmails,
        mediaIncluded: !!mediaUrl
      });
    } else {
      res.status(500).json({
        success: false, 
        error: 'Failed to send any emergency alert emails'
      });
    }
  } catch (error) {
    console.error('Error in sendEmails function:', error);
    console.error(error.stack);
    res.status(500).json({
      success: false, 
      error: 'Failed to send emergency alert email: ' + error.message
    });
  }
}
