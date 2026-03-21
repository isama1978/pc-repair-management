// seed-inventory.ts

const API_URL = 'http://localhost:3000/inventory'; // Ajusta el puerto si usas otro

// Generador de repuestos aleatorios pero realistas para un taller
const generateParts = () => {
  const categories = [
    'Pantallas',
    'Baterías',
    'Almacenamiento',
    'RAM',
    'Accesorios',
  ];
  const brands = ['Samsung', 'Kingston', 'Western Digital', 'Dell', 'Generico'];

  const parts: any = [];

  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];

    // Generamos stocks aleatorios. Algunos tendrán stock menor al mínimo a propósito.
    const stock = Math.floor(Math.random() * 15);
    const minStockAlert = Math.floor(Math.random() * 5) + 3; // Entre 3 y 7
    const price = Math.floor(Math.random() * 100) + 10;

    parts.push({
      sku: `PART-${category.substring(0, 3).toUpperCase()}-${1000 + i}`,
      nameKey: `${category} ${brand} Modelo V${i}`, // nameKey según tu DTO
      category: category,
      stock: stock,
      minStockAlert: minStockAlert,
      unitPrice: price,
    });
  }

  return parts;
};

const seedDatabase = async () => {
  console.log('🌱 Iniciando carga de inventario...');
  const parts = generateParts();
  let successCount = 0;
  let errorCount = 0;

  for (const part of parts) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer TU_TOKEN_AQUI' // Descomenta si tu endpoint está protegido
        },
        body: JSON.stringify(part),
      });

      if (response.ok) {
        successCount++;
        console.log(
          `✅ Insertado: ${part.sku} (Stock: ${part.stock} | Min: ${part.minStockAlert})`,
        );
      } else {
        errorCount++;
        const errorData = await response.json();
        console.error(
          `❌ Error en ${part.sku}:`,
          errorData.message || errorData,
        );
      }
    } catch (error) {
      errorCount++;
      console.error(`💥 Error de red con ${part.sku}:`, error.message);
    }
  }

  console.log('\n📊 Resumen de la carga:');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Fallidos: ${errorCount}`);
  console.log(
    `🔍 Ahora ejecuta un GET a /inventory/low-stock en Postman para ver la magia.`,
  );
};

seedDatabase();
