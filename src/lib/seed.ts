import { db } from './firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { PRODUCTS } from '../constants';

export const seedDatabase = async () => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (productsSnapshot.empty) {
      console.log('Seeding database with default products...');
      for (const product of PRODUCTS) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...productData } = product;
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      console.log('Seeding complete.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
