import { supabase } from './supabase';
import { mockSummaries, businessPlans } from '../data/mockData';

export const migrateData = async () => {
  try {
    // Migrate books
    console.log('Migrating books...');
    for (const book of mockSummaries) {
      try {
        const { error } = await supabase
          .from('books')
          .insert({
            title: book.title,
            author: book.author,
            category: book.category,
            is_premium: book.isPremium,
            description: book.description,
            read_time: book.readTime,
            cover_image: book.coverImage,
            content: book.content || null
          });

        if (error) {
          console.error('Error inserting book:', error);
          throw error;
        }
        console.log(`Successfully inserted book: ${book.title}`);
      } catch (err) {
        console.error(`Failed to insert book ${book.title}:`, err);
        throw err;
      }
    }

    // Migrate business plans
    console.log('Migrating business plans...');
    for (const plan of businessPlans) {
      try {
        const { error } = await supabase
          .from('business_plans')
          .insert({
            title: plan.title,
            icon: plan.icon,
            description: plan.description,
            investment: plan.investment,
            is_premium: plan.isPremium,
            category: plan.category,
            cover_image: plan.coverImage
          });

        if (error) {
          console.error('Error inserting business plan:', error);
          throw error;
        }
        console.log(`Successfully inserted business plan: ${plan.title}`);
      } catch (err) {
        console.error(`Failed to insert business plan ${plan.title}:`, err);
        throw err;
      }
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}; 