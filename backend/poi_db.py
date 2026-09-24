# Expanded POI Database for TravelPilot
import os
import re
import math
import logging
from typing import List, Dict, Any, Optional, Tuple

logger = logging.getLogger(__name__)

# Curated POIs with realistic coordinates, opening hours, avg cost in INR (₹), and durations
SAMPLE_POIS: Dict[str, List[Dict[str, Any]]] = {
    # 1. AGRA
    "agra": [
        {
            "id": "agr_taj",
            "name": "Taj Mahal (UNESCO World Wonder)",
            "city": "Agra",
            "category": "Landmarks",
            "lat": 27.1751,
            "lng": 78.0421,
            "address": "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
            "open_time": "06:00",
            "close_time": "18:30",
            "avg_cost": 250.0,
            "avg_duration": 150,
            "description": "Ivory-white marble mausoleum on the south bank of Yamuna river, recognized worldwide as a monument of eternal love."
        },
        {
            "id": "agr_fort",
            "name": "Agra Fort & Jahangiri Mahal",
            "city": "Agra",
            "category": "Landmarks",
            "lat": 27.1795,
            "lng": 78.0211,
            "address": "Agra Fort, Rakabganj, Agra, Uttar Pradesh 282003",
            "open_time": "06:00",
            "close_time": "18:00",
            "avg_cost": 150.0,
            "avg_duration": 120,
            "description": "Historical 16th-century fortress of red sandstone that served as the main residence of the Mughal emperors."
        },
        {
            "id": "agr_mehtab",
            "name": "Mehtab Bagh Sunset Reflection Gardens",
            "city": "Agra",
            "category": "Nature & Outdoors",
            "lat": 27.1799,
            "lng": 78.0424,
            "address": "Opposite Taj Mahal, Tajganj, Agra, Uttar Pradesh 282001",
            "open_time": "06:00",
            "close_time": "19:00",
            "avg_cost": 50.0,
            "avg_duration": 75,
            "description": "Charbagh garden complex perfectly aligned with the Taj Mahal across the Yamuna for breathtaking sunset views."
        },
        {
            "id": "agr_fatehpur",
            "name": "Fatehpur Sikri Imperial Complex & Buland Darwaza",
            "city": "Agra",
            "category": "Art & Culture",
            "lat": 27.0945,
            "lng": 77.6679,
            "address": "Fatehpur Sikri, Agra District, Uttar Pradesh 283110",
            "open_time": "08:30",
            "close_time": "18:00",
            "avg_cost": 100.0,
            "avg_duration": 135,
            "description": "Emperor Akbar\'s architectural masterpiece and former imperial capital featuring the majestic 54-meter Buland Darwaza."
        },
        {
            "id": "agr_baby_taj",
            "name": "Tomb of I\'timad-ud-Daulah (The Jewel Box Baby Taj)",
            "city": "Agra",
            "category": "Art & Culture",
            "lat": 27.1929,
            "lng": 78.0310,
            "address": "Moti Bagh, Agra, Uttar Pradesh 282006",
            "open_time": "06:00",
            "close_time": "18:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Exquisite marble mausoleum with delicate pietra dura inlay work, considered the architectural draft for the Taj Mahal."
        },
        {
            "id": "agr_sikandra",
            "name": "Akbar\'s Great Mausoleum at Sikandra",
            "city": "Agra",
            "category": "Landmarks",
            "lat": 27.2206,
            "lng": 77.9504,
            "address": "Tomb of Akbar The Great, Sikandra, Agra, Uttar Pradesh 282007",
            "open_time": "06:00",
            "close_time": "18:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Harmonious blend of Hindu, Islamic, Buddhist, and Jain architectural motifs honoring Emperor Akbar."
        },
        {
            "id": "agr_kinari_bazaar",
            "name": "Kinari Bazaar & Jama Masjid Heritage Walk",
            "city": "Agra",
            "category": "Food & Dining",
            "lat": 27.1856,
            "lng": 78.0145,
            "address": "Subhash Bazaar, Kinari Bazaar, Hing ki Mandi, Mantola, Agra 282003",
            "open_time": "10:30",
            "close_time": "21:30",
            "avg_cost": 250.0,
            "avg_duration": 90,
            "description": "Lively old city bazaar famous for zardozi embroidery, leather crafts, marble souvenirs, and Agra bedmi puri."
        },
        {
            "id": "agr_chini_ka_rauza",
            "name": "Chini Ka Rauza Glazed Tile Monument",
            "city": "Agra",
            "category": "Art & Culture",
            "lat": 27.2008,
            "lng": 78.0355,
            "address": "Katra Wazir Khan, Agra, Uttar Pradesh 282006",
            "open_time": "06:00",
            "close_time": "18:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Dedicated to scholar-poet Allama Afzal Khan Mullah, decorated in vibrant turquoise and gold Persian glazed porcelain tiles."
        },
        {
            "id": "agr_keetham_lake",
            "name": "Keetham Lake & Sur Sarovar Bird Sanctuary",
            "city": "Agra",
            "category": "Nature & Outdoors",
            "lat": 27.2520,
            "lng": 77.8480,
            "address": "Sur Sarovar, Runakta, Agra, Uttar Pradesh 282007",
            "open_time": "07:00",
            "close_time": "18:00",
            "avg_cost": 80.0,
            "avg_duration": 120,
            "description": "Scenic freshwater wetland lake and Ramsar site hosting 100+ migratory bird species, lush greenery, and bear rescue reserve."
        },
        {
            "id": "agr_taj_nature_walk",
            "name": "Taj Nature Walk Forest Trail",
            "city": "Agra",
            "category": "Nature & Outdoors",
            "lat": 27.1712,
            "lng": 78.0489,
            "address": "Taj East Gate Rd, Paktola, Tajganj, Agra, Uttar Pradesh 282001",
            "open_time": "06:30",
            "close_time": "18:30",
            "avg_cost": 40.0,
            "avg_duration": 75,
            "description": "Green forested eco-park with elevated watch towers offering unique vantage angles of the Taj Mahal amidst peacocks."
        },
        {
            "id": "agr_mariam_tomb",
            "name": "Mariam-uz-Zamani Palace & Tomb (Sikandra)",
            "city": "Agra",
            "category": "Landmarks",
            "lat": 27.2185,
            "lng": 77.9402,
            "address": "Near Sikandra, Agra, Uttar Pradesh 282007",
            "open_time": "08:00",
            "close_time": "17:30",
            "avg_cost": 40.0,
            "avg_duration": 60,
            "description": "Historic red sandstone baradari memorial of Emperor Akbar\'s Rajput Empress Harkha Bai (Jodha Bai)."
        },
        {
            "id": "agr_sadar_bazaar",
            "name": "Sadar Bazaar & Chaat Gali",
            "city": "Agra",
            "category": "Food & Dining",
            "lat": 27.1620,
            "lng": 78.0075,
            "address": "Sadar Bazaar, Agra Cantt, Agra, Uttar Pradesh 282001",
            "open_time": "11:00",
            "close_time": "22:30",
            "avg_cost": 300.0,
            "avg_duration": 90,
            "description": "Famous market for genuine Agra leather footwear, handicrafts, sweet petha outlets, and evening bhalla chaat."
        },
        {
            "id": "agr_food",
            "name": "Pinch of Spice Mughal Feast & Agra Petha",
            "city": "Agra",
            "category": "Food & Dining",
            "lat": 27.1610,
            "lng": 78.0145,
            "address": "1076/2, Fatehabad Rd, Tajganj, Agra, Uttar Pradesh 282001",
            "open_time": "12:00",
            "close_time": "23:00",
            "avg_cost": 750.0,
            "avg_duration": 75,
            "description": "Renowned for authentic Mughlai curries, tandoori specialties, and traditional Agra ash-gourd petha sweets."
        },
        {
            "id": "agr_korai_village",
            "name": "Korai Tribal Village Cultural Excursion",
            "city": "Agra",
            "category": "Art & Culture",
            "lat": 27.1020,
            "lng": 77.7120,
            "address": "Fatehpur Sikri Road, Agra District, UP 283105",
            "open_time": "09:00",
            "close_time": "17:00",
            "avg_cost": 150.0,
            "avg_duration": 90,
            "description": "Authentic rural community experience learning traditional mud house building, folk songs, and handicraft weaving."
        },
        {
            "id": "agr_sheesh_mahal",
            "name": "Anguri Bagh & Khas Mahal Pavilion",
            "city": "Agra",
            "category": "Landmarks",
            "lat": 27.1788,
            "lng": 78.0225,
            "address": "Inside Agra Fort, Agra, Uttar Pradesh 282003",
            "open_time": "07:00",
            "close_time": "18:00",
            "avg_cost": 100.0,
            "avg_duration": 60,
            "description": "Geometrical grape gardens and white marble imperial pavilions overlooking the Yamuna River."
        }
    ],

    # 2. JAIPUR
    "jaipur": [
        {
            "id": "jai_hawa",
            "name": "Hawa Mahal (Palace of Winds)",
            "city": "Jaipur",
            "category": "Landmarks",
            "lat": 26.9239,
            "lng": 75.8267,
            "address": "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur, Rajasthan 302002",
            "open_time": "09:00",
            "close_time": "17:00",
            "avg_cost": 100.0,
            "avg_duration": 60,
            "description": "Extraordinary five-story pink sandstone palace with 953 intricate jharokhas built in 1799 by Maharaja Sawai Pratap Singh."
        },
        {
            "id": "jai_amber",
            "name": "Amber Fort & Sheesh Mahal",
            "city": "Jaipur",
            "category": "Landmarks",
            "lat": 26.9855,
            "lng": 75.8513,
            "address": "Devisinghpura, Amer, Jaipur, Rajasthan 302028",
            "open_time": "08:00",
            "close_time": "18:00",
            "avg_cost": 200.0,
            "avg_duration": 150,
            "description": "Imposing hilltop fortress featuring Hindu-Rajput architecture, marble courtyards, and the dazzling mirror palace (Sheesh Mahal)."
        },
        {
            "id": "jai_city_palace",
            "name": "City Palace of Jaipur & Museum",
            "city": "Jaipur",
            "category": "Art & Culture",
            "lat": 26.9258,
            "lng": 75.8237,
            "address": "Tulsi Marg, Gangori Bazaar, J.D.A. Market, Jaipur, Rajasthan 302002",
            "open_time": "09:30",
            "close_time": "17:00",
            "avg_cost": 300.0,
            "avg_duration": 120,
            "description": "Magnificent royal residence blending Rajput, Mughal and European architectural styles with historical armoury and royal robes."
        },
        {
            "id": "jai_jantar",
            "name": "Jantar Mantar Astronomical Observatory",
            "city": "Jaipur",
            "category": "Art & Culture",
            "lat": 26.9248,
            "lng": 75.8246,
            "address": "Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
            "open_time": "09:00",
            "close_time": "17:00",
            "avg_cost": 100.0,
            "avg_duration": 75,
            "description": "UNESCO World Heritage collection of 19 architectural astronomical instruments including the world\'s largest stone sundial."
        },
        {
            "id": "jai_nahargarh",
            "name": "Nahargarh Fort & Sunset Ridge Vista",
            "city": "Jaipur",
            "category": "Landmarks",
            "lat": 26.9374,
            "lng": 75.8156,
            "address": "Krishna Nagar, Brahampuri, Jaipur, Rajasthan 302002",
            "open_time": "10:00",
            "close_time": "19:00",
            "avg_cost": 100.0,
            "avg_duration": 120,
            "description": "Perched on the edge of the Aravalli Hills overlooking Jaipur with the iconic Madhavendra Bhawan palace suites."
        },
        {
            "id": "jai_jal_mahal",
            "name": "Jal Mahal (Water Palace) & Man Sagar Lake",
            "city": "Jaipur",
            "category": "Nature & Outdoors",
            "lat": 26.9535,
            "lng": 75.8462,
            "address": "Amer Rd, Jal Mahal, Amber, Jaipur, Rajasthan 302002",
            "open_time": "06:00",
            "close_time": "22:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Picturesque palace floating in the center of Man Sagar Lake with views of migratory waterfowl and Aravalli hills."
        },
        {
            "id": "jai_jaigarh",
            "name": "Jaigarh Fort & Jaivana Cannon (World\'s Largest)",
            "city": "Jaipur",
            "category": "Landmarks",
            "lat": 26.9851,
            "lng": 75.8456,
            "address": "Devisinghpura, Amer, Jaipur, Rajasthan 302028",
            "open_time": "09:00",
            "close_time": "17:00",
            "avg_cost": 150.0,
            "avg_duration": 90,
            "description": "Mighty hilltop military fort connected to Amber Fort through subterranean passages, housing the 50-tonne Jaivana cannon."
        },
        {
            "id": "jai_panna_meena",
            "name": "Panna Meena Ka Kund (Historic Stepwell)",
            "city": "Jaipur",
            "category": "Art & Culture",
            "lat": 26.9945,
            "lng": 75.8562,
            "address": "Near Amber Fort, Amer, Jaipur, Rajasthan 302028",
            "open_time": "07:00",
            "close_time": "18:00",
            "avg_cost": 0.0,
            "avg_duration": 45,
            "description": "Geometric 16th-century stepwell with mesmerizing criss-cross staircases designed for community rainwater conservation."
        },
        {
            "id": "jai_albert_hall",
            "name": "Albert Hall State Museum & Ram Niwas Garden",
            "city": "Jaipur",
            "category": "Art & Culture",
            "lat": 26.9116,
            "lng": 75.8195,
            "address": "Ram Niwas Garden, Kailash Puri, Adarsh Nagar, Jaipur 302004",
            "open_time": "09:00",
            "close_time": "20:00",
            "avg_cost": 100.0,
            "avg_duration": 90,
            "description": "Oldest museum of Rajasthan exhibiting royal miniature paintings, Persian carpets, Egyptian mummy, and metal sculptures."
        },
        {
            "id": "jai_patrika_gate",
            "name": "Patrika Gate & Jawahar Circle Garden",
            "city": "Jaipur",
            "category": "Landmarks",
            "lat": 26.8398,
            "lng": 75.8047,
            "address": "Jawahar Circle, Malviya Nagar, Jaipur, Rajasthan 302017",
            "open_time": "06:00",
            "close_time": "22:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Stunning photogenic arched monument hand-painted with murals portraying the culture, history, and architectural traditions of Rajasthan."
        },
        {
            "id": "jai_galta_ji",
            "name": "Galta Ji Temple (Monkey Temple & Sacred Kunds)",
            "city": "Jaipur",
            "category": "Art & Culture",
            "lat": 26.9165,
            "lng": 75.8643,
            "address": "Galta Ji, Khania-Balaji, Jaipur, Rajasthan 302031",
            "open_time": "05:00",
            "close_time": "20:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Ancient Hindu pilgrimage complex built within a mountain pass, featuring natural freshwater springs and seven sacred pools."
        },
        {
            "id": "jai_birla_mandir",
            "name": "Birla Mandir (Laxmi Narayan Temple)",
            "city": "Jaipur",
            "category": "Art & Culture",
            "lat": 26.8923,
            "lng": 75.8152,
            "address": "Jawahar Lal Nehru Marg, Tilak Nagar, Jaipur, Rajasthan 302004",
            "open_time": "06:00",
            "close_time": "21:00",
            "avg_cost": 0.0,
            "avg_duration": 45,
            "description": "Pure white Makrana marble temple with intricate mythological carvings and serene night illumination at the foot of Moti Dungri."
        },
        {
            "id": "jai_bapu_bazaar",
            "name": "Bapu Bazaar & Johari Bazaar Gems Walk",
            "city": "Jaipur",
            "category": "Food & Dining",
            "lat": 26.9194,
            "lng": 75.8239,
            "address": "Bapu Bazaar, Pink City, Jaipur, Rajasthan 302003",
            "open_time": "10:30",
            "close_time": "21:30",
            "avg_cost": 350.0,
            "avg_duration": 90,
            "description": "Vibrant pink arcade streets for traditional mojari juttis, bandhani textiles, blue pottery, and LMB Ghewar sweets."
        },
        {
            "id": "jai_sisodia_rani",
            "name": "Sisodia Rani Garden & Royal Palace",
            "city": "Jaipur",
            "category": "Nature & Outdoors",
            "lat": 26.8927,
            "lng": 75.8569,
            "address": "Agra Rd, Ghat Ki Guni, Jaipur, Rajasthan 302023",
            "open_time": "08:00",
            "close_time": "18:00",
            "avg_cost": 50.0,
            "avg_duration": 60,
            "description": "Terraced garden with tiered fountains, water channels, painted pavilions depicting Radha-Krishna love scenes."
        },
        {
            "id": "jai_chokhi_dhani",
            "name": "Chokhi Dhani Rajasthani Village Experience",
            "city": "Jaipur",
            "category": "Food & Dining",
            "lat": 26.7663,
            "lng": 75.8362,
            "address": "12 Miles Tonk Road, Via Vatika, Jaipur, Rajasthan 303905",
            "open_time": "17:00",
            "close_time": "23:00",
            "avg_cost": 1100.0,
            "avg_duration": 180,
            "description": "Immersive cultural heritage resort with Kalbeliya folk dance, puppet shows, camel rides, and royal Dal Baati Churma thali."
        }
    ],

    # 3. DELHI
    "delhi": [
        {
            "id": "del_qutub",
            "name": "Qutub Minar Complex",
            "city": "Delhi",
            "category": "Landmarks",
            "lat": 28.5244,
            "lng": 77.1855,
            "address": "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
            "open_time": "07:00",
            "close_time": "19:00",
            "avg_cost": 100.0,
            "avg_duration": 90,
            "description": "73-metre tall soaring victory minaret built in 1192 and the rust-resistant 4th-century Gupta Iron Pillar."
        },
        {
            "id": "del_india_gate",
            "name": "India Gate & National War Memorial Walk",
            "city": "Delhi",
            "category": "Landmarks",
            "lat": 28.6129,
            "lng": 77.2295,
            "address": "Kartavya Path, India Gate, New Delhi, Delhi 110001",
            "open_time": "06:00",
            "close_time": "23:59",
            "avg_cost": 0.0,
            "avg_duration": 75,
            "description": "National war memorial arch honoring 84,000 soldiers, fronted by vibrant landscaped lawns and evening fountains."
        },
        {
            "id": "del_humayun",
            "name": "Humayun\'s Tomb Garden Complex",
            "city": "Delhi",
            "category": "Art & Culture",
            "lat": 28.5933,
            "lng": 77.2507,
            "address": "Mathura Rd, Nizamuddin East, New Delhi, Delhi 110013",
            "open_time": "06:00",
            "close_time": "18:00",
            "avg_cost": 100.0,
            "avg_duration": 90,
            "description": "The first garden-tomb on the Indian subcontinent, which inspired the architectural design of the Taj Mahal."
        },
        {
            "id": "del_red_fort",
            "name": "Red Fort (Lal Qila) & Diwan-i-Khas",
            "city": "Delhi",
            "category": "Landmarks",
            "lat": 28.6562,
            "lng": 77.2410,
            "address": "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006",
            "open_time": "09:30",
            "close_time": "17:30",
            "avg_cost": 100.0,
            "avg_duration": 120,
            "description": "Historic citadel where India\'s Prime Minister hoists the tricolour on Independence Day."
        },
        {
            "id": "del_akshardham",
            "name": "Swaminarayan Akshardham Cultural Boat Ride",
            "city": "Delhi",
            "category": "Art & Culture",
            "lat": 28.6127,
            "lng": 77.2773,
            "address": "Noida Mor, Pandav Nagar, New Delhi, Delhi 110092",
            "open_time": "10:00",
            "close_time": "20:00",
            "avg_cost": 250.0,
            "avg_duration": 180,
            "description": "Colossal pink sandstone and Italian Carrara marble temple with thematic boat ride through 10,000 years of Indian history."
        },
        {
            "id": "del_lotus",
            "name": "Lotus Temple (Bahá\'í House of Worship)",
            "city": "Delhi",
            "category": "Landmarks",
            "lat": 28.5535,
            "lng": 77.2588,
            "address": "Lotus Temple Rd, Bahapur, Kalkaji, New Delhi, Delhi 110019",
            "open_time": "08:30",
            "close_time": "17:30",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Petaled white marble lotus blossom open to people of all faiths for silent meditation in peaceful garden ponds."
        },
        {
            "id": "del_lodhi_gardens",
            "name": "Lodhi Gardens & Sikandar Lodi Tomb",
            "city": "Delhi",
            "category": "Nature & Outdoors",
            "lat": 28.5931,
            "lng": 77.2197,
            "address": "Lodhi Rd, Lodhi Gardens, Lodhi Estate, New Delhi, Delhi 110003",
            "open_time": "06:00",
            "close_time": "20:00",
            "avg_cost": 0.0,
            "avg_duration": 75,
            "description": "90-acre lush heritage park with 15th-century Pashtun tombs, ancient stone bridges, and bird sanctuary paths."
        },
        {
            "id": "del_bangla_sahib",
            "name": "Gurudwara Bangla Sahib & Sacred Sarovar",
            "city": "Delhi",
            "category": "Art & Culture",
            "lat": 28.6264,
            "lng": 77.2091,
            "address": "Hanuman Road Area, Connaught Place, New Delhi, Delhi 110001",
            "open_time": "04:00",
            "close_time": "23:59",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Golden domed Sikh sanctuary with holy healing waters and open 24/7 community langar kitchen serving thousands."
        },
        {
            "id": "del_jama_masjid",
            "name": "Jama Masjid of Delhi & Gate 1 Vistas",
            "city": "Delhi",
            "category": "Landmarks",
            "lat": 28.6507,
            "lng": 77.2334,
            "address": "Meena Bazaar, Jama Masjid, Chandni Chowk, New Delhi, Delhi 110006",
            "open_time": "07:00",
            "close_time": "18:30",
            "avg_cost": 50.0,
            "avg_duration": 60,
            "description": "India\'s largest historic mosque commissioned by Shah Jahan in 1656 with red sandstone courtyards holding 25,000 worshippers."
        },
        {
            "id": "del_hauz_khas",
            "name": "Hauz Khas Medieval Madrasa & Lake Walk",
            "city": "Delhi",
            "category": "Nature & Outdoors",
            "lat": 28.5529,
            "lng": 77.1947,
            "address": "Hauz Khas Village, Deer Park, New Delhi, Delhi 110016",
            "open_time": "07:00",
            "close_time": "19:00",
            "avg_cost": 25.0,
            "avg_duration": 90,
            "description": "14th-century royal water reservoir, madrasa pavilions, and vibrant modern art and cafe street culture."
        },
        {
            "id": "del_agrasen_baoli",
            "name": "Agrasen Ki Baoli Stepwell",
            "city": "Delhi",
            "category": "Landmarks",
            "lat": 28.6258,
            "lng": 77.2250,
            "address": "Hailey Road, KG Marg, Connaught Place, New Delhi 110001",
            "open_time": "09:00",
            "close_time": "17:30",
            "avg_cost": 0.0,
            "avg_duration": 45,
            "description": "Atmospheric 60-meter long deep historical stepwell with 108 stone steps in the heart of modern New Delhi."
        },
        {
            "id": "del_dilli_haat",
            "name": "Dilli Haat INA Craft Bazaar & State Food Stalls",
            "city": "Delhi",
            "category": "Food & Dining",
            "lat": 28.5732,
            "lng": 77.2081,
            "address": "Kidwai Nagar West, Dilli Haat, New Delhi, Delhi 110023",
            "open_time": "10:30",
            "close_time": "22:00",
            "avg_cost": 100.0,
            "avg_duration": 120,
            "description": "Open-air village market showcasing master artisans and regional delicacies from all 28 states of India."
        },
        {
            "id": "del_chandni_chowk",
            "name": "Chandni Chowk & Paranthe Wali Gali",
            "city": "Delhi",
            "category": "Food & Dining",
            "lat": 28.6506,
            "lng": 77.2303,
            "address": "Old Delhi, Delhi 110006",
            "open_time": "10:00",
            "close_time": "22:00",
            "avg_cost": 300.0,
            "avg_duration": 90,
            "description": "Legendary centuries-old culinary street famous for hot stuffed paranthas, rabri jalebi, and spice market aromas."
        },
        {
            "id": "del_amrit_udyan",
            "name": "Rashtrapati Bhavan & Amrit Udyan Gardens",
            "city": "Delhi",
            "category": "Nature & Outdoors",
            "lat": 28.6143,
            "lng": 77.1994,
            "address": "President\'s Estate, New Delhi, Delhi 110004",
            "open_time": "10:00",
            "close_time": "17:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Majestic presidential estate featuring circular Mughal gardens with hundreds of varieties of roses and fountains."
        }
    ],

    # 4. GOA
    "goa": [
        {
            "id": "goa_bom_jesus",
            "name": "Basilica of Bom Jesus (Old Goa)",
            "city": "Goa",
            "category": "Art & Culture",
            "lat": 15.5009,
            "lng": 73.9116,
            "address": "Old Goa Rd, Bainguinim, Goa 403402",
            "open_time": "09:00",
            "close_time": "18:30",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "UNESCO World Heritage landmark housing the sacred relics of St. Francis Xavier, an exemplar of Baroque architecture."
        },
        {
            "id": "goa_aguada",
            "name": "Fort Aguada & Coastal Lighthouse",
            "city": "Goa",
            "category": "Landmarks",
            "lat": 15.4920,
            "lng": 73.7737,
            "address": "Sinquerim, Candolim, Goa 403515",
            "open_time": "09:30",
            "close_time": "18:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Well-preserved 17th-century Portuguese fortress overlooking the Arabian Sea at Sinquerim beach."
        },
        {
            "id": "goa_baga",
            "name": "Baga Beach Watersports & Sunset Shacks",
            "city": "Goa",
            "category": "Nature & Outdoors",
            "lat": 15.5553,
            "lng": 73.7517,
            "address": "Baga Beach, Calangute, Goa 403516",
            "open_time": "07:00",
            "close_time": "23:00",
            "avg_cost": 800.0,
            "avg_duration": 180,
            "description": "Golden sand beach bustling with parasailing, jet skis, and candle-lit beach shacks serving fresh kingfish."
        },
        {
            "id": "goa_dudhsagar",
            "name": "Dudhsagar Waterfalls Eco Safari",
            "city": "Goa",
            "category": "Nature & Outdoors",
            "lat": 15.3144,
            "lng": 74.3143,
            "address": "Sonaulim, Goa 403410",
            "open_time": "08:00",
            "close_time": "16:30",
            "avg_cost": 1200.0,
            "avg_duration": 240,
            "description": "Four-tiered milky-white cascade plunging 310 meters down the Western Ghats reachable by guided jungle 4x4 jeeps."
        },
        {
            "id": "goa_chapora",
            "name": "Chapora Fort (Dil Chahta Hai Sunset Vantage)",
            "city": "Goa",
            "category": "Landmarks",
            "lat": 15.6059,
            "lng": 73.7381,
            "address": "Chapora, Vagator, Goa 403509",
            "open_time": "06:00",
            "close_time": "19:00",
            "avg_cost": 0.0,
            "avg_duration": 75,
            "description": "Ancient red-laterite fortress ramparts commanding panoramic views of Vagator Beach and Chapora River mouth."
        },
        {
            "id": "goa_fontainhas",
            "name": "Fontainhas Latin Quarter Heritage Walk",
            "city": "Goa",
            "category": "Art & Culture",
            "lat": 15.4989,
            "lng": 73.8298,
            "address": "Fontainhas, Mala, Panaji, Goa 403001",
            "open_time": "08:00",
            "close_time": "20:00",
            "avg_cost": 0.0,
            "avg_duration": 90,
            "description": "Quaint pastel-painted Portuguese villas, terracotta-tiled roofs, wrought iron balconies, and heritage bakeries."
        },
        {
            "id": "goa_palolem",
            "name": "Palolem Beach Crescent & Butterfly Island",
            "city": "Goa",
            "category": "Nature & Outdoors",
            "lat": 15.0100,
            "lng": 74.0232,
            "address": "Palolem Beach, Canacona, South Goa 403702",
            "open_time": "06:00",
            "close_time": "23:00",
            "avg_cost": 500.0,
            "avg_duration": 150,
            "description": "Scenic semi-circular crescent bay with calm turquoise waters, coconut palms, and dolphin-spotting boat trips."
        },
        {
            "id": "goa_spice_plantation",
            "name": "Sahakari Organic Spice Plantation & Lunch",
            "city": "Goa",
            "category": "Food & Dining",
            "lat": 15.4215,
            "lng": 74.0245,
            "address": "Curti, Ponda, Goa 403401",
            "open_time": "09:00",
            "close_time": "16:30",
            "avg_cost": 600.0,
            "avg_duration": 120,
            "description": "Guided agro-tour amidst cardamom, peri-peri, vanilla, and cinnamon trees followed by authentic buffet on betelnut plates."
        },
        {
            "id": "goa_se_cathedral",
            "name": "Se Cathedral & Church of St. Francis",
            "city": "Goa",
            "category": "Art & Culture",
            "lat": 15.5036,
            "lng": 73.9125,
            "address": "Velha, Goa 403402",
            "open_time": "07:30",
            "close_time": "18:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "One of the largest churches in Asia, dedicated to St. Catherine of Alexandria with the famed Golden Bell."
        },
        {
            "id": "goa_morjim",
            "name": "Morjim Beach & Olive Ridley Turtle Sanctuary",
            "city": "Goa",
            "category": "Nature & Outdoors",
            "lat": 15.6267,
            "lng": 73.7345,
            "address": "Morjim, Pernem, North Goa 403512",
            "open_time": "06:00",
            "close_time": "20:00",
            "avg_cost": 0.0,
            "avg_duration": 90,
            "description": "Pristine white sand beach and protected nesting habitat for endangered Olive Ridley sea turtles."
        },
        {
            "id": "goa_mandovi_cruise",
            "name": "Mandovi River Sunset Cultural Cruise",
            "city": "Goa",
            "category": "Food & Dining",
            "lat": 15.4985,
            "lng": 73.8242,
            "address": "Captain of Ports Jetty, Panaji, Goa 403001",
            "open_time": "17:30",
            "close_time": "20:30",
            "avg_cost": 500.0,
            "avg_duration": 90,
            "description": "Evening catamaran cruise along Mandovi River with traditional Goan Dekhni and Fugdi folk dance performances."
        },
        {
            "id": "goa_wharf",
            "name": "Fisherman\'s Wharf Goan Seafood & Music",
            "city": "Goa",
            "category": "Food & Dining",
            "lat": 15.1587,
            "lng": 73.9431,
            "address": "Mobor, Cavelossim, Goa 403731",
            "open_time": "12:00",
            "close_time": "23:00",
            "avg_cost": 950.0,
            "avg_duration": 90,
            "description": "Riverside dining offering prawn balchão, Goan fish curry rice, bebinca, and live acoustic bands."
        }
    ],

    # 5. VARANASI
    "varanasi": [
        {
            "id": "var_kashi",
            "name": "Kashi Vishwanath Temple Corridor",
            "city": "Varanasi",
            "category": "Landmarks",
            "lat": 25.3109,
            "lng": 83.0107,
            "address": "Lahori Tola, Varanasi, Uttar Pradesh 221001",
            "open_time": "04:00",
            "close_time": "23:00",
            "avg_cost": 250.0,
            "avg_duration": 90,
            "description": "One of the most sacred Jyotirlinga shrines dedicated to Lord Shiva on the western banks of the holy Ganges."
        },
        {
            "id": "var_aarti",
            "name": "Dashashwamedh Ghat Grand Ganga Aarti",
            "city": "Varanasi",
            "category": "Art & Culture",
            "lat": 25.3069,
            "lng": 83.0105,
            "address": "Dashashwamedh Ghat Rd, Bangali Tola, Varanasi, UP 221001",
            "open_time": "17:30",
            "close_time": "20:00",
            "avg_cost": 150.0,
            "avg_duration": 90,
            "description": "Spectacular evening devotional ceremony with synchronized brass lamps, incense, conch shells, and chanting."
        },
        {
            "id": "var_sarnath",
            "name": "Sarnath Dhamek Stupa & Deer Park",
            "city": "Varanasi",
            "category": "Art & Culture",
            "lat": 25.3811,
            "lng": 83.0214,
            "address": "Sarnath, Varanasi, Uttar Pradesh 221007",
            "open_time": "09:00",
            "close_time": "17:00",
            "avg_cost": 50.0,
            "avg_duration": 120,
            "description": "Holy site where Gautama Buddha taught his first sermon (Dharmachakra Pravartana) and location of the Ashoka Pillar."
        },
        {
            "id": "var_boat",
            "name": "Subah-e-Banaras Morning Ganges Boat Ride",
            "city": "Varanasi",
            "category": "Nature & Outdoors",
            "lat": 25.2981,
            "lng": 83.0067,
            "address": "Assi Ghat, Varanasi, Uttar Pradesh 221005",
            "open_time": "05:30",
            "close_time": "08:30",
            "avg_cost": 450.0,
            "avg_duration": 90,
            "description": "Peaceful sunrise rowboat excursion gliding past 84 ancient stone ghats reflecting the morning sun."
        },
        {
            "id": "var_ramnagar",
            "name": "Ramnagar Fort & Royal Vintage Museum",
            "city": "Varanasi",
            "category": "Landmarks",
            "lat": 25.2718,
            "lng": 83.0255,
            "address": "Ramnagar Fort, Varanasi, Uttar Pradesh 221008",
            "open_time": "10:00",
            "close_time": "17:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "18th-century cream-coloured Chunar sandstone palace on eastern bank of Ganges featuring royal palanquins and armouries."
        },
        {
            "id": "var_bhu",
            "name": "Banaras Hindu University & New Vishwanath Mandir",
            "city": "Varanasi",
            "category": "Art & Culture",
            "lat": 25.2677,
            "lng": 82.9913,
            "address": "BHU Campus, Varanasi, Uttar Pradesh 221005",
            "open_time": "05:00",
            "close_time": "21:00",
            "avg_cost": 50.0,
            "avg_duration": 75,
            "description": "Asia\'s largest residential university campus founded by Pt. Madan Mohan Malaviya with the soaring Birla temple."
        },
        {
            "id": "var_silk_weavers",
            "name": "Godowlia Banarasi Silk Weavers Quarter",
            "city": "Varanasi",
            "category": "Food & Dining",
            "lat": 25.3085,
            "lng": 83.0055,
            "address": "Godowlia Crossing, Varanasi, Uttar Pradesh 221001",
            "open_time": "10:30",
            "close_time": "21:00",
            "avg_cost": 500.0,
            "avg_duration": 90,
            "description": "Traditional artisan studios weaving world-renowned gold and silver zari brocade Banarasi sarees."
        },
        {
            "id": "var_manikarnika",
            "name": "Manikarnika Ghat & Heritage Alley Walk",
            "city": "Varanasi",
            "category": "Art & Culture",
            "lat": 25.3105,
            "lng": 83.0145,
            "address": "Manikarnika Ghat, Varanasi, Uttar Pradesh 221001",
            "open_time": "06:00",
            "close_time": "20:00",
            "avg_cost": 100.0,
            "avg_duration": 60,
            "description": "Sacred primary cremation ghat with centuries-old eternal fires and ancient stone kunds."
        },
        {
            "id": "var_food",
            "name": "Banarasi Kashi Chaat & Malaiyo Delicacies",
            "city": "Varanasi",
            "category": "Food & Dining",
            "lat": 25.3090,
            "lng": 83.0060,
            "address": "Girja Ghar Crossing, Godowlia, Varanasi, Uttar Pradesh 221001",
            "open_time": "14:00",
            "close_time": "22:30",
            "avg_cost": 250.0,
            "avg_duration": 45,
            "description": "Iconic tamatar chaat, palak chaat, dahi vada, and seasonal saffron-froth winter malaiyo."
        }
    ],

    # 6. KERALA
    "kerala": [
        {
            "id": "ker_backwaters",
            "name": "Alleppey Houseboat Backwaters Cruise",
            "city": "Kerala",
            "category": "Nature & Outdoors",
            "lat": 9.4981,
            "lng": 76.3388,
            "address": "Finishing Point, Punnamada, Alappuzha, Kerala 688013",
            "open_time": "10:30",
            "close_time": "17:30",
            "avg_cost": 2200.0,
            "avg_duration": 240,
            "description": "Glide along tranquil palm-fringed canals, paddy fields, and lagoons aboard a traditional handcrafted kettuvallam houseboat."
        },
        {
            "id": "ker_munnar_tea",
            "name": "Munnar Rolling Tea Gardens & Museum",
            "city": "Kerala",
            "category": "Nature & Outdoors",
            "lat": 10.0889,
            "lng": 77.0595,
            "address": "Nullatanni, Munnar, Kerala 685612",
            "open_time": "09:00",
            "close_time": "17:00",
            "avg_cost": 200.0,
            "avg_duration": 120,
            "description": "Emerald mountain tea plantations nestled 1,600m above sea level with aromatic fresh tea tastings."
        },
        {
            "id": "ker_kochi_fort",
            "name": "Fort Kochi & Chinese Fishing Nets",
            "city": "Kerala",
            "category": "Landmarks",
            "lat": 9.9674,
            "lng": 76.2427,
            "address": "River Rd, Fort Kochi, Kochi, Kerala 682001",
            "open_time": "06:00",
            "close_time": "21:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Historic colonial seaside quarter famous for cantilevers of Chinese fishing nets and Jewish Synagogue."
        },
        {
            "id": "ker_periyar",
            "name": "Periyar Wildlife Sanctuary Lake Safari (Thekkady)",
            "city": "Kerala",
            "category": "Nature & Outdoors",
            "lat": 9.4679,
            "lng": 77.1435,
            "address": "Kumily, Thekkady, Kerala 685509",
            "open_time": "06:30",
            "close_time": "17:30",
            "avg_cost": 550.0,
            "avg_duration": 150,
            "description": "Protected tiger and elephant reserve offering peaceful reservoir boat cruises to view wild elephant herds."
        },
        {
            "id": "ker_eravikulam",
            "name": "Eravikulam National Park & Anamudi Summit",
            "city": "Kerala",
            "category": "Nature & Outdoors",
            "lat": 10.1500,
            "lng": 77.0667,
            "address": "Kannan Devan Hills, Munnar, Kerala 685612",
            "open_time": "07:30",
            "close_time": "16:00",
            "avg_cost": 200.0,
            "avg_duration": 150,
            "description": "High-altitude shola grassland plateau home to the rare Nilgiri Tahr mountain goat and Neelakurinji flowers."
        },
        {
            "id": "ker_athirappilly",
            "name": "Athirappilly Waterfalls (Niagara of India)",
            "city": "Kerala",
            "category": "Nature & Outdoors",
            "lat": 10.2851,
            "lng": 76.5698,
            "address": "Athirappilly, Chalakudy, Kerala 680721",
            "open_time": "08:00",
            "close_time": "17:00",
            "avg_cost": 50.0,
            "avg_duration": 120,
            "description": "Thundering 80-foot waterfall cascading through dense Vazhachal rainforest into the Chalakudy River."
        },
        {
            "id": "ker_varkala",
            "name": "Varkala Red Cliff & Papanasam Beach",
            "city": "Kerala",
            "category": "Nature & Outdoors",
            "lat": 8.7379,
            "lng": 76.7163,
            "address": "Varkala Cliff, Thiruvananthapuram, Kerala 695141",
            "open_time": "06:00",
            "close_time": "22:00",
            "avg_cost": 0.0,
            "avg_duration": 120,
            "description": "Dramatic tertiary sedimentary red cliffs directly abutting the Arabian Sea with natural sulfur water springs."
        },
        {
            "id": "ker_kathakali",
            "name": "Kerala Kathakali Centre Performance & Makeup",
            "city": "Kerala",
            "category": "Art & Culture",
            "lat": 9.9658,
            "lng": 76.2415,
            "address": "KB Jacob Rd, Fort Kochi, Kochi, Kerala 682001",
            "open_time": "17:00",
            "close_time": "20:00",
            "avg_cost": 400.0,
            "avg_duration": 120,
            "description": "Classical Indian dance drama with intricate facial makeup, elaborate costume rituals, and percussion storytelling."
        },
        {
            "id": "ker_sadya",
            "name": "Traditional Banana-Leaf Kerala Sadya Feast",
            "city": "Kerala",
            "category": "Food & Dining",
            "lat": 9.9723,
            "lng": 76.2785,
            "address": "Mahatma Gandhi Rd, Ernakulam, Kochi, Kerala 682016",
            "open_time": "12:00",
            "close_time": "15:30",
            "avg_cost": 350.0,
            "avg_duration": 60,
            "description": "Vegetarian multi-course culinary tradition with 24 accompaniments, sambar, avial, payasam on fresh banana leaves."
        }
    ],

    # 7. VADODARA
    "vadodara": [
        {
            "id": "vad_laxmi_vilas",
            "name": "Lakshmi Vilas Palace (Gaekwad Royal Residence)",
            "city": "Vadodara",
            "category": "Landmarks",
            "lat": 22.2937,
            "lng": 73.1914,
            "address": "J N Marg, Moti Baug, Vadodara, Gujarat 390001",
            "open_time": "09:30",
            "close_time": "17:00",
            "avg_cost": 250.0,
            "avg_duration": 150,
            "description": "World\'s largest private royal palace, 4 times the size of Buckingham Palace, built by Maharaja Sayajirao Gaekwad III in 1890."
        },
        {
            "id": "vad_sayaji_baug",
            "name": "Sayaji Baug (Kamati Baug) & Planetarium",
            "city": "Vadodara",
            "category": "Nature & Outdoors",
            "lat": 22.3129,
            "lng": 73.1895,
            "address": "Vinoba Bhave Rd, Dak Bunglaw, Sayajiganj, Vadodara 390002",
            "open_time": "06:00",
            "close_time": "21:00",
            "avg_cost": 20.0,
            "avg_duration": 90,
            "description": "Expansive 113-acre royal garden dedicated in 1879 with floral clock, toy train, zoo, and Sardar Patel planetarium."
        },
        {
            "id": "vad_baroda_museum",
            "name": "Baroda Museum & Picture Gallery",
            "city": "Vadodara",
            "category": "Art & Culture",
            "lat": 22.3142,
            "lng": 73.1884,
            "address": "Sayaji Baug, Dak Bunglaw, Sayajiganj, Vadodara 390018",
            "open_time": "10:30",
            "close_time": "17:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Victorian-styled grand museum modeled on the V&A London, housing a blue whale skeleton and rare Raja Ravi Varma canvases."
        },
        {
            "id": "vad_kirti_mandir",
            "name": "Kirti Mandir Gaekwad Royal Cenotaphs",
            "city": "Vadodara",
            "category": "Art & Culture",
            "lat": 22.3015,
            "lng": 73.2085,
            "address": "Kothi Rd, Raopura, Mandvi, Vadodara, Gujarat 390001",
            "open_time": "09:00",
            "close_time": "18:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Family memorial of the Gaekwads featuring an E-shaped edifice with stone balconies and murals by Nandalal Bose."
        },
        {
            "id": "vad_mandvi_gate",
            "name": "Mandvi Gate & Lehripura Historical Quarter",
            "city": "Vadodara",
            "category": "Landmarks",
            "lat": 22.3005,
            "lng": 73.2132,
            "address": "Mandvi, Vadodara, Gujarat 390001",
            "open_time": "08:00",
            "close_time": "22:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "16th-century Mughal square arch pavilion illuminated at night in the heart of old Baroda bazaars."
        },
        {
            "id": "vad_sursagar_lake",
            "name": "Sursagar Lake & 120ft Lord Shiva Statue",
            "city": "Vadodara",
            "category": "Nature & Outdoors",
            "lat": 22.2985,
            "lng": 73.2055,
            "address": "Sursagar Lake, Mandvi, Vadodara, Gujarat 390001",
            "open_time": "06:00",
            "close_time": "23:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Perennial scenic lake with the towering gold-plated 120-foot Sarveshwar Mahadev statue rising from the waters."
        },
        {
            "id": "vad_food",
            "name": "Mandap Authentic Gujarati Thali & Sev Usal",
            "city": "Vadodara",
            "category": "Food & Dining",
            "lat": 22.3082,
            "lng": 73.1705,
            "address": "Express Hotel, RC Dutt Rd, Alkapuri, Vadodara, Gujarat 390007",
            "open_time": "12:00",
            "close_time": "22:30",
            "avg_cost": 450.0,
            "avg_duration": 75,
            "description": "Celebrated authentic royal Gujarati dining featuring farsan, undhiyu, fresh jalebi, kadi khichdi, and local spicy Vadodara sev usal."
        }
    ],

    # 8. KEVADIA (Statue of Unity)
    "kevadia": [
        {
            "id": "kev_sou",
            "name": "Statue of Unity (World\'s Tallest Monument - 182m)",
            "city": "Kevadia",
            "category": "Landmarks",
            "lat": 21.8380,
            "lng": 73.7191,
            "address": "Sardar Sarovar Dam, Kevadia, Narmada, Gujarat 393151",
            "open_time": "08:00",
            "close_time": "18:00",
            "avg_cost": 380.0,
            "avg_duration": 180,
            "description": "World\'s tallest statue honoring Sardar Vallabhbhai Patel, standing at 182 meters with viewing gallery at 153m."
        },
        {
            "id": "kev_dam",
            "name": "Sardar Sarovar Dam Viewpoint & Lake",
            "city": "Kevadia",
            "category": "Nature & Outdoors",
            "lat": 21.8285,
            "lng": 73.7485,
            "address": "Dam Viewpoint, Kevadia, Gujarat 393151",
            "open_time": "08:30",
            "close_time": "17:30",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": "Massive concrete gravity dam on Narmada River generating clean hydro-power and lifelines across western India."
        },
        {
            "id": "kev_valley_flowers",
            "name": "Valley of Flowers & Bharat Van Garden",
            "city": "Kevadia",
            "category": "Nature & Outdoors",
            "lat": 21.8415,
            "lng": 73.7250,
            "address": "Near Statue of Unity, Kevadia, Gujarat 393151",
            "open_time": "08:00",
            "close_time": "18:30",
            "avg_cost": 50.0,
            "avg_duration": 75,
            "description": "24-acre landscaped botanical floral garden boasting millions of blossoming plants with photo-points."
        },
        {
            "id": "kev_laser_show",
            "name": "Statue of Unity Laser Light & Sound Show",
            "city": "Kevadia",
            "category": "Art & Culture",
            "lat": 21.8380,
            "lng": 73.7191,
            "address": "SoU Campus, Kevadia, Gujarat 393151",
            "open_time": "19:00",
            "close_time": "20:30",
            "avg_cost": 0.0,
            "avg_duration": 45,
            "description": "Mesmerizing evening laser projection mapping the life and unification journey of Sardar Patel directly on the 182m facade."
        },
        {
            "id": "kev_jungle_safari",
            "name": "Kevadia Jungle Safari & Zoological Park",
            "city": "Kevadia",
            "category": "Nature & Outdoors",
            "lat": 21.8480,
            "lng": 73.7110,
            "address": "Jungle Safari, Kevadia, Gujarat 393151",
            "open_time": "08:00",
            "close_time": "17:00",
            "avg_cost": 200.0,
            "avg_duration": 150,
            "description": "State-of-the-art geo-fenced zoological park featuring Asian lions, royal Bengal tigers, zebras, and walk-in aviaries."
        },
        {
            "id": "kev_cactus_garden",
            "name": "Cactus Garden & Butterfly Park",
            "city": "Kevadia",
            "category": "Nature & Outdoors",
            "lat": 21.8350,
            "lng": 73.7420,
            "address": "Opposite Dam, Kevadia, Gujarat 393151",
            "open_time": "09:00",
            "close_time": "17:00",
            "avg_cost": 60.0,
            "avg_duration": 60,
            "description": "Grand collection of 450+ xerophytic cactus species and vibrant pollinator garden on the banks of Narmada."
        },
        {
            "id": "kev_narmada_cruise",
            "name": "Narmada River Electric Boat Cruise",
            "city": "Kevadia",
            "category": "Nature & Outdoors",
            "lat": 21.8420,
            "lng": 73.7180,
            "address": "Shreshtha Bharat Bhavan, Kevadia 393151",
            "open_time": "09:00",
            "close_time": "17:30",
            "avg_cost": 300.0,
            "avg_duration": 60,
            "description": "Eco-friendly scenic boat cruise along the Narmada River providing panoramic views of the Statue and lush Vindhyachal hills."
        }
    ],

    # 9. PARIS
    "paris": [
        {
            "id": "par_louvre",
            "name": "Louvre Museum",
            "city": "Paris",
            "category": "Art & Culture",
            "lat": 48.8606,
            "lng": 2.3376,
            "address": "Rue de Rivoli, 75001 Paris",
            "open_time": "09:00",
            "close_time": "18:00",
            "avg_cost": 1950.0,
            "avg_duration": 150,
            "description": "World\'s largest art museum and historic monument with the Mona Lisa."
        },
        {
            "id": "par_orsay",
            "name": "Musée d\'Orsay",
            "city": "Paris",
            "category": "Art & Culture",
            "lat": 48.8599,
            "lng": 2.3265,
            "address": "1 Rue de la Légion d\'Honneur, 75007 Paris",
            "open_time": "09:30",
            "close_time": "18:00",
            "avg_cost": 1450.0,
            "avg_duration": 120,
            "description": "Impressionist and post-Impressionist masterpieces in a grand Beaux-Arts railway station."
        },
        {
            "id": "par_eiffel",
            "name": "Eiffel Tower Summit & Esplanade",
            "city": "Paris",
            "category": "Landmarks",
            "lat": 48.8584,
            "lng": 2.2945,
            "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
            "open_time": "09:00",
            "close_time": "23:00",
            "avg_cost": 2950.0,
            "avg_duration": 120,
            "description": "Iconic wrought-iron lattice tower overlooking the Champ de Mars."
        },
        {
            "id": "par_tuileries",
            "name": "Tuileries Garden Stroll",
            "city": "Paris",
            "category": "Nature & Outdoors",
            "lat": 48.8634,
            "lng": 2.3275,
            "address": "Place de la Concorde, 75001 Paris",
            "open_time": "07:00",
            "close_time": "21:00",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Historic public garden located between the Louvre and Place de la Concorde."
        },
        {
            "id": "par_seine_cruise",
            "name": "Bateaux Mouches Seine River Cruise",
            "city": "Paris",
            "category": "Nature & Outdoors",
            "lat": 48.8635,
            "lng": 2.3015,
            "address": "Pont de l\'Alma, 75008 Paris",
            "open_time": "10:00",
            "close_time": "22:00",
            "avg_cost": 1400.0,
            "avg_duration": 75,
            "description": "Iconic riverboat cruise passing Notre-Dame, Pont Alexandre III, and the illuminated Parisian bridges."
        },
        {
            "id": "par_notre_dame",
            "name": "Notre-Dame Cathedral & Île de la Cité",
            "city": "Paris",
            "category": "Landmarks",
            "lat": 48.8530,
            "lng": 2.3499,
            "address": "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris",
            "open_time": "08:00",
            "close_time": "18:45",
            "avg_cost": 0.0,
            "avg_duration": 60,
            "description": "Masterpiece of French Gothic architecture with restored soaring spire and rose stained glass windows."
        },
        {
            "id": "par_bistro_marais",
            "name": "Bistrot des Vosges in Le Marais",
            "city": "Paris",
            "category": "Food & Dining",
            "lat": 48.8555,
            "lng": 2.3662,
            "address": "31 Bd Beaumarchais, 75004 Paris",
            "open_time": "12:00",
            "close_time": "22:30",
            "avg_cost": 3200.0,
            "avg_duration": 90,
            "description": "Authentic French cuisine, confit duck, and fine wine in the heart of Marais."
        }
    ],

    # 10. TOKYO
    "tokyo": [
        {
            "id": "tok_sensoji",
            "name": "Senso-ji Temple & Nakamise Street",
            "city": "Tokyo",
            "category": "Landmarks",
            "lat": 35.7148,
            "lng": 139.7967,
            "address": "2-3-1 Asakusa, Taito City, Tokyo",
            "open_time": "06:00",
            "close_time": "17:00",
            "avg_cost": 0.0,
            "avg_duration": 90,
            "description": "Tokyo\'s oldest and most significant Buddhist temple with traditional craft stalls."
        },
        {
            "id": "tok_teamlab",
            "name": "teamLab Planets TOKYO",
            "city": "Tokyo",
            "category": "Art & Culture",
            "lat": 35.6491,
            "lng": 139.7898,
            "address": "6-1-16 Toyosu, Koto City, Tokyo",
            "open_time": "09:00",
            "close_time": "22:00",
            "avg_cost": 2900.0,
            "avg_duration": 120,
            "description": "Immersive digital art museum where visitors walk through crystalline water installations."
        },
        {
            "id": "tok_shibuya",
            "name": "Shibuya Crossing & Sky Observatory",
            "city": "Tokyo",
            "category": "Landmarks",
            "lat": 35.6595,
            "lng": 139.7005,
            "address": "2-24-12 Shibuya, Shibuya City, Tokyo",
            "open_time": "10:00",
            "close_time": "22:30",
            "avg_cost": 1700.0,
            "avg_duration": 75,
            "description": "The world-famous scramble crossing paired with 360-degree open-air sky deck views."
        },
        {
            "id": "tok_meiji",
            "name": "Meiji Jingu Shinto Shrine & Yoyogi Forest",
            "city": "Tokyo",
            "category": "Nature & Outdoors",
            "lat": 35.6764,
            "lng": 139.6993,
            "address": "1-1 Yoyogikamizonocho, Shibuya City, Tokyo",
            "open_time": "06:00",
            "close_time": "18:00",
            "avg_cost": 0.0,
            "avg_duration": 75,
            "description": "Tranquil Shinto shrine situated in a peaceful 170-acre evergreen forest in central Tokyo."
        },
        {
            "id": "tok_ginza_ramen",
            "name": "Ginza Gourmet Ramen Experience",
            "city": "Tokyo",
            "category": "Food & Dining",
            "lat": 35.6719,
            "lng": 139.7640,
            "address": "Ginza, Chuo City, Tokyo",
            "open_time": "11:00",
            "close_time": "21:00",
            "avg_cost": 1200.0,
            "avg_duration": 60,
            "description": "Michelin recognized broth ramen with handmade noodles."
        }
    ]
}

