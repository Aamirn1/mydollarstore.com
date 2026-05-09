import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.partnerPayout.deleteMany();
  await prisma.partnerApplication.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mydollarstore.com',
      name: 'Admin User',
      password: hashedPassword,
      phone: '+1-555-0100',
      address: '100 Admin Street',
      city: 'New York',
      role: 'admin',
      avatar: null,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create a sample customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: customerPassword,
      phone: '+1-555-0200',
      address: '200 Customer Lane',
      city: 'Los Angeles',
      role: 'customer',
    },
  });
  console.log('✅ Created customer user:', customer.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: 'camera-drones',
        title: 'Camera Drones',
        subtitle: 'Professional Aerial Photography',
        description: 'Professional camera drones for aerial photography and videography. Capture stunning footage from the sky with advanced camera systems and intelligent flight modes.',
        imageUrl: '/products/category-camera-drones.png',
        productCount: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'racing-drones',
        title: 'Racing Drones',
        subtitle: 'High-Speed FPV Racing',
        description: 'High-speed FPV racing drones built for adrenaline-pumping performance. Experience the thrill of first-person view flight with powerful motors and agile frames.',
        imageUrl: '/products/category-racing-drones.png',
        productCount: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'beginner-drones',
        title: 'Beginner Drones',
        subtitle: 'Easy to Fly',
        description: 'Easy-to-fly drones perfect for beginners. Features like GPS stabilization, auto-hover, and return-to-home make learning to fly a breeze.',
        imageUrl: '/products/category-beginner-drones.png',
        productCount: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'mini-drones',
        title: 'Mini Drones',
        subtitle: 'Compact & Portable',
        description: 'Compact and portable drones under 249g. Perfect for travel and everyday aerial photography without registration requirements in most countries.',
        imageUrl: '/products/category-mini-drones.png',
        productCount: 3,
      },
    }),
  ]);
  console.log('✅ Created', categories.length, 'categories');

  // Create products
  const products = [
    // Camera Drones
    {
      name: 'DJI Mavic 3 Pro',
      slug: 'dji-mavic-3-pro',
      price: 2199,
      originalPrice: 2499,
      categorySlug: 'camera-drones',
      imageUrl: '/products/dji-mavic-3-pro.png',
      images: JSON.stringify([
        '/products/dji-mavic-3-pro.png',
        '/products/dji-mavic-3-pro-2.png',
        '/products/dji-mavic-3-pro-3.png',
      ]),
      description:
        'Professional-grade camera drone with Hasselblad camera, 43-minute flight time, and omnidirectional obstacle sensing. Perfect for aerial photography and cinematography.',
      specifications: JSON.stringify({
        flightTime: '43 min',
        range: '15 km',
        camera: 'Hasselblad 4/3 CMOS, 20MP',
        weight: '958g',
        maxSpeed: '21 m/s',
        gps: 'GPS + GLONASS + Galileo',
        gimbal: '3-axis mechanical gimbal',
        sensors: 'Omnidirectional obstacle sensing',
        battery: '5000 mAh LiPo 3S',
      }),
      rating: 4.9,
      reviewCount: 289,
      tag: 'Best Seller',
      brand: 'DJI',
      inStock: true,
      stockCount: 15,
    },
    {
      name: 'Autel EVO Lite+',
      slug: 'autel-evo-lite-plus',
      price: 1499,
      originalPrice: 1699,
      categorySlug: 'camera-drones',
      imageUrl: '/products/autel-evo-lite-plus.png',
      images: JSON.stringify([
        '/products/autel-evo-lite-plus.png',
        '/products/autel-evo-lite-plus-2.png',
      ]),
      description:
        'Premium camera drone with 1-inch CMOS sensor, 40-minute flight time, and 4K HDR video. Ideal for content creators.',
      specifications: JSON.stringify({
        flightTime: '40 min',
        range: '10 km',
        camera: '1-inch CMOS, 50MP, 4K HDR',
        weight: '835g',
        maxSpeed: '18 m/s',
        gps: 'GPS + GLONASS',
        gimbal: '3-axis stabilized gimbal',
        sensors: 'Tri-directional obstacle avoidance',
        battery: '6175 mAh LiPo 3S',
      }),
      rating: 4.7,
      reviewCount: 156,
      tag: 'Popular',
      brand: 'Autel',
      inStock: true,
      stockCount: 22,
    },
    {
      name: 'DJI Air 2S',
      slug: 'dji-air-2s',
      price: 999,
      originalPrice: 1199,
      categorySlug: 'camera-drones',
      imageUrl: '/products/dji-air-2s.png',
      images: JSON.stringify([
        '/products/dji-air-2s.png',
        '/products/dji-air-2s-2.png',
      ]),
      description:
        'Compact camera drone with 1-inch sensor, 5.4K video, and intelligent tracking. The perfect balance of portability and performance.',
      specifications: JSON.stringify({
        flightTime: '31 min',
        range: '12 km',
        camera: '1-inch CMOS, 20MP, 5.4K video',
        weight: '595g',
        maxSpeed: '19 m/s',
        gps: 'GPS + GLONASS + Galileo',
        gimbal: '3-axis mechanical gimbal',
        sensors: 'Forward, backward, upward, downward',
        battery: '3500 mAh LiPo 3S',
      }),
      rating: 4.8,
      reviewCount: 243,
      tag: 'Popular',
      brand: 'DJI',
      inStock: true,
      stockCount: 30,
    },

    // Racing Drones
    {
      name: 'EMAX Tinyhawk II',
      slug: 'emax-tinyhawk-ii',
      price: 199,
      originalPrice: 249,
      categorySlug: 'racing-drones',
      imageUrl: '/products/emax-tinyhawk-ii.png',
      images: JSON.stringify([
        '/products/emax-tinyhawk-ii.png',
        '/products/emax-tinyhawk-ii-2.png',
      ]),
      description:
        'Entry-level FPV racing drone with powerful motors and agile flight characteristics. Perfect for beginners in drone racing.',
      specifications: JSON.stringify({
        flightTime: '8 min',
        range: '200 m',
        camera: '700TVL FPV camera',
        weight: '28g (ducts on)',
        maxSpeed: '60 mph',
        gps: 'None',
        gimbal: 'Fixed camera mount',
        sensors: 'None',
        battery: '450 mAh 1S LiPo',
      }),
      rating: 4.5,
      reviewCount: 178,
      tag: 'New',
      brand: 'EMAX',
      inStock: true,
      stockCount: 45,
    },
    {
      name: 'iFlight Nazgul5 V2',
      slug: 'iflight-nazgul5-v2',
      price: 449,
      originalPrice: 499,
      categorySlug: 'racing-drones',
      imageUrl: '/products/iflight-nazgul5-v2.png',
      images: JSON.stringify([
        '/products/iflight-nazgul5-v2.png',
        '/products/iflight-nazgul5-v2-2.png',
      ]),
      description:
        'Professional FPV racing freestyle drone with XING-E motors and robust carbon fiber frame. Built for speed and durability.',
      specifications: JSON.stringify({
        flightTime: '10 min',
        range: '1 km',
        camera: 'Caddx Ratel 2 FPV camera',
        weight: '315g (without battery)',
        maxSpeed: '100+ mph',
        gps: 'Optional module',
        gimbal: 'Fixed camera, adjustable tilt',
        sensors: 'None',
        battery: '1300 mAh 6S LiPo',
      }),
      rating: 4.8,
      reviewCount: 132,
      tag: 'Best Seller',
      brand: 'iFlight',
      inStock: true,
      stockCount: 18,
    },
    {
      name: 'TBS Source One V5',
      slug: 'tbs-source-one-v5',
      price: 379,
      originalPrice: 429,
      categorySlug: 'racing-drones',
      imageUrl: '/products/tbs-source-one-v5.png',
      images: JSON.stringify([
        '/products/tbs-source-one-v5.png',
        '/products/tbs-source-one-v5-2.png',
      ]),
      description:
        'Open-source FPV freestyle frame with premium electronics. Customizable racing drone for experienced pilots.',
      specifications: JSON.stringify({
        flightTime: '10 min',
        range: '1.5 km',
        camera: 'Runcam Phoenix 2',
        weight: '340g (without battery)',
        maxSpeed: '95+ mph',
        gps: 'Optional module',
        gimbal: 'Fixed camera, adjustable tilt',
        sensors: 'None',
        battery: '1300 mAh 6S LiPo',
      }),
      rating: 4.6,
      reviewCount: 89,
      tag: 'Sale',
      brand: 'TBS',
      inStock: true,
      stockCount: 12,
    },

    // Beginner Drones
    {
      name: 'DJI Mini SE',
      slug: 'dji-mini-se',
      price: 369,
      originalPrice: 429,
      categorySlug: 'beginner-drones',
      imageUrl: '/products/dji-mini-se.png',
      images: JSON.stringify([
        '/products/dji-mini-se.png',
        '/products/dji-mini-se-2.png',
      ]),
      description:
        'Ultra-lightweight beginner drone under 249g with 30-minute flight time and 2.7K camera. No registration required in most countries.',
      specifications: JSON.stringify({
        flightTime: '30 min',
        range: '10 km',
        camera: '12MP, 2.7K video',
        weight: '249g',
        maxSpeed: '13 m/s',
        gps: 'GPS + GLONASS + Galileo',
        gimbal: '3-axis mechanical gimbal',
        sensors: 'Downward vision and infrared',
        battery: '2250 mAh LiPo 3S',
      }),
      rating: 4.7,
      reviewCount: 267,
      tag: 'Best Seller',
      brand: 'DJI',
      inStock: true,
      stockCount: 35,
    },
    {
      name: 'Holy Stone HS720E',
      slug: 'holy-stone-hs720e',
      price: 299,
      originalPrice: 349,
      categorySlug: 'beginner-drones',
      imageUrl: '/products/holy-stone-hs720e.png',
      images: JSON.stringify([
        '/products/holy-stone-hs720e.png',
        '/products/holy-stone-hs720e-2.png',
      ]),
      description:
        'GPS-assisted beginner drone with 4K camera, 26-minute flight time, and automatic return-to-home. Easy and safe to fly.',
      specifications: JSON.stringify({
        flightTime: '26 min',
        range: '1 km',
        camera: '4K UHD, EIS stabilized',
        weight: '495g',
        maxSpeed: '10 m/s',
        gps: 'GPS assisted',
        gimbal: 'Electronic image stabilization',
        sensors: 'GPS return-to-home, altitude hold',
        battery: '2800 mAh LiPo 2S',
      }),
      rating: 4.4,
      reviewCount: 198,
      tag: 'Popular',
      brand: 'Holy Stone',
      inStock: true,
      stockCount: 28,
    },
    {
      name: 'Ryze Tello',
      slug: 'ryze-tello',
      price: 129,
      originalPrice: 149,
      categorySlug: 'beginner-drones',
      imageUrl: '/products/ryze-tello.png',
      images: JSON.stringify([
        '/products/ryze-tello.png',
        '/products/ryze-tello-2.png',
      ]),
      description:
        'Educational drone with programmable features and 5MP camera. Perfect for kids and STEM learning.',
      specifications: JSON.stringify({
        flightTime: '13 min',
        range: '100 m',
        camera: '5MP, 720P HD video',
        weight: '80g',
        maxSpeed: '8 m/s',
        gps: 'None (vision positioning)',
        gimbal: 'None (electronic stabilization)',
        sensors: 'Vision positioning system',
        battery: '1100 mAh LiPo 1S',
      }),
      rating: 4.3,
      reviewCount: 24,
      tag: 'New',
      brand: 'Ryze',
      inStock: true,
      stockCount: 50,
    },

    // Mini Drones
    {
      name: 'DJI Mini 3 Pro',
      slug: 'dji-mini-3-pro',
      price: 759,
      originalPrice: 899,
      categorySlug: 'mini-drones',
      imageUrl: '/products/dji-mini-3-pro.png',
      images: JSON.stringify([
        '/products/dji-mini-3-pro.png',
        '/products/dji-mini-3-pro-2.png',
        '/products/dji-mini-3-pro-3.png',
      ]),
      description:
        'Premium mini drone with 4K HDR camera, 34-minute flight time, and tri-directional obstacle sensing. Under 249g.',
      specifications: JSON.stringify({
        flightTime: '34 min',
        range: '12 km',
        camera: '1/1.3-inch CMOS, 48MP, 4K HDR',
        weight: '249g',
        maxSpeed: '16 m/s',
        gps: 'GPS + GLONASS + Galileo',
        gimbal: '3-axis mechanical gimbal',
        sensors: 'Tri-directional obstacle sensing',
        battery: '2453 mAh LiPo 3S',
      }),
      rating: 4.9,
      reviewCount: 275,
      tag: 'Best Seller',
      brand: 'DJI',
      inStock: true,
      stockCount: 20,
    },
    {
      name: 'Potensic Atom SE',
      slug: 'potensic-atom-se',
      price: 249,
      originalPrice: 299,
      categorySlug: 'mini-drones',
      imageUrl: '/products/potensic-atom-se.png',
      images: JSON.stringify([
        '/products/potensic-atom-se.png',
        '/products/potensic-atom-se-2.png',
      ]),
      description:
        'Budget-friendly mini drone with 4K camera and GPS. Lightweight at under 249g with 32-minute flight time.',
      specifications: JSON.stringify({
        flightTime: '32 min',
        range: '4 km',
        camera: '4K UHD, Sony sensor',
        weight: '249g',
        maxSpeed: '12 m/s',
        gps: 'GPS assisted',
        gimbal: '3-axis mechanical gimbal',
        sensors: 'GPS return-to-home, altitude hold',
        battery: '2500 mAh LiPo 2S',
      }),
      rating: 4.5,
      reviewCount: 87,
      tag: 'Sale',
      brand: 'Potensic',
      inStock: true,
      stockCount: 40,
    },
    {
      name: 'Hubsan Zino Mini SE',
      slug: 'hubsan-zino-mini-se',
      price: 229,
      originalPrice: 279,
      categorySlug: 'mini-drones',
      imageUrl: '/products/hubsan-zino-mini-se.png',
      images: JSON.stringify([
        '/products/hubsan-zino-mini-se.png',
        '/products/hubsan-zino-mini-se-2.png',
      ]),
      description:
        'Compact mini drone with 4K camera, 3-axis gimbal, and 40-minute flight time. Perfect for travel and everyday aerial shots.',
      specifications: JSON.stringify({
        flightTime: '40 min',
        range: '8 km',
        camera: '4K UHD, 1/2.3-inch CMOS',
        weight: '249g',
        maxSpeed: '15 m/s',
        gps: 'GPS + GLONASS',
        gimbal: '3-axis mechanical gimbal',
        sensors: 'Downward vision, GPS return-to-home',
        battery: '3100 mAh LiPo 3S',
      }),
      rating: 4.6,
      reviewCount: 56,
      tag: 'New',
      brand: 'Hubsan',
      inStock: true,
      stockCount: 25,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Created', products.length, 'products');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
