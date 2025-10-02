const {Resend} = require('resend');
const nodemailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/logger');
const linkedInEmail = require('../../models/linkedInEmail.model'); // Assume you have a model to track sent emails
const linkedInFollowers = require('../../models/linkedInFollowers.model'); // Assume you have a model to track LinkedIn followers

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


const sendPortfolioEmail = async (userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser) => {
    const resend = new Resend(config.resend_key);
    const result = await resend.batch.send([
        {
            from: 'Creative Hand <contact@creativehand.co.in>',
            to: [userEmail],
            subject: 'Thank you for contacting us!',
            html: bodyForUser.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        },
        {
            from: 'Creative Hand <contact@creativehand.co.in>',
            to: [adminMail],
            subject: emailSubject,
            html: bodyForAdmin.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        }
    ]);

    console.log(result);

    return result;
};

const sendLinkedInEmail = async (userEmail, bodyForUser) => {
    const resend = new Resend(config.resend_key);

    // Sending the email using the Resend API
    const result = await resend.batch.send([
        {
            from: 'Creative Hand <contact@creativehand.co.in>',
            to: [userEmail],
            subject: 'Potential Fit for Your Team – Aashish Bhagwat’s Portfolio',
            html: bodyForUser.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        }
    ]);

    // Check if the email already exists in the database
    const existingEmail = await linkedInEmail.findOne({ email: userEmail });

    // If the email does not exist, save it to the database
    if (!existingEmail) {
        await new linkedInEmail({ email: userEmail }).save();
        console.log(`Saved email: ${userEmail}`);
    }

    // Return the result of the Resend API call
    return result;
};


// const sendPortfolioEmail = async (userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser) => {
//     try {
//         // Send email to admin
//         await resend.emails.send({
//             from: 'Creative Hand <contact@creativehand.co.in>',
//             to: adminMail,
//             subject: emailSubject,
//             html: bodyForAdmin,
//             headers: {
//                 'X-Entity-Ref-ID': 'Jqag5gfP_9esPC2rC7mkQiAUaCV2bQBKK',
//             },
//             tags: [
//                 {
//                     name: 'category',
//                     value: 'contact_form',
//                 },
//             ],
//         });
//
//         // Send confirmation email to user
//         const result = await resend.emails.send({
//             from: 'Creative Hand <contact@creativehand.co.in>',
//             to: userEmail,
//             subject: 'Thank you for contacting us!',
//             html: bodyForUser,
//             headers: {
//                 'X-Entity-Ref-ID': 'Jqag5gfP_9esPC2rC7mkQiAUaCV2bQBKK',
//             },
//             tags: [
//                 {
//                     name: 'category',
//                     value: 'confirm_email',
//                 },
//             ],
//         });
//
//         logger.info('Emails sent successfully');
//         return result;
//     } catch (error) {
//         logger.error('Error sending email:', error);
//         throw new Error('Failed to send email');
//     }
//
// };

const getLinkedInFollowers = async () => {
    // Fetch all documents from the collection
    const followersDocs = await linkedInFollowers.find({});
    if (!followersDocs || followersDocs.length === 0) return [];

    // Map each document to the desired structure
    return followersDocs.map(doc => ({
        acceptButtonText: doc.acceptButtonText,
        acceptLabel: doc.acceptLabel,
        avatar: doc.avatar,
        caption: doc.caption,
        degree: doc.degree,
        headline: doc.headline,
        mutualConnections: doc.mutualConnections,
        name: doc.name,
        profileUrl: doc.profileUrl
    }));
};

const updateLinkedInFollowerById = async (profileId, emailOutreachStatus, linkedinOutreachStatus) => {
  // Fetch the current document first
  const follower = await linkedInFollowers.findById(profileId);

  if (!follower) {
    throw new Error('Follower not found');
  }

  // Determine outreachDone based on outreach statuses
  const outreachDone =
    emailOutreachStatus === 'sent' ||
    linkedinOutreachStatus === 'sent';

  // Update document
  const updatedDoc = await linkedInFollowers.findByIdAndUpdate(
    profileId,
    {
      $set: {
        outreachDone: outreachDone,
        emailOutreachStatus: emailOutreachStatus,
        linkedinOutreachStatus: linkedinOutreachStatus,
        outreachAttempts: outreachDone ? (follower.outreachAttempts || 0) + 1 : follower.outreachAttempts,
        lastOutreachAt: outreachDone ? new Date() : follower.lastOutreachAt
      }
    },
    { new: true } // return updated doc
  );

  return updatedDoc;
};




// Example cURL for the endpoint that calls setLinkedInFollowers
// (Assumes your route is POST /api/portfolio/linkedin-followers)
//
// curl -X POST https://your-domain.com/api/portfolio/linkedin-followers \
//   -H "Content-Type: application/json" \
//   -d '{
//         "count": 1,
//         "linkedInContactData": {
//           "acceptButtonText": "Follow",
//           "acceptLabel": "Follow",
//           "avatar": "https://media.licdn.com/dms/image/D4D03AQH0lIqegYO0Jg/profile-displayphoto-shrink_100_100/0/1715628623134?e=1723680000&v=beta&t=example",
//           "caption": "Software Engineer",
//           "degree": "2nd",
//           "headline": "Full-stack developer",
//           "mutualConnections": "5 mutual connections",
//           "name": "Aashish Bhagwat",
//           "profileUrl": "https://www.linkedin.com/in/aashishbhagwat"
//         }
//       }'
const setLinkedInFollowers = async (linkedInContactData) => {
  const results = [];

  for (const contact of linkedInContactData) {
    const {
      avatar,
      caption,
      degree,
      headline,
      name,
      profileUrl
    } = contact;

    // ✅ Extract profileId from profileUrl
    let profileId = '';
    if (profileUrl) {
      const parts = profileUrl.split('/');
      profileId = parts[parts.length - 1] || '';
    }

    // ✅ Now lookup by profileId instead of profileUrl
    const followersDoc = await linkedInFollowers.findOne({ profileId });

    if (!followersDoc) {
      console.log("No existing document found for profileId:", profileId);
      // Create new document
      const newDoc = await linkedInFollowers.create({
        avatar,
        caption,
        degree,
        headline,
        name,
        profileUrl,
        profileId
      });
      results.push(newDoc);
    } else {
      console.log("Existing document found for profileId:", profileId);
      // Update the existing document
      followersDoc.avatar = avatar;
      followersDoc.caption = caption;
      followersDoc.degree = degree;
      followersDoc.headline = headline;
      followersDoc.name = name;
      followersDoc.profileUrl = profileUrl;
      followersDoc.profileId = profileId; // refresh in case URL changed
      await followersDoc.save();
      results.push(followersDoc);
    }
  }

  return results;
};



module.exports = {
    sendPortfolioEmail,
    sendLinkedInEmail,
    getLinkedInFollowers,
    setLinkedInFollowers,
    updateLinkedInFollowerById,
};
