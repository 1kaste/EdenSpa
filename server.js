
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicating __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity, can be restricted in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
// Use Render's persistent disk mount path (`/var/data`), or fallback to local directory for development
const DATA_DIR = process.env.RENDER_DATA_DIR || __dirname;
const DB_PATH = path.join(DATA_DIR, 'db.json');
const MASTER_PASSWORD = process.env.MASTER_PASSWORD;

if (!MASTER_PASSWORD) {
    console.warn('WARNING: MASTER_PASSWORD environment variable not set. Developer login will be disabled.');
}

// --- Helper function to strip sensitive data before broadcasting ---
const getPublicData = (data) => {
    const { userPassword, ...publicData } = data;
    return publicData;
};

// --- Helper function to get initial data if db.json doesn't exist ---
const getInitialData = () => {
    // This is a simplified version of your constants.ts file.
    return {
        lightTheme: {
            primary: '#D4C1C2', secondary: '#F7F5F5', accent: '#B0A0A1',
            textPrimary: '#2d2d2d', textSecondary: '#6e6e6e', background: '#FFFFFF',
            headerBg: '#FFFFFF', headerBgOpacity: 0.5, headerText: '#2d2d2d',
            bookNowButtonBg: '#D4C1C2', bookNowButtonText: '#2d2d2d',
            bookNowButtonBorderColor: '#D4C1C2', bookNowButtonBorderWidth: 0,
            bookNowButtonBorderRadius: 8,
        },
        heroConfig: {
            heroImage: 'https://picsum.photos/seed/spa-hero/1600/900',
            heroTitle: 'Discover Your Inner Serenity',
            heroSubtitle: 'Your sanctuary for professional waxing and beauty treatments.',
            heroOverlayColor: '#000000', heroOverlayOpacity: 0.5,
            heroButtonPrimaryBg: '#D4C1C2', heroButtonPrimaryText: '#2d2d2d',
            heroButtonSecondaryBg: 'transparent', heroButtonSecondaryText: '#FFFFFF',
            heroButtonSecondaryBorder: '#FFFFFF', mediaButtonPhotoBg: '#D4C1C2',
            mediaButtonPhotoText: '#2d2d2d', mediaButtonVideoBg: '#B0A0A1',
            mediaButtonVideoText: '#FFFFFF', mediaButtonGalleryBg: '#F7F5F5',
            mediaButtonGalleryText: '#2d2d2d', mediaButtonGalleryBorder: '#D4C1C2',
        },
        fontConfig: {
            headingFont: "'Montserrat', sans-serif", bodyFont: "'Roboto', sans-serif",
        },
        services: [
            { id: 1, name: 'Luxury Facial Treatment', description: 'A rejuvenating facial treatment customized to your skin type...', price: '$120', photoUrl: 'https://picsum.photos/seed/facial/600/400', videoUrl: 'https://www.youtube.com/watch?v=9g2wG8onorI', videoOrientation: 'landscape', layout: 'standard', promotion: 'Popular', discountPercentage: 0, showInPopup: false },
            { id: 2, name: 'Full Leg Waxing', description: 'Our professional waxing service leaves your legs smooth...', price: '$75', photoUrl: 'https://picsum.photos/seed/legwax/600/400', videoUrl: '', videoOrientation: 'landscape', layout: 'standard', promotion: '20% Off', discountPercentage: 20, showInPopup: false },
        ],
        featuredServices: [
            { id: 101, name: 'Featured Facial', description: 'An exclusive facial treatment...', price: '$150', photoUrl: 'https://picsum.photos/seed/feature1/600/400', videoUrl: '', videoOrientation: 'landscape', layout: 'standard', promotion: 'Homepage Special', discountPercentage: 10, showInPopup: true, showOnServicesPage: false },
            { id: 102, name: 'Deluxe Pedicure', description: 'Pamper your feet with our deluxe pedicure...', price: '$85', photoUrl: 'https://picsum.photos/seed/feature2/600/400', videoUrl: '', videoOrientation: 'landscape', layout: 'standard', promotion: 'Must Try!', discountPercentage: 0, showInPopup: true, showOnServicesPage: false },
        ],
        socialLinks: [{ id: 1, platform: 'instagram', url: 'https://instagram.com' }],
        customFields: [],
        reviews: [
            { id: 1, name: 'Jessica M.', comment: "An absolutely divine experience...", rating: 5, photoUrl: 'https://i.pravatar.cc/150?img=1', featured: true },
        ],
        whyChooseUsItems: [
            { id: 1, title: 'Expert Estheticians', description: 'Our certified professionals...' },
        ],
        seasonalOffer: { backgroundImage: 'https://picsum.photos/seed/offer/1200/600', title: 'Seasonal Rejuvenation Package', description: 'Indulge in our limited-time offer!', buttonText: 'Claim This Offer' },
        instagramFeed: { title: 'Follow Our Journey', username: '@edenspa_official', imageUrls: ['https://picsum.photos/seed/insta1/300/300'] },
        whatsappNumber: '+15551234567',
        whatsappMessage: 'Hello! I am interested in your services.',
        contactEmail: 'contact@edenspa.com',
        contactTip: 'For urgent inquiries, please call us.',
        userPassword: '2002', // Default password for first-time setup
        inactivityTimeout: 7,
        logoUrl: '',
        businessName: 'Eden Spa',
        tagline: 'Waxing & Beauty',
        showPhotoGallery: true,
        showVideoGallery: true,
        showMainGallery: true,
        galleryItems: [],
        showDesignerCredit: true,
        designerCreditUrl: 'https://x.com/kastebrands'
    };
};

// --- Database Initialization ---
let dbData;

try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log(`Created data directory at ${DATA_DIR}`);
    }
} catch (error) {
    console.error('FATAL: Failed to create data directory:', error);
    process.exit(1);
}

try {
    if (fs.existsSync(DB_PATH)) {
        dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        console.log(`Database loaded from ${DB_PATH}.`);
    } else {
        throw new Error('db.json not found, creating a new one.');
    }
} catch (error) {
    console.log(`Initializing new database: ${error.message}`);
    dbData = getInitialData();
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));
        console.log(`New db.json created successfully at ${DB_PATH}.`);
    } catch (writeError) {
        console.error(`FATAL: Could not write initial database file to ${DB_PATH}.`, writeError);
        process.exit(1);
    }
}

app.use(express.static(path.join(__dirname, 'dist')));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.emit('initialState', getPublicData(dbData));

    socket.on('authenticate', (password, callback) => {
        if (!password) {
            return callback({ success: false });
        }
        if (password === dbData.userPassword) {
            console.log(`Authentication success for user: ${socket.id}`);
            return callback({ success: true, mode: 'user' });
        }
        if (MASTER_PASSWORD && password === MASTER_PASSWORD) {
            console.log(`Authentication success for developer: ${socket.id}`);
            return callback({ success: true, mode: 'developer' });
        }
        console.log(`Authentication failed for: ${socket.id}`);
        return callback({ success: false });
    });

    socket.on('updateState', (newState) => {
        console.log('Received updateState from:', socket.id);
        
        const oldPassword = dbData.userPassword;
        dbData = { ...dbData, ...newState };

        // If the password was not part of the update payload, restore the old one.
        if (newState.userPassword === undefined) {
            dbData.userPassword = oldPassword;
        }

        fs.writeFile(DB_PATH, JSON.stringify(dbData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to database:', err);
                socket.emit('updateError', 'Failed to save changes.');
                return;
            }
            console.log('Database updated successfully.');
            io.emit('stateUpdate', getPublicData(dbData));
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
