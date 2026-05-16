import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@leads.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const salesUser = await User.create({
      name: 'Sales User',
      email: 'sales@leads.com',
      password: 'Sales@123',
      role: 'sales',
    });

    console.log('👥 Users created');

    // Seed leads
    const leads = [
      { name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Qualified', source: 'Instagram', notes: 'Very interested in our services', createdBy: adminUser._id },
      { name: 'Priya Patel', email: 'priya@example.com', status: 'New', source: 'Website', notes: 'Filled contact form', createdBy: salesUser._id },
      { name: 'Amit Kumar', email: 'amit@example.com', status: 'Contacted', source: 'Referral', notes: 'Referred by existing client', createdBy: adminUser._id },
      { name: 'Sneha Gupta', email: 'sneha@example.com', status: 'Lost', source: 'Website', notes: 'Went with competitor', createdBy: salesUser._id },
      { name: 'Vikram Singh', email: 'vikram@example.com', status: 'New', source: 'Instagram', createdBy: adminUser._id },
      { name: 'Ananya Roy', email: 'ananya@example.com', status: 'Qualified', source: 'Referral', notes: 'High potential client', createdBy: salesUser._id },
      { name: 'Rohan Mehta', email: 'rohan@example.com', status: 'Contacted', source: 'Website', createdBy: adminUser._id },
      { name: 'Kavya Nair', email: 'kavya@example.com', status: 'New', source: 'Instagram', notes: 'DM via Instagram', createdBy: salesUser._id },
      { name: 'Arjun Reddy', email: 'arjun@example.com', status: 'Qualified', source: 'Website', notes: 'Scheduled demo', createdBy: adminUser._id },
      { name: 'Deepika Joshi', email: 'deepika@example.com', status: 'Contacted', source: 'Referral', createdBy: salesUser._id },
      { name: 'Sanjay Verma', email: 'sanjay@example.com', status: 'New', source: 'Website', createdBy: adminUser._id },
      { name: 'Meera Krishnan', email: 'meera@example.com', status: 'Lost', source: 'Instagram', notes: 'Not interested anymore', createdBy: salesUser._id },
    ];

    await Lead.insertMany(leads);
    console.log('📊 Leads seeded');

    console.log('\n✅ Seeding complete!');
    console.log('👤 Admin: admin@leads.com / Admin@123');
    console.log('👤 Sales: sales@leads.com / Sales@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