INDIAN_CITY_COORDINATES: Dict[str, Tuple[float, float]] = {
    "agra": (27.1767, 78.0081),
    "delhi": (28.6139, 77.2090),
    "jaipur": (26.9124, 75.7873),
    "vadodara": (22.3072, 73.1812),
    "baroda": (22.3072, 73.1812),
    "ahmedabad": (23.0225, 72.5714),
    "mumbai": (19.0760, 72.8777),
    "pune": (18.5204, 73.8567),
    "goa": (15.2993, 74.1240),
    "varanasi": (25.3176, 82.9739),
    "kerala": (9.9312, 76.2673),
    "kochi": (9.9312, 76.2673),
    "kolkata": (22.5726, 88.3639),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "hyderabad": (17.3850, 78.4867),
    "chennai": (13.0827, 80.2707),
    "udaipur": (24.5854, 73.7125),
    "amritsar": (31.6340, 74.8723),
    "chandigarh": (30.7333, 76.7794),
    "lucknow": (26.8467, 80.9462),
    "surat": (21.1702, 72.8311),
    "indore": (22.7196, 75.8577),
    "bhopal": (23.2599, 77.4126),
    "rishikesh": (30.0869, 78.2676),
    "shimla": (31.1048, 77.1734),
    "manali": (32.2432, 77.1892),
    "mysore": (12.2958, 76.6394)
}

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def generate_dynamic_pois_for_city(city_name: str) -> List[Dict[str, Any]]:
    """Synthesizes realistic, rich, diverse POIs in INR (₹) across days so places never repeat."""
    clean_city = city_name.strip().title()
    dest_key = clean_city.lower()
    base_coords = INDIAN_CITY_COORDINATES.get(dest_key, (22.0 + (hash(clean_city) % 100) / 10.0, 78.0 + (hash(clean_city[::-1]) % 100) / 10.0))
    base_lat, base_lng = base_coords

    templates = [
        # Day 1: Historic Fortresses, Palaces & Heritage
        ("Imperial Citadel & Royal Palace", "Landmarks", 150.0, 120, "08:00", "18:00", 0.008, 0.009, "Grand historical fortress residence of ancient rulers with royal marble pavilions."),
        ("Historic Memorial & City Square", "Landmarks", 50.0, 60, "07:00", "22:00", 0.004, -0.005, "Central heritage square and memorial arch celebrating legendary historical events."),
        ("Royal Heritage Dinner & Regional Thali", "Food & Dining", 650.0, 90, "12:00", "23:00", -0.006, 0.008, "Celebrated authentic multi-course regional feast with local culinary specialties."),
        
        # Day 2: Spiritual Sanctuaries & Ancient Architecture
        ("Sacred Spiritual Temple & Golden Sanctum", "Art & Culture", 50.0, 90, "05:30", "21:30", -0.012, 0.006, "Centuries-old pilgrimage site known for peaceful morning rituals and architectural carvings."),
        ("Ancient Stepwell & Water Reservoir", "Art & Culture", 40.0, 75, "08:00", "17:30", 0.015, -0.012, "Intricate geometric subterranean stepwell showcasing master rainwater conservation."),
        ("Old Town Spice & Artisan Street Walk", "Food & Dining", 200.0, 90, "10:00", "21:30", -0.008, -0.015, "Lively heritage alley famous for fragrant spices, handmade sweets, and street food."),
        
        # Day 3: Scenic Lakes & Nature Escapes
        ("Serene Lake Promenade & Water Pavilion", "Nature & Outdoors", 50.0, 90, "06:00", "20:00", 0.018, 0.014, "Peaceful freshwater lake with panoramic reflection views, walking paths, and boats."),
        ("Botanical Valley & Orchid Sanctuary", "Nature & Outdoors", 40.0, 75, "06:30", "19:00", 0.022, -0.008, "Lush green landscaped park with exotic flowering trees, fountains, and butterfly gardens."),
        ("Lakeside Sunset Cafe & Cultural Folk Music", "Food & Dining", 500.0, 75, "16:00", "22:30", 0.016, 0.016, "Scenic sunset dining terrace overlooking tranquil water with acoustic folk performances."),
        
        # Day 4: Museums, Art & Royal Cenotaphs
        ("State Archaeological & Royal Armoury Museum", "Art & Culture", 100.0, 105, "10:00", "17:30", -0.015, 0.018, "Treasury of ancient bronze sculptures, royal portraits, historical manuscripts, and coins."),
        ("Royal Chhatris & Memorial Cenotaphs", "Landmarks", 50.0, 60, "08:00", "18:00", -0.019, -0.006, "Delicately carved sandstone cupolas honoring the royal dynasties amidst manicured lawns."),
        ("Traditional Silk & Handicraft Haat", "Food & Dining", 300.0, 90, "11:00", "21:00", 0.005, 0.022, "Government-recognized emporium for handloom textiles, pottery, and regional craftsmen."),
        
        # Day 5: Hilltop Viewpoints & Forest Reserves
        ("Panoramic Hilltop Fort & Sunset Ridge", "Landmarks", 100.0, 120, "07:00", "19:00", 0.025, 0.021, "Commanding high peak with 360-degree views across the entire city horizon and valleys."),
        ("Eco Forest Reserve & Wildlife Trail", "Nature & Outdoors", 80.0, 90, "06:30", "18:00", 0.028, -0.019, "Protected green sanctuary with migratory bird watchtowers and gentle nature trails."),
        ("Garden Court Tandoor & Grill Experience", "Food & Dining", 700.0, 90, "12:30", "23:00", 0.012, 0.005, "Al fresco tandoori restaurant serving freshly baked breads, kebabs, and mint chutneys."),

        # Day 6: Excursions & Cultural Villages
        ("Heritage Artisan Village & Puppet Theatre", "Art & Culture", 250.0, 120, "15:00", "21:30", -0.025, 0.025, "Immersive cultural center showcasing traditional rural crafts, pottery wheels, and dances."),
        ("Riverfront Ghats & Evening Lamp Aarti", "Art & Culture", 100.0, 90, "17:30", "20:00", 0.002, 0.019, "Devotional riverside ceremony with resonant conch shells, bronze oil lamps, and hymns."),
        ("Famous Confectionery & Mithai Heritage", "Food & Dining", 200.0, 45, "09:00", "22:00", -0.003, -0.008, "Centuries-old family sweet shop celebrated for signature regional milk sweets and savouries.")
    ]

    pois = []
    for idx, (title, cat, cost, dur, o_time, c_time, dlat, dlng, desc) in enumerate(templates):
        pois.append({
            "id": f"{clean_city.lower()[:3]}_{idx+1}",
            "name": f"{clean_city} {title}",
            "city": clean_city,
            "category": cat,
            "lat": round(base_lat + dlat, 4),
            "lng": round(base_lng + dlng, 4),
            "address": f"Heritage Sector {idx+1}, {clean_city}",
            "open_time": o_time,
            "close_time": c_time,
            "avg_cost": cost,
            "avg_duration": dur,
            "description": f"{clean_city} - {desc}"
        })
    return pois

