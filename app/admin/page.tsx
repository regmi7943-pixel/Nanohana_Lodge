'use client';

import React from 'react';
import Link from 'next/link';
import { Image as ImageIcon, CalendarDays, Type, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllContent } from '@/lib/content';
import { defaultRooms } from '@/lib/defaultRooms';

export default function AdminDashboard() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [avgOccupancy, setAvgOccupancy] = React.useState(0);
  const [arrivalsToday, setArrivalsToday] = React.useState(0);
  const [departuresToday, setDeparturesToday] = React.useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = React.useState(0);

  React.useEffect(() => {
    async function loadData() {
      const content = await getAllContent();
      const rawBookings = content.find((c: any) => c.key === 'bookings_data')?.value;
      let bookingsData: any = { inventory: {}, bookings: {} };
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
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
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
          if (req.status === 'Pending') {
            // Only count Pending requests — Confirmed ones are now auto-blocked in bookings_data
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

      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      let arrCount = 0;
      let depCount = 0;
      let pendCount = 0;

      requestsList.forEach(req => {
        if (req.status === 'Pending') pendCount++;
        if (req.status === 'Confirmed') {
          if (req.checkIn === todayStr) arrCount++;
          if (req.checkOut === todayStr) depCount++;
        }
      });
      setArrivalsToday(arrCount);
      setDeparturesToday(depCount);
      setPendingRequestsCount(pendCount);
    }
    loadData();
  }, []);

  const cards = [
    {
      title: 'Image Manager',
      desc: 'Upload and organize media directly to Cloudinary for fast CDN delivery.',
      icon: ImageIcon,
      href: '/admin/images',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      title: 'Booking Manager',
      desc: 'Manage reservations and room allocations for the 17 lodge rooms.',
      icon: CalendarDays,
      href: '/admin/bookings',
      color: 'text-nanohana',
      bg: 'bg-nanohana/10'
    },
    {
      title: 'Text Editor',
      desc: 'Quickly modify website copy, hero texts, and descriptions live.',
      icon: Type,
      href: '/admin/content',
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Welcome back, Kul Bahadur</h1>
        <p className="text-cream/60 mt-2">Manage your lodge website assets and operations from this dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
          <div className="text-cream/60 text-sm font-medium mb-2">Arrivals Today</div>
          <div className="text-3xl font-serif text-white">{arrivalsToday}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
          <div className="text-cream/60 text-sm font-medium mb-2">Departures Today</div>
          <div className="text-3xl font-serif text-white">{departuresToday}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
          <div className="text-cream/60 text-sm font-medium mb-2">Pending Requests</div>
          <div className="text-3xl font-serif text-nanohana">{pendingRequestsCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} href={card.href}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 bg-earth/50 border border-white/5 rounded-2xl h-full flex flex-col justify-between hover:border-white/20 transition-all cursor-pointer"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-cream/60 leading-relaxed mb-6">{card.desc}</p>
                </div>
                <div className="flex items-center text-sm font-bold text-cream hover:text-white transition-colors">
                  Open Manager <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Mock Chart Section */}
      <div className="mt-12 bg-earth/50 border border-white/5 rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Weekly Bookings Overview</h3>
            <p className="text-sm text-cream/60 mt-1">Occupancy rate over the last 7 days</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-cream/60 uppercase tracking-widest font-mono">Avg Occupancy</p>
            <p className="text-2xl font-bold text-nanohana">{avgOccupancy}%</p>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 md:gap-6 mt-4 border-b border-white/10 pb-2">
          {(chartData.length ? chartData : [{day:'',value:0}]).map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
              <div className="w-full relative flex justify-center h-full items-end">
                {/* Tooltip */}
                <div className="absolute -top-8 bg-white text-earth text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.value}%
                </div>
                {/* Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.value}%` }}
                  transition={{ duration: 1, delay: idx * 0.1, type: "spring" }}
                  className={`w-full max-w-[40px] rounded-t-lg ${bar.value > 80 ? 'bg-nanohana' : 'bg-nanohana/40'}`}
                />
              </div>
              <span className="text-xs text-cream/60 mt-3 font-mono">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
