# St. Gabriel Chaplaincy Registration System

A professional, responsive web-based registration system for Catholic church members with integrated payment processing and admin management.

## Features

### 🎨 Professional Design
- Modern glass-morphism UI with gradient backgrounds
- Fully responsive design (mobile, tablet, desktop)
- Professional typography and visual hierarchy
- Smooth animations and transitions

### 👥 Member Registration
- Comprehensive registration form with validation
- Personal information collection
- Church ministry selection
- Sacrament status tracking
- Years in Catholic faith tracking
- Passport photo upload for ID cards

### 💳 Payment Integration
- **Flutterwave**: Secure card payments
- **Bank Transfer**: Direct bank transfer with receipt upload
- **USSD Payments**: Support for all major Nigerian banks
- Payment verification and tracking

### 🔐 Admin Dashboard
- Password-protected admin access (`admin123`)
- Real-time member statistics
- Search and filter functionality
- Member profile management
- ID card generation and printing
- Status tracking (Pending/Processed)
- Data export functionality

### 📱 Mobile Optimized
- Touch-friendly interface
- Responsive forms and layouts
- Mobile payment optimization
- Optimized file uploads

## File Structure

\`\`\`
├── index.html          # Public registration form
├── admin.html          # Admin dashboard (password protected)
└── README.md          # Documentation
\`\`\`

## Setup Instructions

### 1. Basic Setup
1. Download all files to your web server
2. Ensure your web server supports HTML5 and JavaScript
3. No database setup required (uses localStorage for demo)

### 2. Customization
- **Church Name**: Update "St. Gabriel Chaplaincy" throughout the files
- **Contact Info**: Update phone, email, and address in footer
- **Bank Details**: Update bank transfer information in payment modal
- **Admin Password**: Change `ADMIN_PASSWORD` in admin.html (default: `admin123`)

### 3. Payment Integration
- **Flutterwave**: Replace demo implementation with actual Flutterwave API
- **Bank Details**: Update with actual church bank account information
- **USSD Codes**: Verify and update USSD codes for current banks

## Usage

### For Visitors
1. Visit `index.html`
2. Fill out the registration form
3. Upload passport photograph
4. Choose payment method and complete payment
5. Receive member ID and confirmation

### For Administrators
1. Visit `admin.html` or add `/admin.html` to your site URL
2. Enter admin password (default: `admin123`)
3. View all member registrations
4. Generate and print ID cards
5. Mark members as processed
6. Export member data

## Security Features

- **Hidden Admin Access**: No visible links to admin panel from public pages
- **Password Protection**: Admin dashboard requires authentication
- **Data Validation**: Comprehensive form validation
- **Secure File Uploads**: File type and size restrictions
- **Privacy Protection**: Member data only accessible to admin

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Options

### GitHub Pages
1. Create a new GitHub repository
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Access via `https://yourusername.github.io/repository-name`

### Web Hosting
1. Upload files to your web hosting provider
2. Ensure HTML5 and JavaScript support
3. Configure custom domain if needed

### Local Development
1. Use a local web server (e.g., Live Server in VS Code)
2. Open `index.html` in your browser
3. Test all functionality locally

## Customization Guide

### Colors and Branding
- Update CSS custom properties in the `<style>` sections
- Replace gradient colors with your church colors
- Update logo and branding elements

### Form Fields
- Add/remove form fields in the registration form
- Update validation rules accordingly
- Modify admin dashboard to display new fields

### Payment Methods
- Add new payment providers
- Update payment processing logic
- Modify payment confirmation flows

## Data Management

### Storage
- Currently uses browser localStorage for demo purposes
- For production, integrate with a backend database
- Consider using Firebase, Supabase, or traditional databases

### Backup
- Export member data regularly using admin dashboard
- Store backups securely
- Consider automated backup solutions

## Support and Maintenance

### Regular Updates
- Update payment provider integrations
- Review and update security measures
- Test across different browsers and devices

### Monitoring
- Monitor registration submissions
- Track payment success rates
- Review admin access logs

## License

This project is provided as-is for educational and church use. Modify as needed for your specific requirements.

## Contact

For support or customization requests, contact your web developer or system administrator.

---

**Built with ❤️ for St. Gabriel Chaplaincy Community**
