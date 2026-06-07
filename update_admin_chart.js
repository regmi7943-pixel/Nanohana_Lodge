const fs = require('fs');
const path = require('path');
let content = fs.readFileSync('app/admin/page.tsx', 'utf8');

// Replace imports to include React hooks and getAllContent
content = content.replace(
  "import { motion } from 'framer-motion';",
  "import { motion } from 'framer-motion';\nimport { getAllContent } from '@/lib/content';\nimport { defaultRooms } from '@/lib/defaultRooms';"
);

// Inject state and useEffect
const hookInjection = `
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [avgOccupancy, setAvgOccupancy] = React.useState(0);

  React.useEffect(() => {
    async function loadData() {
      const content = await getAllContent();
      const rawBookings = content.find((c: any) => c.key === 'bookings_data')?.value;
      let bookingsData = { inventory: {}, bookings: {} };
      try { if (rawBookings) bookingsData = JSON.parse(rawBookings); } catch (e) {}

      const rawRequests = content.find((c: any) => c.key === 'booking_requests')?.value;
      let requestsList: any[] = [];
      try { if (rawRequests) requestsList = JSON.parse(rawRequests); } catch (e) {}

      const today = new Date();
      const last7Days = [];
      let totalOccupancySum = 0;
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
        
        let totalRooms = 0;
        let occupiedRooms = 0;

        defaultRooms.forEach(room => {
          const inv = bookingsData.inventory[room.id] || 1; // fallback or real
          totalRooms += inv;
          
          const roomBookings = bookingsData.bookings[room.id] || {};
          for (let j = 0; j < inv; j++) {
            if (roomBookings[j] && roomBookings[j].includes(dateStr)) {
              occupiedRooms++;
            }
          }
        });

        // Add requested rooms
        const dTime = d.getTime();
        requestsList.forEach((req) => {
          if (req.status !== 'Rejected') {
            const start = new Date(req.checkIn + 'T00:00:00').getTime();
            const end = new Date(req.checkOut + 'T00:00:00').getTime();
            if (dTime >= start && dTime < end) {
              occupiedRooms += (req.roomsCount || 1);
            }
          }
        });

        if (totalRooms === 0) totalRooms = 17; // fallback
        const occupancy = Math.min(100, Math.round((occupiedRooms / totalRooms) * 100));
        totalOccupancySum += occupancy;

        last7Days.push({
          day: dayNames[d.getDay()],
          value: occupancy
        });
      }

      setChartData(last7Days);
      setAvgOccupancy(Math.round(totalOccupancySum / 7));
    }
    loadData();
  }, []);
`;

content = content.replace(
  "export default function AdminDashboard() {",
  "export default function AdminDashboard() {" + hookInjection
);

// Replace hardcoded data
content = content.replace("76%", "{avgOccupancy}%");

content = content.replace(
  /\[\s*\{\s*day:\s*'Mon',\s*value:\s*60\s*\},\s*\{\s*day:\s*'Tue',\s*value:\s*45\s*\},\s*\{\s*day:\s*'Wed',\s*value:\s*80\s*\},\s*\{\s*day:\s*'Thu',\s*value:\s*90\s*\},\s*\{\s*day:\s*'Fri',\s*value:\s*100\s*\},\s*\{\s*day:\s*'Sat',\s*value:\s*100\s*\},\s*\{\s*day:\s*'Sun',\s*value:\s*75\s*\}\s*,?\s*\]/,
  "(chartData.length ? chartData : [{day:'',value:0}])"
);

fs.writeFileSync('app/admin/page.tsx', content);
console.log('Admin Dashboard chart is now dynamic!');
