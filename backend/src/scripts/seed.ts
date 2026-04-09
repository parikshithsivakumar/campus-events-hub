import { connectDB } from '../db/mongodb';
import bcrypt from 'bcrypt';
import { User, College } from '../models';

async function main() {
  console.log('Seeding MongoDB database...');
  
  await connectDB();

  // Create college
  const college = await College.findOneAndUpdate(
    { domain: 'demo.edu' },
    { name: 'Demo College', domain: 'demo.edu' },
    { upsert: true, new: true }
  );
  console.log('✓ College seeded:', college!.name);

  // Create super admin user
  const password = await bcrypt.hash('Password123', 10);
  const superUser = await User.findOneAndUpdate(
    { email: 'super@platform.local' },
    {
      email: 'super@platform.local',
      name: 'Super Admin',
      password,
      role: 'SUPER_ADMIN',
      collegeId: college!._id,
      isActive: true,
    },
    { upsert: true, new: true }
  );
  console.log('✓ Super Admin user seeded');

  // Create college admin
  const collegeAdminPassword = await bcrypt.hash('CollegeAdmin123', 10);
  const collegeAdmin = await User.findOneAndUpdate(
    { email: 'admin@demo.edu' },
    {
      email: 'admin@demo.edu',
      name: 'College Administrator',
      password: collegeAdminPassword,
      role: 'COLLEGE_ADMIN',
      collegeId: college!._id,
      isActive: true,
    },
    { upsert: true, new: true }
  );
  console.log('✓ College Admin user seeded');

  // Create faculty advisor
  const facultyPassword = await bcrypt.hash('Faculty123', 10);
  const faculty = await User.findOneAndUpdate(
    { email: 'faculty@demo.edu' },
    {
      email: 'faculty@demo.edu',
      name: 'Faculty Advisor',
      password: facultyPassword,
      role: 'FACULTY_ADVISOR',
      collegeId: college!._id,
      isActive: true,
    },
    { upsert: true, new: true }
  );
  console.log('✓ Faculty Advisor user seeded');

  // Create student organizer
  const studentPassword = await bcrypt.hash('Student123', 10);
  const student = await User.findOneAndUpdate(
    { email: 'student@demo.edu' },
    {
      email: 'student@demo.edu',
      name: 'Student Organizer',
      password: studentPassword,
      role: 'STUDENT_ORGANIZER',
      collegeId: college!._id,
      isActive: true,
    },
    { upsert: true, new: true }
  );
  console.log('✓ Student Organizer user seeded');

  console.log('\n✅ Seeding complete!')
  console.log('\nDemo credentials:');
  console.log('  Super Admin: super@platform.local / Password123');
  console.log('  College Admin: admin@demo.edu / CollegeAdmin123');
  console.log('  Faculty Advisor: faculty@demo.edu / Faculty123');
  console.log('  Student: student@demo.edu / Student123');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });