export const DRAFT_STORAGE_KEY = 'coffee_draft';

export const createDefaultCoffeeRecord = () => ({
  date: new Date().toISOString().slice(0, 10),
  store: '',
  coffeeName: '',
  beanOrigin: '',
  beanEstate: '',
  beanProcess: '',
  roastLevel: 3,
  intensity: 3,
  scores: {
    acidity: 3,
    bitterness: 3,
    sweetness: 3,
    body: 3
  },
  selectedFlavors: [],
  score: 5,
  isActive: true,
  updatedAt: new Date().toISOString()
});

export const cloneCoffeeRecord = (record) => JSON.parse(JSON.stringify(record));

export const normalizeCoffeeRecord = (record) => {
  const cleanRecord = cloneCoffeeRecord(record);

  cleanRecord.store = cleanRecord.store || 'Unknown';
  cleanRecord.beanOrigin = cleanRecord.beanOrigin || 'Unknown';
  cleanRecord.beanEstate = cleanRecord.beanEstate || 'Unknown';
  cleanRecord.beanProcess = cleanRecord.beanProcess || 'Unknown';
  cleanRecord.roastLevel = cleanRecord.roastLevel ?? 0;
  cleanRecord.selectedFlavors = Array.isArray(cleanRecord.selectedFlavors)
    ? cleanRecord.selectedFlavors
    : [];
  cleanRecord.scores = {
    acidity: 3,
    bitterness: 3,
    sweetness: 3,
    body: 3,
    ...(cleanRecord.scores || {})
  };

  return cleanRecord;
};
