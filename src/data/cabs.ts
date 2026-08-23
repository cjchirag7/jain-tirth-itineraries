export interface CabOption {
  vehicleType: string;
  ratePerKm: string | number;
  companyName: string;
  bataPerDay: string | number;
  contact: string;
  priorityOrder: number;
  capacity?: string | number;
}

const rawCabOptions: CabOption[] = [
  { vehicleType: 'Innova Crysta', ratePerKm: 17, companyName: 'Bhushan Jain', bataPerDay: 400, contact: '9900206252', priorityOrder: 1, capacity: 6 },
  { vehicleType: 'Innova Crysta ac', ratePerKm: 19, companyName: 'Bhushan Jain', bataPerDay: 400, contact: '9900206252', priorityOrder: 1, capacity: 6 },
  { vehicleType: 'Etios/Dzire', ratePerKm: 12.5, companyName: 'Bhushan Jain', bataPerDay: 300, contact: '9900206252', priorityOrder: 1, capacity: 4 },
  { vehicleType: 'Ertiga', ratePerKm: 15, companyName: 'Bhushan Jain', bataPerDay: 400, contact: '9900206252', priorityOrder: 1, capacity: 7 },
  { vehicleType: 'Tempo Traveller', ratePerKm: 19.5, companyName: 'Bhushan Jain', bataPerDay: 500, contact: '9900206252', priorityOrder: 1, capacity: 12 },
  { vehicleType: 'Tempo Traveller ac', ratePerKm: 21.5, companyName: 'Bhushan Jain', bataPerDay: 500, contact: '9900206252', priorityOrder: 1, capacity: 12 },

  { vehicleType: 'Innova Crysta', ratePerKm: 18, companyName: 'Rakesh', bataPerDay: 400, contact: '9741403091', priorityOrder: 2, capacity: 6 },
  { vehicleType: 'Etios/Dzire', ratePerKm: 12, companyName: 'Rakesh', bataPerDay: 350, contact: '9741403091', priorityOrder: 2, capacity: 4 },
  { vehicleType: 'Ertiga', ratePerKm: 15, companyName: 'Rakesh', bataPerDay: 400, contact: '9741403091', priorityOrder: 2, capacity: 7 },
  { vehicleType: 'Tempo Traveller', ratePerKm: 19, companyName: 'Rakesh', bataPerDay: 500, contact: '9741403091', priorityOrder: 2, capacity: 12 },
  { vehicleType: 'Tempo Traveller ac', ratePerKm: 21, companyName: 'Rakesh', bataPerDay: 500, contact: '9741403091', priorityOrder: 2, capacity: 12 },

  { vehicleType: 'Innova Crysta', ratePerKm: 17, companyName: 'Sriniwas', bataPerDay: 400, contact: '9845211281', priorityOrder: 3, capacity: 6 },
  { vehicleType: 'Innova Crysta ac', ratePerKm: 19, companyName: 'Sriniwas', bataPerDay: 400, contact: '9845211281', priorityOrder: 3, capacity: 6 },
  { vehicleType: 'Etios/Dzire', ratePerKm: 13, companyName: 'Sriniwas', bataPerDay: 300, contact: '9845211281', priorityOrder: 3, capacity: 4 },
  { vehicleType: 'Ertiga', ratePerKm: 16, companyName: 'Sriniwas', bataPerDay: 400, contact: '9845211281', priorityOrder: 3, capacity: 7 },
  { vehicleType: 'Tempo Traveller', ratePerKm: 20, companyName: 'Sriniwas', bataPerDay: 500, contact: '9845211281', priorityOrder: 3, capacity: 12 },
  { vehicleType: 'Tempo Traveller ac', ratePerKm: 22, companyName: 'Sriniwas', bataPerDay: 500, contact: '9845211281', priorityOrder: 3, capacity: 12 },
  { vehicleType: 'Kia 7+1', ratePerKm: 17, companyName: 'Sriniwas', bataPerDay: 400, contact: '9845211281', priorityOrder: 3, capacity: 7 },
  { vehicleType: 'Force Urbania luxury', ratePerKm: 46, companyName: 'Sriniwas', bataPerDay: 600, contact: '9845211281', priorityOrder: 3, capacity: 12 },
  { vehicleType: 'Force Urbania ac', ratePerKm: 38, companyName: 'Sriniwas', bataPerDay: 600, contact: '9845211281', priorityOrder: 3, capacity: 12 },

  { vehicleType: 'Innova Crysta', ratePerKm: 17, companyName: 'Laxmi', bataPerDay: 400, contact: '9590725999', priorityOrder: 4, capacity: 6 },
  { vehicleType: 'Innova Crysta ac', ratePerKm: 19, companyName: 'Laxmi', bataPerDay: 400, contact: '9590725999', priorityOrder: 4, capacity: 6 },
  { vehicleType: 'Etios/Dzire', ratePerKm: 13, companyName: 'Laxmi', bataPerDay: 400, contact: '9590725999', priorityOrder: 4, capacity: 4 },
  { vehicleType: 'Ertiga', ratePerKm: 16, companyName: 'Laxmi', bataPerDay: 400, contact: '9590725999', priorityOrder: 4, capacity: 7 },

  { vehicleType: 'Airport Drop/Pickup', ratePerKm: '900', companyName: 'Aishwarya Cabs', bataPerDay: '-', contact: 'https://www.aishwaryacabs.in/', priorityOrder: 5, capacity: '-' }
];

export const cabOptions = rawCabOptions.sort((a, b) => {
  // 1. Priority Order
  if (a.priorityOrder !== b.priorityOrder) return a.priorityOrder - b.priorityOrder;

  // 2. Capacity
  const getCapacity = (cap: string | number | undefined) => {
    if (typeof cap === 'number') return cap;
    if (typeof cap === 'string') {
      const parsed = parseInt(cap, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };
  const capA = getCapacity(a.capacity);
  const capB = getCapacity(b.capacity);
  if (capA !== capB) return capA - capB;

  // 3. Rate
  const getRate = (rate: string | number) => {
    if (typeof rate === 'number') return rate;
    const parsed = parseFloat(rate);
    return isNaN(parsed) ? 0 : parsed;
  };
  const rateA = getRate(a.ratePerKm);
  const rateB = getRate(b.ratePerKm);
  return rateA - rateB;
});
