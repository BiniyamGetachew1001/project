import { supabase } from '../lib/supabase';
import { Book, BusinessPlan } from '../types/database';

// Mock books data
const mockBooks: Omit<Book, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    is_premium: false,
    description: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses',
    read_time: '15 min',
    cover_image: 'https://m.media-amazon.com/images/I/51T-sMqSMiL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    content: {
      summary: 'The Lean Startup provides a scientific approach to creating and managing startups and getting a desired product to customers\' hands faster. The Lean Startup method teaches you how to drive a startup—how to steer, when to turn, and when to persevere—and grow a business with maximum acceleration.',
      keyPoints: [
        'Build-Measure-Learn feedback loop is the core of the Lean Startup methodology',
        'Validated learning is the process of demonstrating empirically that a team has discovered valuable truths about a startup\'s present and future business prospects',
        'Minimum Viable Product (MVP) helps entrepreneurs start the process of learning as quickly as possible',
        'Innovation accounting allows startups to objectively prove they are learning how to grow a sustainable business'
      ],
      chapters: [
        {
          title: 'Chapter 1: Start',
          content: 'The Lean Startup method is based on lean manufacturing principles, agile development methodologies, and the scientific method. It aims to eliminate waste and increase value-creating practices during the product development phase.'
        },
        {
          title: 'Chapter 2: Define',
          content: 'A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty. The goal of a startup is to figure out the right thing to build—the thing customers want and will pay for—as quickly as possible.'
        },
        {
          title: 'Chapter 3: Learn',
          content: 'The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere. All successful startup processes should be geared to accelerate that feedback loop.'
        }
      ],
      quotes: [
        'The only way to win is to learn faster than anyone else.',
        'Success is not delivering a feature; success is learning how to solve the customer\'s problem.',
        'As you consider building your own minimum viable product, let this simple rule suffice: remove any feature, process, or effort that does not contribute directly to the learning you seek.'
      ]
    }
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    is_premium: false,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    read_time: '12 min',
    cover_image: 'https://m.media-amazon.com/images/I/51-nXsSRfZL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    content: {
      summary: 'Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      keyPoints: [
        'Small habits make a big difference over time',
        'Focus on your identity, not just your goals',
        'The four laws of behavior change: make it obvious, make it attractive, make it easy, make it satisfying',
        'Environment design is more important than motivation'
      ],
      chapters: [
        {
          title: 'Chapter 1: The Surprising Power of Atomic Habits',
          content: 'Habits are the compound interest of self-improvement. Getting 1 percent better every day counts for a lot in the long-run. Small changes often appear to make no difference until you cross a critical threshold.'
        },
        {
          title: 'Chapter 2: How Your Habits Shape Your Identity',
          content: 'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become. Your identity emerges out of your habits.'
        },
        {
          title: 'Chapter 3: How to Build Better Habits',
          content: 'The process of building a habit can be divided into four simple steps: cue, craving, response, and reward. Understanding these steps is the key to understanding how habits work.'
        }
      ],
      quotes: [
        'You do not rise to the level of your goals. You fall to the level of your systems.',
        'Every action you take is a vote for the type of person you wish to become.',
        'Habits are the compound interest of self-improvement.'
      ]
    }
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business',
    is_premium: false,
    description: 'Notes on Startups, or How to Build the Future',
    read_time: '10 min',
    cover_image: 'https://m.media-amazon.com/images/I/41puRJbtwkL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    content: {
      summary: 'Zero to One presents at once an optimistic view of the future of progress in America and a new way of thinking about innovation: it starts by learning to ask the questions that lead you to find value in unexpected places.',
      keyPoints: [
        'Creating something new is going from 0 to 1, while copying things that work is going from 1 to n',
        'The most valuable businesses solve unique problems',
        'Competition is overrated; monopolies drive progress',
        'Successful people find value in unexpected places'
      ],
      chapters: [
        {
          title: 'Chapter 1: The Challenge of the Future',
          content: 'Progress can take two forms: horizontal progress (copying things that work) or vertical progress (doing new things). Horizontal progress is easy but vertical progress is difficult.'
        },
        {
          title: 'Chapter 2: Party Like It\'s 1999',
          content: 'The dot-com crash taught entrepreneurs the wrong lessons. Instead of learning to be bold and have vision, they learned to be unoriginal and incremental.'
        },
        {
          title: 'Chapter 3: All Happy Companies Are Different',
          content: 'Monopolies drive progress because they can think long-term and invest in innovation. Competition, on the other hand, leads to commoditization and lack of profits.'
        }
      ],
      quotes: [
        'What important truth do very few people agree with you on?',
        'The most contrarian thing of all is not to oppose the crowd but to think for yourself.',
        'Monopoly is the condition of every successful business.'
      ]
    }
  }
];

// Function to add mock books to the database
export const addMockBooks = async () => {
  console.log('Adding mock books to the database...');
  
  for (const book of mockBooks) {
    const { data, error } = await supabase
      .from('books')
      .insert([book])
      .select();
    
    if (error) {
      console.error('Error adding mock book:', error);
    } else {
      console.log('Added book:', data[0].title, 'with ID:', data[0].id);
    }
  }
  
  console.log('Finished adding mock books.');
};

// Function to get all books from the database
export const getAllBooks = async () => {
  const { data, error } = await supabase
    .from('books')
    .select('*');
  
  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }
  
  return data;
};
