// Curated list of destinations & origins with iconic monuments and states
// Includes domestic Indian hubs and all recognized foreign countries for instant autocomplete
// Used for instant autocomplete and matching same-name places across TripSaathi

export const SUGGESTED_PLACES = [
  // Domestic Indian Hubs & Destinations
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

  // All Foreign Countries & Iconic International Cities
  // Europe
  { city: "France", state: "Western Europe", country: "France", monuments: "Paris, Eiffel Tower, Louvre Museum, French Riviera, Nice" },
  { city: "Paris", state: "Ile-de-France", country: "France", monuments: "Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Arc de Triomphe" },
  { city: "United Kingdom", state: "Northern Europe", country: "United Kingdom", monuments: "London, Big Ben, Tower Bridge, Buckingham Palace, Edinburgh" },
  { city: "London", state: "England", country: "United Kingdom", monuments: "Big Ben, Tower Bridge, London Eye, Buckingham Palace, British Museum" },
  { city: "Germany", state: "Central Europe", country: "Germany", monuments: "Berlin, Brandenburg Gate, Munich, Neuschwanstein Castle, Frankfurt" },
  { city: "Berlin", state: "Berlin", country: "Germany", monuments: "Brandenburg Gate, Berlin Wall, Museum Island, Reichstag" },
  { city: "Italy", state: "Southern Europe", country: "Italy", monuments: "Rome, Colosseum, Venice Canals, Florence Duomo, Milan Cathedral" },
  { city: "Rome", state: "Lazio", country: "Italy", monuments: "Colosseum, Vatican City, Trevi Fountain, Pantheon" },
  { city: "Spain", state: "Southern Europe", country: "Spain", monuments: "Madrid, Barcelona, Sagrada Familia, Alhambra, Seville" },
  { city: "Madrid", state: "Community of Madrid", country: "Spain", monuments: "Royal Palace, Prado Museum, Plaza Mayor, Retiro Park" },
  { city: "Switzerland", state: "Central Europe", country: "Switzerland", monuments: "Zurich, Lucerne, Swiss Alps, Interlaken, Lake Geneva, Matterhorn" },
  { city: "Zurich", state: "Zurich", country: "Switzerland", monuments: "Lake Zurich, Old Town, Bahnhofstrasse, Uetliberg" },
  { city: "Netherlands", state: "Western Europe", country: "Netherlands", monuments: "Amsterdam, Canals, Van Gogh Museum, Keukenhof Tulips, Rotterdam" },
  { city: "Amsterdam", state: "North Holland", country: "Netherlands", monuments: "Rijksmuseum, Anne Frank House, Canal Ring, Dam Square" },
  { city: "Austria", state: "Central Europe", country: "Austria", monuments: "Vienna, Schonbrunn Palace, Salzburg, Hallstatt, Alpine Peaks" },
  { city: "Belgium", state: "Western Europe", country: "Belgium", monuments: "Brussels, Grand Place, Bruges Canals, Atomium, Ghent" },
  { city: "Portugal", state: "Southern Europe", country: "Portugal", monuments: "Lisbon, Belem Tower, Porto, Algarve Coast, Sintra Palace" },
  { city: "Greece", state: "Southern Europe", country: "Greece", monuments: "Athens, Acropolis, Parthenon, Santorini Island, Mykonos" },
  { city: "Sweden", state: "Northern Europe", country: "Sweden", monuments: "Stockholm, Vasa Museum, Gamla Stan, Ice Hotel, Gothenburg" },
  { city: "Norway", state: "Northern Europe", country: "Norway", monuments: "Oslo, Norwegian Fjords, Bergen, Northern Lights, Tromso" },
  { city: "Denmark", state: "Northern Europe", country: "Denmark", monuments: "Copenhagen, Tivoli Gardens, Nyhavn, Little Mermaid" },
  { city: "Finland", state: "Northern Europe", country: "Finland", monuments: "Helsinki, Lapland, Santa Claus Village, Northern Lights" },
  { city: "Ireland", state: "Northern Europe", country: "Ireland", monuments: "Dublin, Cliffs of Moher, Trinity College, Ring of Kerry" },
  { city: "Poland", state: "Central Europe", country: "Poland", monuments: "Warsaw, Krakow, Wawel Castle, Main Market Square" },
  { city: "Czech Republic", state: "Central Europe", country: "Czech Republic", monuments: "Prague, Charles Bridge, Prague Castle, Old Town Square" },
  { city: "Hungary", state: "Central Europe", country: "Hungary", monuments: "Budapest, Parliament Building, Buda Castle, Thermal Baths" },
  { city: "Croatia", state: "Southern Europe", country: "Croatia", monuments: "Dubrovnik Old Town, Plitvice Lakes, Split, Diocletian's Palace" },
  { city: "Iceland", state: "Northern Europe", country: "Iceland", monuments: "Reykjavik, Blue Lagoon, Golden Circle, Geysers, Waterfalls" },
  { city: "Turkey", state: "Transcontinental", country: "Turkey", monuments: "Istanbul, Hagia Sophia, Blue Mosque, Cappadocia Hot Air Balloons" },
  { city: "Russia", state: "Eastern Europe", country: "Russia", monuments: "Moscow, Red Square, Kremlin, Saint Basil's, Saint Petersburg" },
  { city: "Romania", state: "Eastern Europe", country: "Romania", monuments: "Bucharest, Bran Castle (Dracula's Castle), Transylvania" },
  { city: "Bulgaria", state: "Southeast Europe", country: "Bulgaria", monuments: "Sofia, Rila Monastery, Plovdiv Old Town" },
  { city: "Slovakia", state: "Central Europe", country: "Slovakia", monuments: "Bratislava, Bratislava Castle, High Tatras" },
  { city: "Slovenia", state: "Central Europe", country: "Slovenia", monuments: "Ljubljana, Lake Bled, Postojna Cave" },
  { city: "Luxembourg", state: "Western Europe", country: "Luxembourg", monuments: "Luxembourg City, Bock Casemates, Grand Ducal Palace" },
  { city: "Monaco", state: "Western Europe", country: "Monaco", monuments: "Monte Carlo Casino, Prince's Palace, Port Hercule" },
  { city: "Vatican City", state: "Southern Europe", country: "Vatican City", monuments: "St. Peter's Basilica, Sistine Chapel, Vatican Museums" },
  { city: "Malta", state: "Southern Europe", country: "Malta", monuments: "Valletta, Blue Grotto, Mdina Old City" },
  { city: "Cyprus", state: "Middle East / Europe", country: "Cyprus", monuments: "Nicosia, Paphos Archaeological Park, Aphrodite's Rock" },
  { city: "Serbia", state: "Southeast Europe", country: "Serbia", monuments: "Belgrade, Kalemegdan Fortress, Saint Sava Temple" },
  { city: "Bosnia and Herzegovina", state: "Southeast Europe", country: "Bosnia and Herzegovina", monuments: "Sarajevo, Stari Most (Old Bridge Mostar)" },
  { city: "Albania", state: "Southeast Europe", country: "Albania", monuments: "Tirana, Albanian Riviera, Berat Castle" },
  { city: "Montenegro", state: "Southeast Europe", country: "Montenegro", monuments: "Kotor Bay, Budva Old Town, Durmitor" },
  { city: "North Macedonia", state: "Southeast Europe", country: "North Macedonia", monuments: "Skopje, Lake Ohrid, Old Bazaar" },
  { city: "Estonia", state: "Northern Europe", country: "Estonia", monuments: "Tallinn, Tallinn Old Town, Toompea Castle" },
  { city: "Latvia", state: "Northern Europe", country: "Latvia", monuments: "Riga, Art Nouveau District, House of the Black Heads" },
  { city: "Lithuania", state: "Northern Europe", country: "Lithuania", monuments: "Vilnius, Trakai Island Castle, Gediminas' Tower" },
  { city: "Georgia", state: "Caucasus", country: "Georgia", monuments: "Tbilisi, Narikala Fortress, Kazbegi, Holy Trinity Cathedral" },
  { city: "Armenia", state: "Caucasus", country: "Armenia", monuments: "Yerevan, Mount Ararat views, Geghard Monastery" },
  { city: "Azerbaijan", state: "Caucasus", country: "Azerbaijan", monuments: "Baku, Flame Towers, Maiden Tower, Old City" },

  // Asia & Middle East
  { city: "United Arab Emirates", state: "Middle East", country: "UAE", monuments: "Dubai, Burj Khalifa, Abu Dhabi, Sheikh Zayed Grand Mosque, Palm Jumeirah" },
  { city: "Dubai", state: "Dubai", country: "UAE", monuments: "Burj Khalifa, Dubai Mall & Fountain, Palm Jumeirah, Desert Safari" },
  { city: "Saudi Arabia", state: "Middle East", country: "Saudi Arabia", monuments: "Riyadh, Kingdom Centre, Jeddah Corniche, AlUla, Diriyah" },
  { city: "Qatar", state: "Middle East", country: "Qatar", monuments: "Doha, Museum of Islamic Art, Souq Waqif, Katara Cultural Village" },
  { city: "Singapore", state: "Southeast Asia", country: "Singapore", monuments: "Marina Bay Sands, Gardens by the Bay, Sentosa Island, Universal Studios" },
  { city: "Japan", state: "East Asia", country: "Japan", monuments: "Tokyo, Mount Fuji, Kyoto Temples, Osaka Castle, Shibuya Crossing" },
  { city: "Tokyo", state: "Kanto", country: "Japan", monuments: "Senso-ji Temple, Shibuya Crossing, Meiji Jingu, Tokyo Skytree" },
  { city: "Thailand", state: "Southeast Asia", country: "Thailand", monuments: "Bangkok, Grand Palace, Phuket Beaches, Chiang Mai, Pattaya" },
  { city: "Malaysia", state: "Southeast Asia", country: "Malaysia", monuments: "Kuala Lumpur, Petronas Twin Towers, Batu Caves, Penang, Langkawi" },
  { city: "Indonesia", state: "Southeast Asia", country: "Indonesia", monuments: "Bali, Ubud, Tanah Lot, Jakarta, Borobudur Temple, Komodo" },
  { city: "Vietnam", state: "Southeast Asia", country: "Vietnam", monuments: "Hanoi, Ha Long Bay, Ho Chi Minh City, Hoi An Ancient Town" },
  { city: "South Korea", state: "East Asia", country: "South Korea", monuments: "Seoul, Gyeongbokgung Palace, N Seoul Tower, Busan, Jeju Island" },
  { city: "China", state: "East Asia", country: "China", monuments: "Beijing, Great Wall of China, Forbidden City, Shanghai The Bund" },
  { city: "Maldives", state: "South Asia", country: "Maldives", monuments: "Male, Overwater Villas, Coral Reefs, Maafushi, Ari Atoll" },
  { city: "Sri Lanka", state: "South Asia", country: "Sri Lanka", monuments: "Colombo, Sigiriya Rock Fortress, Kandy Temple, Galle Fort, Ella" },
  { city: "Nepal", state: "South Asia", country: "Nepal", monuments: "Kathmandu, Mount Everest base, Pashupatinath, Pokhara, Annapurna" },
  { city: "Bhutan", state: "South Asia", country: "Bhutan", monuments: "Thimphu, Tiger's Nest Monastery (Paro Taktsang), Punakha Dzong" },
  { city: "Philippines", state: "Southeast Asia", country: "Philippines", monuments: "Manila, Boracay White Beach, Palawan, Chocolate Hills" },
  { city: "Oman", state: "Middle East", country: "Oman", monuments: "Muscat, Sultan Qaboos Grand Mosque, Wahiba Sands, Nizwa Fort" },
  { city: "Kuwait", state: "Middle East", country: "Kuwait", monuments: "Kuwait City, Kuwait Towers, Grand Mosque, Souq Al-Mubarakiya" },
  { city: "Bahrain", state: "Middle East", country: "Bahrain", monuments: "Manama, Bahrain Fort, Al Fateh Grand Mosque" },
  { city: "Jordan", state: "Middle East", country: "Jordan", monuments: "Amman, Petra Treasury, Dead Sea, Wadi Rum Desert" },
  { city: "Israel", state: "Middle East", country: "Israel", monuments: "Jerusalem, Western Wall, Tel Aviv Promenade, Dead Sea" },
  { city: "Lebanon", state: "Middle East", country: "Lebanon", monuments: "Beirut, Jeita Grotto, Baalbek Roman Ruins, Byblos" },
  { city: "Cambodia", state: "Southeast Asia", country: "Cambodia", monuments: "Angkor Wat, Siem Reap, Phnom Penh Royal Palace" },
  { city: "Laos", state: "Southeast Asia", country: "Laos", monuments: "Luang Prabang, Kuang Si Waterfall, Vientiane That Luang" },
  { city: "Myanmar", state: "Southeast Asia", country: "Myanmar", monuments: "Bagan Temples, Shwedagon Pagoda (Yangon), Inle Lake" },
  { city: "Mongolia", state: "East Asia", country: "Mongolia", monuments: "Ulaanbaatar, Genghis Khan Statue, Gobi Desert" },
  { city: "Kazakhstan", state: "Central Asia", country: "Kazakhstan", monuments: "Astana, Baiterek Tower, Almaty, Charyn Canyon" },
  { city: "Uzbekistan", state: "Central Asia", country: "Uzbekistan", monuments: "Samarkand, Registan Square, Bukhara, Tashkent" },
  { city: "Bangladesh", state: "South Asia", country: "Bangladesh", monuments: "Dhaka, Lalbagh Fort, Sundarbans Mangrove, Cox's Bazar" },
  { city: "Pakistan", state: "South Asia", country: "Pakistan", monuments: "Badshahi Mosque (Lahore), Faisal Mosque (Islamabad), Karakoram Highway" },

  // Americas
  { city: "United States", state: "North America", country: "USA", monuments: "New York, Statue of Liberty, Grand Canyon, Los Angeles, Washington D.C." },
  { city: "USA", state: "North America", country: "USA", monuments: "New York Times Square, Golden Gate Bridge, Hollywood, Las Vegas" },
  { city: "New York", state: "New York", country: "USA", monuments: "Statue of Liberty, Times Square, Central Park, Empire State Building" },
  { city: "Canada", state: "North America", country: "Canada", monuments: "Toronto, CN Tower, Niagara Falls, Banff National Park, Vancouver" },
  { city: "Mexico", state: "North America", country: "Mexico", monuments: "Mexico City, Chichen Itza Mayan Ruins, Cancun, Teotihuacan" },
  { city: "Brazil", state: "South America", country: "Brazil", monuments: "Rio de Janeiro, Christ the Redeemer, Copacabana, Iguazu Falls, Amazon Rainforest" },
  { city: "Argentina", state: "South America", country: "Argentina", monuments: "Buenos Aires, Iguazu Falls, Patagonia, Perito Moreno Glacier" },
  { city: "Peru", state: "South America", country: "Peru", monuments: "Machu Picchu, Cusco, Sacred Valley, Lima Miraflores" },
  { city: "Chile", state: "South America", country: "Chile", monuments: "Santiago, Torres del Paine, Atacama Desert, Easter Island" },
  { city: "Colombia", state: "South America", country: "Colombia", monuments: "Bogota, Medellin, Cartagena Walled City, Coffee Triangle" },
  { city: "Costa Rica", state: "Central America", country: "Costa Rica", monuments: "Arenal Volcano, Manuel Antonio National Park, Monteverde Cloud Forest" },
  { city: "Panama", state: "Central America", country: "Panama", monuments: "Panama Canal, Panama City Casco Viejo, San Blas Islands" },
  { city: "Cuba", state: "Caribbean", country: "Cuba", monuments: "Havana Old Town, Malecon, Varadero Beach, Trinidad" },
  { city: "Jamaica", state: "Caribbean", country: "Jamaica", monuments: "Montego Bay, Dunn's River Falls, Negril Seven Mile Beach" },
  { city: "Dominican Republic", state: "Caribbean", country: "Dominican Republic", monuments: "Punta Cana, Santo Domingo Colonial Zone, Saona Island" },
  { city: "Bahamas", state: "Caribbean", country: "Bahamas", monuments: "Nassau, Atlantis Paradise Island, Exuma Cays" },
  { city: "Ecuador", state: "South America", country: "Ecuador", monuments: "Quito Old Town, Galapagos Islands, Cotopaxi Volcano" },
  { city: "Bolivia", state: "South America", country: "Bolivia", monuments: "Salar de Uyuni Salt Flats, La Paz, Lake Titicaca" },
  { city: "Uruguay", state: "South America", country: "Uruguay", monuments: "Montevideo, Punta del Este, Colonia del Sacramento" },

  // Oceania
  { city: "Australia", state: "Oceania", country: "Australia", monuments: "Sydney Opera House, Great Barrier Reef, Melbourne, Uluru, Gold Coast" },
  { city: "New Zealand", state: "Oceania", country: "New Zealand", monuments: "Auckland, Queenstown, Milford Sound, Rotorua Geothermal, Hobbiton" },
  { city: "Fiji", state: "Oceania", country: "Fiji", monuments: "Nadi, Mamanuca Islands, Coral Coast, Yasawa Islands" },
  { city: "Papua New Guinea", state: "Oceania", country: "Papua New Guinea", monuments: "Port Moresby, Kokoda Track, Mount Wilhelm" },

  // Africa
  { city: "South Africa", state: "Southern Africa", country: "South Africa", monuments: "Cape Town, Table Mountain, Kruger Safari, Johannesburg" },
  { city: "Egypt", state: "North Africa", country: "Egypt", monuments: "Cairo, Great Pyramids of Giza, Sphinx, Nile River Cruise, Luxor" },
  { city: "Morocco", state: "North Africa", country: "Morocco", monuments: "Marrakech, Jemaa el-Fnaa, Casablanca Hassan II Mosque, Chefchaouen" },
  { city: "Kenya", state: "East Africa", country: "Kenya", monuments: "Nairobi, Maasai Mara Safari, Mount Kenya, Diani Beach" },
  { city: "Tanzania", state: "East Africa", country: "Tanzania", monuments: "Serengeti National Park, Mount Kilimanjaro, Zanzibar Beaches" },
  { city: "Mauritius", state: "East Africa", country: "Mauritius", monuments: "Port Louis, Chamarel Seven Coloured Earth, Le Morne Brabant" },
  { city: "Seychelles", state: "East Africa", country: "Seychelles", monuments: "Mahe, Anse Source d'Argent (La Digue), Praslin Valle de Mai" },
  { city: "Nigeria", state: "West Africa", country: "Nigeria", monuments: "Lagos, Zuma Rock, Lekki Conservation Centre, Abuja" },
  { city: "Ghana", state: "West Africa", country: "Ghana", monuments: "Accra, Cape Coast Castle, Kakum Canopy Walkway" },
  { city: "Ethiopia", state: "East Africa", country: "Ethiopia", monuments: "Addis Ababa, Lalibela Rock Churches, Simien Mountains" },
  { city: "Uganda", state: "East Africa", country: "Uganda", monuments: "Kampala, Bwindi Gorilla Trekking, Murchison Falls" },
  { city: "Rwanda", state: "East Africa", country: "Rwanda", monuments: "Kigali, Volcanoes National Park, Lake Kivu" },
  { city: "Namibia", state: "Southern Africa", country: "Namibia", monuments: "Sossusvlei Dunes, Etosha National Park, Skeleton Coast" },
  { city: "Botswana", state: "Southern Africa", country: "Botswana", monuments: "Okavango Delta, Chobe National Park, Kalahari Desert" },
  { city: "Zimbabwe", state: "Southern Africa", country: "Zimbabwe", monuments: "Victoria Falls, Great Zimbabwe National Monument, Hwange Safari" },
  { city: "Zambia", state: "Southern Africa", country: "Zambia", monuments: "Victoria Falls, South Luangwa National Park, Zambezi River" },
  { city: "Tunisia", state: "North Africa", country: "Tunisia", monuments: "Tunis, Carthage Ruins, Sidi Bou Said, El Djem Amphitheatre" },
  { city: "Madagascar", state: "East Africa", country: "Madagascar", monuments: "Avenue of the Baobabs, Tsingy de Bemaraha, Isalo National Park" }
];

export function searchPlaces(query) {
  if (!query || !query.trim()) {
    return SUGGESTED_PLACES.slice(0, 10);
  }
  const q = query.trim().toLowerCase();
  const cleanQ = q.replace(/[^a-z0-9]/g, "");

  return SUGGESTED_PLACES.filter(place => {
    const cityLower = place.city.toLowerCase();
    const cityClean = cityLower.replace(/[^a-z0-9]/g, "");
    const monLower = (place.monuments || "").toLowerCase();
    const stateLower = (place.state || "").toLowerCase();
    const countryLower = (place.country || "").toLowerCase();

    return (
      cityLower.includes(q) ||
      cityClean.includes(cleanQ) ||
      monLower.includes(q) ||
      stateLower.includes(q) ||
      countryLower.includes(q)
    );
  });
}
