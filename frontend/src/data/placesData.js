// Curated list of popular destinations & origins with iconic monuments and states
// Used for instant autocomplete and matching same-name places across TripSaathi

export const SUGGESTED_PLACES = [
  { city: "Agra", state: "Uttar Pradesh", country: "India", monuments: "Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh" },
  { city: "Jaipur", state: "Rajasthan", country: "India", monuments: "Hawa Mahal, Amber Fort, City Palace, Jal Mahal, Nahargarh" },
  { city: "Delhi", state: "Delhi NCR", country: "India", monuments: "India Gate, Red Fort, Qutub Minar, Lotus Temple, Akshardham" },
  { city: "New Delhi", state: "Delhi NCR", country: "India", monuments: "Rashtrapati Bhavan, Connaught Place, National Museum" },
  { city: "Varanasi", state: "Uttar Pradesh", country: "India", monuments: "Kashi Vishwanath, Dashashwamedh Ghat, Assi Ghat, Sarnath" },
  { city: "Mumbai", state: "Maharashtra", country: "India", monuments: "Gateway of India, Marine Drive, Elephanta Caves, CST" },
  { city: "Bengaluru", state: "Karnataka", country: "India", monuments: "Bangalore Palace, Lalbagh, Cubbon Park, ISKCON Temple" },
  { city: "Kolkata", state: "West Bengal", country: "India", monuments: "Victoria Memorial, Howrah Bridge, Dakshineswar Kali, Park Street" },
  { city: "Chennai", state: "Tamil Nadu", country: "India", monuments: "Marina Beach, Kapaleeshwarar Temple, San Thome Basilica, Fort St. George" },
  { city: "Hyderabad", state: "Telangana", country: "India", monuments: "Charminar, Golconda Fort, Chowmahalla Palace, Hussain Sagar, Ramoji Film City" },
  { city: "Goa", state: "Goa", country: "India", monuments: "Baga Beach, Fort Aguada, Calangute, Basilica of Bom Jesus, Dudhsagar Falls" },
  { city: "Kochi", state: "Kerala", country: "India", monuments: "Fort Kochi, Chinese Fishing Nets, Mattancherry Palace, Jew Town" },
  { city: "Alleppey", state: "Kerala", country: "India", monuments: "Vembanad Lake, Backwater Houseboats, Marari Beach, Punnamada Lake" },
  { city: "Munnar", state: "Kerala", country: "India", monuments: "Tea Gardens, Eravikulam National Park, Mattupetty Dam, Top Station" },
  { city: "Amritsar", state: "Punjab", country: "India", monuments: "Golden Temple, Wagah Border, Jallianwala Bagh, Gobindgarh Fort" },
  { city: "Udaipur", state: "Rajasthan", country: "India", monuments: "City Palace, Lake Pichola, Jag Mandir, Saheliyon Ki Bari, Monsoon Palace" },
  { city: "Vadodara", state: "Gujarat", country: "India", monuments: "Laxmi Vilas Palace, Sayaji Baug, Kirti Mandir, EME Temple" },
  { city: "Kevadia", state: "Gujarat", country: "India", monuments: "Statue of Unity (182m), Sardar Sarovar Dam, Valley of Flowers, Cactus Garden" },
  { city: "Ahmedabad", state: "Gujarat", country: "India", monuments: "Sabarmati Ashram, Adalaj Stepwell, Akshardham, Sidi Saiyyed Mosque" },
  { city: "Pune", state: "Maharashtra", country: "India", monuments: "Shaniwar Wada, Aga Khan Palace, Sinhagad Fort, Osho International" },
  { city: "Lucknow", state: "Uttar Pradesh", country: "India", monuments: "Bara Imambara, Chhota Imambara, Rumi Darwaza, Hazratganj" },
  { city: "Ayodhya", state: "Uttar Pradesh", country: "India", monuments: "Ram Mandir, Hanumangarhi, Kanak Bhawan, Saryu Ghat" },
  { city: "Mathura", state: "Uttar Pradesh", country: "India", monuments: "Krishna Janmabhoomi, Dwarkadhish Temple, Vishram Ghat, Kans Qila" },
  { city: "Vrindavan", state: "Uttar Pradesh", country: "India", monuments: "Prem Mandir, Banke Bihari Temple, ISKCON Vrindavan, Radha Raman" },
  { city: "Rishikesh", state: "Uttarakhand", country: "India", monuments: "Triveni Ghat, Laxman Jhula, Beatles Ashram, Parmarth Niketan Ganga Aarti" },
  { city: "Haridwar", state: "Uttarakhand", country: "India", monuments: "Har Ki Pauri, Mansa Devi Temple, Chandi Devi, Shanti Kunj" },
  { city: "Shimla", state: "Himachal Pradesh", country: "India", monuments: "The Mall Road, Jakhoo Temple, Christ Church, Kufri, Viceregal Lodge" },
  { city: "Manali", state: "Himachal Pradesh", country: "India", monuments: "Solang Valley, Rohtang Pass, Hadimba Temple, Jogini Waterfall" },
  { city: "Srinagar", state: "Jammu & Kashmir", country: "India", monuments: "Dal Lake Shikara, Shalimar Bagh, Nishat Bagh, Shankaracharya Temple" },
  { city: "Puri", state: "Odisha", country: "India", monuments: "Jagannath Temple, Golden Beach, Konark Sun Temple" },
  { city: "Chandigarh", state: "Punjab & Haryana", country: "India", monuments: "Rock Garden, Sukhna Lake, Zakir Hussain Rose Garden" },
  { city: "Indore", state: "Madhya Pradesh", country: "India", monuments: "Rajwada Palace, Sarafa Night Food Market, Lal Bagh Palace" },
  { city: "Bhopal", state: "Madhya Pradesh", country: "India", monuments: "Upper Lake, Sanchi Stupa, Bhimbetka Rock Caves" },
  { city: "Paris", state: "France", country: "France", monuments: "Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Arc de Triomphe" },
  { city: "Tokyo", state: "Japan", country: "Japan", monuments: "Senso-ji Temple, Shibuya Crossing, Meiji Jingu, Tokyo Skytree" },
  { city: "Dubai", state: "UAE", country: "UAE", monuments: "Burj Khalifa, Dubai Mall & Fountain, Palm Jumeirah, Desert Safari" },
  { city: "Singapore", state: "Singapore", country: "Singapore", monuments: "Marina Bay Sands, Gardens by the Bay, Sentosa Island, Universal Studios" },
  { city: "London", state: "UK", country: "UK", monuments: "Big Ben, Tower Bridge, London Eye, Buckingham Palace, British Museum" },
  { city: "New York", state: "USA", country: "USA", monuments: "Statue of Liberty, Times Square, Central Park, Empire State Building" }
];

export function searchPlaces(query) {
  if (!query || !query.trim()) {
    return SUGGESTED_PLACES.slice(0, 8);
  }
  const q = query.trim().toLowerCase();
  const cleanQ = q.replace(/[^a-z0-9]/g, "");

  return SUGGESTED_PLACES.filter(place => {
    const cityLower = place.city.toLowerCase();
    const cityClean = cityLower.replace(/[^a-z0-9]/g, "");
    const monLower = place.monuments.toLowerCase();
    const stateLower = place.state.toLowerCase();
    const countryLower = place.country.toLowerCase();

    return (
      cityLower.includes(q) ||
      cityClean.includes(cleanQ) ||
      monLower.includes(q) ||
      stateLower.includes(q) ||
      countryLower.includes(q)
    );
  });
}
