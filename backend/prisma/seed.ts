import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create initial roles
  const roles = [
    { name: RoleName.ADMIN },
    { name: RoleName.FM },
    { name: RoleName.TECH },
    { name: RoleName.VENDOR },
    { name: RoleName.VIEWER },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Create test site
  const testSite = await prisma.site.upsert({
    where: { id: 'test-site-1' },
    update: {},
    create: {
      id: 'test-site-1',
      name: 'Main Campus',
      address: '123 Business Park Dr',
      city: 'Atlanta',
      state: 'GA',
      zip: '30309',
    },
  });

  // Create test building
  const testBuilding = await prisma.building.upsert({
    where: { id: 'test-building-1' },
    update: {},
    create: {
      id: 'test-building-1',
      name: 'Building A',
      siteId: testSite.id,
    },
  });

  // Create test area
  const testArea = await prisma.area.upsert({
    where: { id: 'test-area-1' },
    update: {},
    create: {
      id: 'test-area-1',
      name: 'Production Floor',
      buildingId: testBuilding.id,
    },
  });

  // Create test asset
  const testAsset = await prisma.asset.upsert({
    where: { id: 'test-asset-1' },
    update: {},
    create: {
      id: 'test-asset-1',
      name: 'HVAC Unit #1',
      areaId: testArea.id,
      serialNumber: 'HVAC-001',
      model: 'RTU-5000',
      manufacturer: 'Carrier',
      installDate: new Date('2023-01-15'),
      status: 'ACTIVE',
    },
  });

  // Create test work order
  const testWorkOrder = await prisma.workOrder.upsert({
    where: { id: 'test-workorder-1' },
    update: {},
    create: {
      id: 'test-workorder-1',
      title: 'HVAC Maintenance Required',
      description: 'Annual maintenance check for HVAC Unit #1 including filter replacement and system inspection',
      status: 'OPEN',
      priority: 'MEDIUM',
      siteId: testSite.id,
      areaId: testArea.id,
      assetId: testAsset.id,
      requesterId: 'test-user-1', // This would be a real user ID in production
    },
  });

  // Create test comment for the work order
  await prisma.workOrderComment.upsert({
    where: { id: 'test-comment-1' },
    update: {},
    create: {
      id: 'test-comment-1',
      workOrderId: testWorkOrder.id,
      userId: 'test-user-1', // This would be a real user ID in production
      message: 'Work order created. Scheduling maintenance for next week.',
    },
  });

  // Create test maintenance template
  const testMaintenanceTemplate = await prisma.maintenanceTemplate.upsert({
    where: { id: 'test-template-1' },
    update: {},
    create: {
      id: 'test-template-1',
      title: 'Monthly HVAC Filter Replacement',
      description: 'Replace air filters in HVAC Unit #1 and inspect system operation',
      frequency: 'MONTHLY',
      priority: 'MEDIUM',
      siteId: testSite.id,
      areaId: testArea.id,
      assetId: testAsset.id,
      assignedToId: 'test-user-1', // This would be a real user ID in production
    },
  });

  // Create test maintenance occurrence
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  await prisma.maintenanceOccurrence.upsert({
    where: { id: 'test-occurrence-1' },
    update: {},
    create: {
      id: 'test-occurrence-1',
      templateId: testMaintenanceTemplate.id,
      scheduledDate: nextMonth,
      status: 'PENDING',
    },
  });

  console.log('Database seeded successfully!');

  // Create test vendors
  const testVendor1 = await prisma.vendor.upsert({
    where: { id: 'test-vendor-1' },
    update: {},
    create: {
      id: 'test-vendor-1',
      name: 'HVAC Solutions Inc',
      contactName: 'John Smith',
      contactEmail: 'john@hvacsolutions.com',
      contactPhone: '(555) 123-4567',
      serviceCategories: ['HVAC', 'Electrical', 'Plumbing'],
      insuranceExpiresAt: new Date('2024-12-31'),
      active: true,
    },
  });

  const testVendor2 = await prisma.vendor.upsert({
    where: { id: 'test-vendor-2' },
    update: {},
    create: {
      id: 'test-vendor-2',
      name: 'Facility Maintenance Pro',
      contactName: 'Sarah Johnson',
      contactEmail: 'sarah@facilitypro.com',
      contactPhone: '(555) 987-6543',
      serviceCategories: ['General Maintenance', 'Cleaning', 'Security'],
      insuranceExpiresAt: new Date('2025-06-30'),
      active: true,
    },
  });

  // Create test vendor assignment
  await prisma.vendorAssignment.upsert({
    where: { id: 'test-assignment-1' },
    update: {},
    create: {
      id: 'test-assignment-1',
      vendorId: testVendor1.id,
      workOrderId: testWorkOrder.id,
      status: 'PENDING',
      notes: 'Assigned for HVAC maintenance expertise',
    },
  });

  console.log('Vendors and assignments seeded successfully!');

  // Create test capital project
  const testCapitalProject = await prisma.capitalProject.upsert({
    where: { id: 'test-capital-project-1' },
    update: {},
    create: {
      id: 'test-capital-project-1',
      title: 'Main Campus Roof Replacement',
      description: 'Complete roof replacement for Building A including new membrane, insulation, and drainage systems',
      siteId: testSite.id,
      budget: 250000,
      startDate: new Date('2024-03-01'),
      targetCompletionDate: new Date('2024-06-30'),
      status: 'PLANNING',
      createdById: 'test-user-1', // This would be a real user ID in production
    },
  });

  // Create test phases
  const phase1 = await prisma.capitalProjectPhase.upsert({
    where: { id: 'test-phase-1' },
    update: {},
    create: {
      id: 'test-phase-1',
      projectId: testCapitalProject.id,
      title: 'Phase 1: Planning & Permits',
      description: 'Obtain necessary permits and finalize construction plans',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      status: 'IN_PROGRESS',
      costEstimate: 15000,
    },
  });

  const phase2 = await prisma.capitalProjectPhase.upsert({
    where: { id: 'test-phase-2' },
    update: {},
    create: {
      id: 'test-phase-2',
      projectId: testCapitalProject.id,
      title: 'Phase 2: Material Procurement',
      description: 'Order and receive all roofing materials and equipment',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      status: 'NOT_STARTED',
      costEstimate: 180000,
    },
  });

  const phase3 = await prisma.capitalProjectPhase.upsert({
    where: { id: 'test-phase-3' },
    update: {},
    create: {
      id: 'test-phase-3',
      projectId: testCapitalProject.id,
      title: 'Phase 3: Installation',
      description: 'Remove old roof and install new roofing system',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-06-30'),
      status: 'NOT_STARTED',
      costEstimate: 55000,
    },
  });

  // Create test comment
  await prisma.capitalProjectComment.upsert({
    where: { id: 'test-capital-comment-1' },
    update: {},
    create: {
      id: 'test-capital-comment-1',
      projectId: testCapitalProject.id,
      userId: 'test-user-1', // This would be a real user ID in production
      message: 'Project approved by board. Moving forward with Phase 1 planning and permit acquisition.',
    },
  });

  console.log('Capital projects seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });