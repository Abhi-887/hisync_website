# Contact Form API Documentation

## Overview
This is an enterprise-grade contact form API built with Laravel that integrates with a Next.js frontend. The system includes rate limiting, validation, admin dashboard, and comprehensive contact inquiry management.

## API Endpoints

### Public Endpoints

#### Submit Contact Form
```
POST /api/v1/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Acme Corp",
  "phone": "+1 (555) 123-4567",
  "service": "ERP Implementation",
  "message": "We need help with ERP implementation..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Thank you for your inquiry! We will get back to you within 24 hours.",
  "data": {
    "inquiry_id": 123,
    "reference_number": "HIS-000123",
    "status": "new",
    "submitted_at": "2025-07-07T16:50:00.000000Z"
  }
}
```

**Rate Limiting:** 5 requests per minute per IP address

### Admin Endpoints (Requires Authentication)

#### Get Contact Inquiries List
```
GET /api/v1/contact-inquiries
```

**Query Parameters:**
- `status`: Filter by status (new, in_progress, resolved, closed)
- `priority`: Filter by priority (low, medium, high, urgent)
- `search`: Search in name, email, company, or message
- `per_page`: Number of items per page (default: 15)

#### Get Contact Inquiry Statistics
```
GET /api/v1/contact-inquiries/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "new": 25,
    "in_progress": 12,
    "resolved": 100,
    "today": 5,
    "this_week": 18,
    "this_month": 45,
    "avg_response_time": 4.5,
    "top_services": {
      "ERP Implementation": 45,
      "Process Automation": 30,
      "Business Consulting": 25
    }
  }
}
```

## Web Routes (Admin Dashboard)

### Contact Inquiries Management
- `GET /contact-inquiries` - List all inquiries with filters
- `GET /contact-inquiries/{id}` - View inquiry details
- `PUT /contact-inquiries/{id}` - Update inquiry status/priority/assignment
- `DELETE /contact-inquiries/{id}` - Delete inquiry

## Database Schema

### contact_inquiries Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Contact person name |
| email | string | Email address |
| company | string (nullable) | Company name |
| phone | string (nullable) | Phone number |
| service | string (nullable) | Service of interest |
| message | text | Inquiry message |
| status | enum | new, in_progress, resolved, closed |
| priority | enum | low, medium, high, urgent |
| source | string | Source of inquiry (default: website) |
| metadata | json | Additional data (IP, user agent, etc.) |
| responded_at | timestamp (nullable) | When first responded |
| assigned_to | foreign key (nullable) | Assigned user ID |
| notes | text (nullable) | Internal notes |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update time |

## Features

### Security & Validation
- ✅ Comprehensive input validation
- ✅ Rate limiting (5 requests/minute per IP)
- ✅ Duplicate submission detection
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ CORS configuration for frontend integration

### Admin Features
- ✅ Real-time dashboard with statistics
- ✅ Advanced filtering and search
- ✅ Status and priority management
- ✅ User assignment system
- ✅ Internal notes system
- ✅ Responsive design

### Data Management
- ✅ Automatic metadata collection (IP, user agent, referer)
- ✅ Response time tracking
- ✅ Service popularity analytics
- ✅ Pagination for large datasets
- ✅ Export capabilities (planned)

## Setup Instructions

### Backend (Laravel)

1. **Install Dependencies:**
   ```bash
   composer install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup:**
   ```bash
   php artisan migrate
   php artisan db:seed --class=ContactInquirySeeder
   ```

4. **Start Development Server:**
   ```bash
   php artisan serve
   ```

### Frontend (Next.js)

1. **Environment Configuration:**
   Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Usage

### Frontend Integration

The Next.js contact form automatically submits to the Laravel API:

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify(formData),
});
```

### Admin Dashboard Access

1. Create a user account or login with test credentials
2. Navigate to `/contact-inquiries` to manage inquiries
3. Use filters and search to find specific inquiries
4. Click on individual inquiries to view details and update status

## Enterprise Features

### Performance
- Optimized database queries with proper indexing
- Efficient pagination for large datasets
- Background processing for email notifications (planned)

### Monitoring
- Comprehensive logging for all form submissions
- Error tracking and monitoring
- Performance metrics collection

### Scalability
- Stateless API design
- Database optimization for high volume
- Caching strategies (planned)
- Queue system for processing (planned)

## Future Enhancements

- [ ] Email notifications for new inquiries
- [ ] Auto-reply system for customers
- [ ] CRM integration (Salesforce, HubSpot)
- [ ] Advanced analytics and reporting
- [ ] Email templates management
- [ ] File attachment support
- [ ] Multi-language support
- [ ] API rate limiting per user
- [ ] Advanced spam detection
- [ ] Integration with ticketing systems

## Security Considerations

1. **Input Validation:** All inputs are validated both client-side and server-side
2. **Rate Limiting:** Prevents spam and abuse
3. **Duplicate Detection:** Prevents accidental duplicate submissions
4. **Data Sanitization:** All data is properly sanitized before storage
5. **Access Control:** Admin features require authentication
6. **CORS Configuration:** Properly configured for secure cross-origin requests

## Support

For technical support or questions about the API, please contact the development team.

## License

This project is proprietary software developed for Hisync.
