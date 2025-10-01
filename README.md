# Onyx - Premium Jewelry E-commerce Website

A complete e-commerce website built with React.js and Firebase for selling premium jewelry with a clean black and white design.

## Features

### Frontend Features
- **Homepage**: Hero section with New Arrivals and Sales sections
- **Product Catalog**: Complete product listing with filters (price, category, stock)
- **Product Details**: Individual product pages with image sliders
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout**: Complete checkout process with delivery charge calculation
- **Gallery**: Four sections (Factory, Machinery, Showroom, Products) with image sliders and modals
- **Delivery Information**: City-wise delivery charges page
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile

### Admin Panel Features
- **Authentication**: Secure admin login with Firebase Auth
- **Product Management**: Add, edit, delete products with image URLs
- **Order Management**: View and update order status
- **Gallery Management**: Manage gallery images for all sections
- **Delivery Management**: Configure delivery charges by city

### Technical Features
- **React.js**: Modern React with hooks and functional components
- **Firebase**: Firestore database and Authentication (no storage)
- **Framer Motion**: Smooth animations and transitions
- **React Slick**: Image sliders and carousels
- **Context API**: Cart state management with localStorage
- **Responsive CSS**: Mobile-first design approach

## Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   ├── ProductManagement.js
│   │   ├── OrderManagement.js
│   │   ├── GalleryManagement.js
│   │   ├── DeliveryManagement.js
│   │   └── AdminComponents.css
│   ├── Layout/
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   └── Product/
│       ├── ProductCard.js
│       ├── ProductCard.css
│       ├── ProductFilters.js
│       └── ProductFilters.css
├── context/
│   └── CartContext.js
├── firebase/
│   └── config.js
├── pages/
│   ├── Admin/
│   │   ├── AdminLogin.js
│   │   ├── AdminLogin.css
│   │   ├── AdminDashboard.js
│   │   └── AdminDashboard.css
│   ├── Homepage.js
│   ├── Homepage.css
│   ├── ProductListing.js
│   ├── ProductListing.css
│   ├── ProductDetail.js
│   ├── ProductDetail.css
│   ├── Cart.js
│   ├── Cart.css
│   ├── Checkout.js
│   ├── Checkout.css
│   ├── DeliveryCharges.js
│   ├── DeliveryCharges.css
│   ├── Gallery.js
│   └── Gallery.css
├── services/
│   └── firebase.js
├── App.js
├── App.css
├── index.js
└── index.css
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication with Email/Password
4. Get your Firebase config from Project Settings
5. Update `src/firebase/config.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Firestore Database Setup

Create the following collections in Firestore:

#### Products Collection
```javascript
{
  name: "Diamond Ring",
  description: "Beautiful diamond ring",
  price: 299.99,
  salePrice: 249.99, // optional
  category: "rings", // rings, necklaces, bracelets, earrings
  stock: 10,
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  isNewArrival: true,
  isOnSale: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Gallery Collection
```javascript
{
  section: "factory", // factory, machinery, showroom, products
  title: "Manufacturing Floor",
  description: "Our state-of-the-art manufacturing facility",
  url: "https://example.com/gallery-image.jpg",
  order: 1,
  createdAt: timestamp
}
```

#### DeliveryCharges Collection
```javascript
{
  city: "New York",
  charge: 15.00,
  estimatedDays: "2-3"
}
```

#### Orders Collection
```javascript
{
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    city: "New York",
    postalCode: "10001",
    notes: "Leave at door"
  },
  items: [
    {
      id: "product-id",
      name: "Diamond Ring",
      price: 299.99,
      salePrice: 249.99,
      quantity: 1,
      images: ["https://example.com/image.jpg"]
    }
  ],
  subtotal: 249.99,
  deliveryCharge: 15.00,
  total: 264.99,
  status: "pending", // pending, processing, shipped, delivered, cancelled
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4. Admin User Setup

Create an admin user in Firebase Authentication:
1. Go to Firebase Console > Authentication > Users
2. Add a new user with email and password
3. Use these credentials to login to the admin panel at `/admin`

### 5. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Customer Features
- Browse products on the homepage
- Filter products by category, price, and availability
- View detailed product information with image gallery
- Add products to cart and manage quantities
- Complete checkout with delivery information
- View delivery charges by city
- Browse company gallery

### Admin Features
- Login at `/admin` with Firebase credentials
- Manage products (add, edit, delete)
- View and update order status
- Manage gallery images for all sections
- Configure delivery charges by city

## Deployment

The application can be deployed to any static hosting service:

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure environment variables for Firebase

### Vercel
1. Connect your repository to Vercel
2. Configure build settings
3. Add Firebase configuration as environment variables

## Design Theme

- **Colors**: Black (#000000) and White (#ffffff)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Layout**: Minimal design with focus on products
- **Responsive**: Mobile-first approach with breakpoints at 768px and 480px
- **Animations**: Smooth transitions using Framer Motion

## Dependencies

- React 18.2.0
- React Router DOM 6.3.0
- Firebase 9.9.0
- Framer Motion 7.2.1
- React Slick 0.29.0
- Slick Carousel 1.8.1

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is for educational and commercial use.
