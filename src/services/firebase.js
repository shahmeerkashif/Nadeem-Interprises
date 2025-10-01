import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Products
export const getProducts = async (filters = {}) => {
  try {
    let queryConstraints = [];
    
    if (filters.category) {
      queryConstraints.push(where('category', '==', filters.category));
    }
    
    if (filters.isNewArrival) {
      queryConstraints.push(where('isNewArrival', '==', true));
    }
    
    if (filters.isOnSale) {
      queryConstraints.push(where('isOnSale', '==', true));
    }
    
    if (filters.inStock) {
      queryConstraints.push(where('stock', '>', 0));
    }
    
    // Only add orderBy if no other constraints that might conflict
    if (queryConstraints.length === 0) {
      queryConstraints.push(orderBy('name', 'asc'));
    }
    
    if (filters.limit) {
      queryConstraints.push(limit(filters.limit));
    }
    
    const q = queryConstraints.length > 0 
      ? query(collection(db, 'products'), ...queryConstraints)
      : collection(db, 'products');
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

export const getProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Gallery
export const getGalleryImages = async (section) => {
  try {
    let q;
    if (section) {
      q = query(
        collection(db, 'gallery'),
        where('section', '==', section)
      );
    } else {
      q = collection(db, 'gallery');
    }
    
    const snapshot = await getDocs(q);
    const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by order field, fallback to createdAt
    return images.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) return orderA - orderB;
      
      const dateA = a.createdAt?.toDate() || new Date(0);
      const dateB = b.createdAt?.toDate() || new Date(0);
      return dateA - dateB;
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

export const addGalleryImage = async (imageData) => {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), {
      ...imageData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id) => {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};

// Delivery Charges
export const getDeliveryCharges = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'deliveryCharges'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching delivery charges:', error);
    throw error;
  }
};

export const addDeliveryCharge = async (chargeData) => {
  try {
    const docRef = await addDoc(collection(db, 'deliveryCharges'), chargeData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding delivery charge:', error);
    throw error;
  }
};

export const updateDeliveryCharge = async (id, chargeData) => {
  try {
    const docRef = doc(db, 'deliveryCharges', id);
    await updateDoc(docRef, chargeData);
  } catch (error) {
    console.error('Error updating delivery charge:', error);
    throw error;
  }
};

export const deleteDeliveryCharge = async (id) => {
  try {
    await deleteDoc(doc(db, 'deliveryCharges', id));
  } catch (error) {
    console.error('Error deleting delivery charge:', error);
    throw error;
  }
};

// Orders
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const addHeroImage = async (url) => {
  await addDoc(collection(db, 'heroImages'), { url });
};

export const getHeroImages = async () => {
  const snapshot = await getDocs(collection(db, 'heroImages'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteHeroImage = async (id) => {
  await deleteDoc(doc(db, 'heroImages', id));
};

// Image handling - using external URLs or base64 strings stored in Firestore
export const validateImageUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// export const db = getFirestore(app);