def parse_origin_destination(query: str) -> Tuple[Optional[str], str]:
    q = (query or "").strip()
    patterns = [" to ", " -> ", " – ", " - "]
    for pat in patterns:
        if pat in q.lower():
            parts = re.split(re.escape(pat), q, flags=re.IGNORECASE, maxsplit=1)
            if len(parts) == 2 and parts[0].strip() and parts[1].strip():
                orig = re.sub(r'^(from|origin)\s+', '', parts[0].strip(), flags=re.IGNORECASE).strip().title()
                dest = re.sub(r'^(to|destination)\s+', '', parts[1].strip(), flags=re.IGNORECASE).strip().title()
                return orig, dest
    
    m = re.match(r'^(?:to\s+)?(.+?)\s+from\s+(.+)$', q, flags=re.IGNORECASE)
    if m:
        dest = m.group(1).strip().title()
        orig = m.group(2).strip().title()
        return orig, dest

    clean = re.sub(r'^(from|to)\s+', '', q, flags=re.IGNORECASE).strip().title()
    return None, clean or "Agra"

def get_pois_for_destination(destination: str) -> List[Dict[str, Any]]:
    origin, target_dest = parse_origin_destination(destination)
    dest_key = target_dest.strip().lower()
    for key, pois in SAMPLE_POIS.items():
        if key in dest_key or dest_key in key:
            return pois
    return generate_dynamic_pois_for_city(target_dest)

FOREIGN_LOCATIONS_SET = {
    "paris", "france", "tokyo", "japan", "dubai", "uae", "united arab emirates",
    "singapore", "london", "uk", "united kingdom", "england", "great britain",
    "new york", "usa", "united states", "america", "california", "texas", "florida",
    "rome", "italy", "milan", "venice", "florence", "switzerland", "zurich", "geneva",
    "berlin", "germany", "munich", "frankfurt", "amsterdam", "netherlands", "holland",
    "madrid", "spain", "barcelona", "vienna", "austria", "brussels", "belgium",
    "athens", "greece", "istanbul", "turkey", "bangkok", "thailand", "phuket", "pattaya",
    "bali", "indonesia", "jakarta", "kuala lumpur", "malaysia", "sydney", "australia",
    "melbourne", "toronto", "canada", "vancouver", "montreal", "cairo", "egypt",
    "maldives", "male", "mauritius", "colombo", "sri lanka", "kathmandu", "nepal",
    "doha", "qatar", "riyadh", "saudi arabia", "jeddah", "seoul", "south korea", "korea",
    "hanoi", "vietnam", "ho chi minh", "beijing", "china", "shanghai", "hong kong",
    "moscow", "russia", "auckland", "new zealand", "dublin", "ireland", "lisbon", "portugal",
    "oslo", "norway", "stockholm", "sweden", "copenhagen", "denmark", "helsinki", "finland",
    "prague", "czech", "budapest", "hungary", "warsaw", "poland", "mexico", "brazil",
    "buenos aires", "argentina", "cape town", "south africa", "johannesburg",
    "manila", "philippines", "taipei", "taiwan"
}

def is_foreign_place(place_str: str) -> bool:
    if not place_str:
        return False
    p = place_str.lower().strip()
    return any(k in p for k in FOREIGN_LOCATIONS_SET)

def get_realistic_transportation(
    destination: str,
    travel_mode: str,
    members_count: int,
    start_date: str,
    origin: Optional[str] = None
) -> Dict[str, Any]:
    parsed_origin, target_dest = parse_origin_destination(destination)
    effective_origin = origin or parsed_origin
    dest_clean = target_dest
    dest_lower = target_dest.lower()

    target_mode = travel_mode.lower().strip()
    if target_mode not in ["flight", "train", "road"]:
        target_mode = "road"

    # Check whether this is an international / cross-border route
    is_dest_foreign = is_foreign_place(dest_clean)
    is_orig_foreign = is_foreign_place(effective_origin or "")
    is_international = is_dest_foreign or is_orig_foreign

    if is_international:
        dist_km = 6500.0
        flight_hrs = 8.5
        flight_fare = 38000.0
        airline_name = "Air India / International Commercial Airlines"
        airport_code = "INTL"

        if "paris" in dest_lower or "france" in dest_lower:
            dist_km = 6700.0
            flight_hrs = 8.5
            flight_fare = 39800.0
            airline_name = "Air France AF-225 / Air India"
            airport_code = "CDG"
        elif "london" in dest_lower or "uk" in dest_lower or "england" in dest_lower:
            dist_km = 6750.0
            flight_hrs = 9.2
            flight_fare = 42500.0
            airline_name = "British Airways BA-142 / Virgin Atlantic"
            airport_code = "LHR"
        elif "dubai" in dest_lower or "uae" in dest_lower:
            dist_km = 2200.0
            flight_hrs = 3.8
            flight_fare = 18500.0
            airline_name = "Emirates EK-511 / Air India Express"
            airport_code = "DXB"
        elif "tokyo" in dest_lower or "japan" in dest_lower:
            dist_km = 5900.0
            flight_hrs = 7.8
            flight_fare = 44500.0
            airline_name = "Japan Airlines JL-750 / ANA"
            airport_code = "HND"
        elif "singapore" in dest_lower:
            dist_km = 4150.0
            flight_hrs = 5.5
            flight_fare = 21500.0
            airline_name = "Singapore Airlines SQ-401 / Air India"
            airport_code = "SIN"
        elif "york" in dest_lower or "usa" in dest_lower or "america" in dest_lower:
            dist_km = 11750.0
            flight_hrs = 15.2
            flight_fare = 64500.0
            airline_name = "Air India AI-101 / United Airlines"
            airport_code = "JFK"

        flight_mode_data = {
            "is_available": True,
            "route_name": f"International Flight to {dest_clean} ({airport_code})",
            "duration_hours": flight_hrs,
            "cost_per_person": flight_fare,
            "carrier_info": f"{airline_name} Scheduled International Service",
            "schedule": f"International flight departs on {start_date} (Terminal Check-in 3h prior)"
        }

        train_mode_data = {
            "is_available": False,
            "route_name": f"No Trains Available to {dest_clean}",
            "duration_hours": 0.0,
            "cost_per_person": 0.0,
            "carrier_info": "No railway service available for this international destination",
            "schedule": "No railway transport is possible across international borders"
        }

        road_mode_data = {
            "is_available": False,
            "route_name": f"No Road Transit Available to {dest_clean}",
            "duration_hours": 0.0,
            "cost_per_person": 0.0,
            "carrier_info": "Road cabs (Ola/Uber) do not operate across international borders",
            "schedule": "No road transport is possible across international borders"
        }

        available_modes = {
            "road": road_mode_data,
            "train": train_mode_data,
            "flight": flight_mode_data
        }

        per_person_fare = flight_mode_data["cost_per_person"]
        total_transit = round(per_person_fare * max(1, members_count), 2)

        return {
            "mode": "flight",
            "route_name": flight_mode_data["route_name"],
            "distance_km": dist_km,
            "duration_hours": flight_mode_data["duration_hours"],
            "estimated_duration_hours": flight_mode_data["duration_hours"],
            "cost_per_person": per_person_fare,
            "total_transit_cost": total_transit,
            "carrier_info": flight_mode_data["carrier_info"],
            "verified_schedule": flight_mode_data["schedule"],
            "is_international": True,
            "is_railway_possible": False,
            "is_road_possible": False,
            "notes": f"Notice: Railway and road (Ola/Uber) transport are not available for international travel to {dest_clean}. Flight transit has been scheduled.",
            "available_modes": available_modes
        }

    routes_database = {
        "agra": {
            "distance_km": 240.0,
            "road": {
                "route_name": "Yamuna Expressway (NH-19 / Taj Highway)",
                "duration_hours": 3.5,
                "cost_per_person": 750.0,
                "carrier_info": "AC Deluxe Volvo Express / Private Highway Cab",
                "schedule": f"Scheduled departure on {start_date} at 06:30 AM via Taj Expressway Toll Corridor"
            },
            "flight": {
                "route_name": "DEL to Kheria Airport (AGR) or Direct Air Shuttle",
                "duration_hours": 1.2,
                "cost_per_person": 3400.0,
                "carrier_info": "IndiGo 6E-7124 / Alliance Air",
                "schedule": f"Flight departs on {start_date} at 08:45 AM (Verified Airport Schedule)"
            },
            "train": {
                "route_name": "Vande Bharat Express (20172 / Gatimaan Superfast)",
                "duration_hours": 1.7,
                "cost_per_person": 1250.0,
                "carrier_info": "Indian Railways (IRCTC Executive / AC Chair Car)",
                "schedule": f"Train 20172 departs on {start_date} at 08:10 AM from Hazrat Nizamuddin"
            }
        },
        "jaipur": {
            "distance_km": 280.0,
            "road": {
                "route_name": "Delhi-Mumbai Expressway (NE-4 / Jaipur Spur)",
                "duration_hours": 3.8,
                "cost_per_person": 850.0,
                "carrier_info": "RSRTC Royal Gold Line / Highway AC Cruiser",
                "schedule": f"Departs on {start_date} at 07:00 AM via Sohna-Dausa Expressway Section"
            },
            "flight": {
                "route_name": "DEL to Jaipur International (JAI)",
                "duration_hours": 0.9,
                "cost_per_person": 2900.0,
                "carrier_info": "Air India AI-491 / SpiceJet",
                "schedule": f"Flight departs on {start_date} at 09:15 AM (Direct Flight)"
            },
            "train": {
                "route_name": "Jaipur Vande Bharat Express (20978)",
                "duration_hours": 3.2,
                "cost_per_person": 1400.0,
                "carrier_info": "Indian Railways (IRCTC Vande Bharat)",
                "schedule": f"Train 20978 departs on {start_date} at 06:10 AM from Delhi Cantt"
            }
        },
        "varanasi": {
            "distance_km": 820.0,
            "road": {
                "route_name": "Purvanchal Expressway Corridor (NH-19)",
                "duration_hours": 11.5,
                "cost_per_person": 1850.0,
                "carrier_info": "UPSRTC Multi-Axle Volvo Sleeper",
                "schedule": f"Overnight highway coach departs on {start_date} at 19:30 PM"
            },
            "flight": {
                "route_name": "DEL to Lal Bahadur Shastri Airport (VNS)",
                "duration_hours": 1.3,
                "cost_per_person": 4200.0,
                "carrier_info": "IndiGo 6E-2051 / Vistara",
                "schedule": f"Direct flight departs on {start_date} at 10:20 AM"
            },
            "train": {
                "route_name": "Kashi Vande Bharat Express (22436)",
                "duration_hours": 8.0,
                "cost_per_person": 1850.0,
                "carrier_info": "Indian Railways (IRCTC High-Speed Semi-Bullet)",
                "schedule": f"Train 22436 departs on {start_date} at 06:00 AM from New Delhi"
            }
        },
        "goa": {
            "distance_km": 580.0,
            "road": {
                "route_name": "Mumbai-Goa Coastal Expressway (NH-66)",
                "duration_hours": 9.5,
                "cost_per_person": 1600.0,
                "carrier_info": "Kadamba / Paulo Travels AC Sleeper Coach",
                "schedule": f"Highway sleeper leaves on {start_date} at 20:00 PM"
            },
            "flight": {
                "route_name": "Direct Flights to Manohar International MOPA (GOX)",
                "duration_hours": 1.2,
                "cost_per_person": 3900.0,
                "carrier_info": "IndiGo 6E-512 / Akasa Air",
                "schedule": f"Flight departs on {start_date} at 11:30 AM"
            },
            "train": {
                "route_name": "Madgaon Vande Bharat Express (22229)",
                "duration_hours": 7.5,
                "cost_per_person": 1950.0,
                "carrier_info": "Konkan Railway (Scenic Vande Bharat Route)",
                "schedule": f"Departs on {start_date} at 05:25 AM from CSMT Mumbai"
            }
        },
        "kerala": {
            "distance_km": 680.0,
            "road": {
                "route_name": "NH-544 & Kanyakumari-Panvel Coastal Corridor",
                "duration_hours": 10.0,
                "cost_per_person": 1500.0,
                "carrier_info": "KSRTC SWIFT Airavat Diamond Class",
                "schedule": f"Overnight luxury sleeper departs on {start_date} at 18:45 PM"
            },
            "flight": {
                "route_name": "Direct Flights to Cochin International Airport (COK)",
                "duration_hours": 1.4,
                "cost_per_person": 3800.0,
                "carrier_info": "Air India Express / IndiGo",
                "schedule": f"Flight departs on {start_date} at 09:00 AM (100% Solar Powered Airport)"
            },
            "train": {
                "route_name": "Kerala Vande Bharat Express (20633)",
                "duration_hours": 6.8,
                "cost_per_person": 1700.0,
                "carrier_info": "Southern Railway (IRCTC Vande Bharat)",
                "schedule": f"Train 20633 departs on {start_date} at 05:20 AM from Kasaragod"
            }
        },
        "delhi": {
            "distance_km": 250.0,
            "road": {
                "route_name": "National Highway 44 (Grand Trunk Corridor)",
                "duration_hours": 4.0,
                "cost_per_person": 650.0,
                "carrier_info": "Intercity Executive Sedan / AC Volvo",
                "schedule": f"Departs on {start_date} at 07:30 AM"
            },
            "flight": {
                "route_name": "Direct to Indira Gandhi International Airport (DEL)",
                "duration_hours": 1.1,
                "cost_per_person": 3200.0,
                "carrier_info": "Air India / IndiGo / SpiceJet",
                "schedule": f"Flight departs on {start_date} at 08:30 AM"
            },
            "train": {
                "route_name": "Rajdhani / Shatabdi Express Network",
                "duration_hours": 3.0,
                "cost_per_person": 1350.0,
                "carrier_info": "Northern Railway (IRCTC Premier)",
                "schedule": f"Departs on {start_date} at 06:45 AM"
            }
        }
    }

    matched_city = None
    for key in routes_database.keys():
        if key in dest_lower:
            matched_city = key
            break

    if not matched_city:
        dist_km = 450.0
        mode_data = {
            "road": {
                "is_available": True,
                "route_name": f"National Highway & Expressway to {dest_clean}",
                "duration_hours": 6.5,
                "cost_per_person": 1100.0,
                "carrier_info": "AC Multi-Axle Sleeper / Intercity Cab",
                "schedule": f"Scheduled departure on {start_date} at 07:00 AM via National Highway Network"
            },
            "train": {
                "is_available": True,
                "route_name": f"IRCTC Superfast / Vande Bharat Connection to {dest_clean}",
                "duration_hours": 4.5,
                "cost_per_person": 1400.0,
                "carrier_info": "Indian Railways (AC Chair Car / 3-Tier)",
                "schedule": f"Superfast Express departs on {start_date} at 06:45 AM"
            },
            "flight": {
                "is_available": True,
                "route_name": f"Commercial Air Shuttle to {dest_clean} Airport",
                "duration_hours": 1.3,
                "cost_per_person": 3600.0,
                "carrier_info": "IndiGo / Air India Domestic Network",
                "schedule": f"Flight departs on {start_date} at 09:30 AM"
            }
        }
    else:
        city_info = routes_database[matched_city]
        dist_km = city_info["distance_km"]
        mode_data = {
            "road": city_info["road"],
            "train": city_info["train"],
            "flight": city_info["flight"]
        }

    available_modes = {
        "road": mode_data["road"],
        "train": mode_data["train"],
        "flight": mode_data["flight"]
    }

    selected = mode_data.get(target_mode, mode_data["road"])
    per_person_fare = selected["cost_per_person"]
    total_transit = round(per_person_fare * max(1, members_count), 2)

    return {
        "mode": target_mode,
        "route_name": selected["route_name"],
        "distance_km": dist_km,
        "duration_hours": selected["duration_hours"],
        "estimated_duration_hours": selected["duration_hours"],
        "cost_per_person": per_person_fare,
        "total_transit_cost": total_transit,
        "carrier_info": selected["carrier_info"],
        "verified_schedule": selected["schedule"],
        "is_international": False,
        "is_railway_possible": True,
        "is_road_possible": True,
        "available_modes": available_modes
    }
