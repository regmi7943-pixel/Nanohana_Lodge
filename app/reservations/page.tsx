'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  Building,
  CheckCircle2,
  Calendar,
  Lock,
  Percent,
  Smile,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function ReservationsPage() {
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [didCheck, setDidCheck] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('Standard Room');
  const [guestsCount, setGuestsCount] = useState(2);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  // S8 Comparison data table
  const comparisons = [
    { name: 'Standard Room', price: 12, beds: 'Double / Twin', view: 'Garden', breakfast: 'Available', ac: 'No (Fan)' },
    { name: 'Standard Garden View', price: 15, beds: 'Double Double', view: 'Florals', breakfast: 'Available', ac: 'No (Fan)' },
    { name: 'Deluxe Terrace Room', price: 20, beds: '1 King Bed', view: 'Mountains', breakfast: 'Available', ac: 'AC & Tub' },
    { name: 'Family / Triple Room', price: 22, beds: 'Double + Twin', view: 'Mountains', breakfast: 'Available', ac: 'AC (Select)' }
  ];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      alert('Please select both Check-In and Check-Out dates.');
      return;
    }
    setCheckingAvailability(true);

    setTimeout(() => {
      setCheckingAvailability(false);
      setDidCheck(true);
    }, 1200);
  };

  const getCalculatedPrice = () => {
    const selected = comparisons.find((c) => c.name === selectedRoom);
    if (!selected) return 12;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    return selected.price * diffDays;
  };

  const getCalculatedNights = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  return (
    <div id="reservations-page" className="w-full">
      {/* SUB-HERO SECTION (Partial height, Forest Canopy bg) */}
      <section id="reservations-hero" className="bg-forest text-cream py-24 text-center border-b border-white/5">
        <div className="max-w-[800px] mx-auto px-5 space-y-4 pt-12">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-nanohana font-bold block">
            Official Booking Portal
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
            Book direct. Best rate guaranteed.
          </h1>
          <p className="text-cream/80 text-sm sm:text-base max-w-[500px] mx-auto leading-relaxed">
            No undisclosed platform surcharges. No hidden commission markups. Pay securely on arrival at our Lakeside counter.
          </p>
        </div>
      </section>

      {/* AVAILABILITY CHECK WIDGET (Warm Cream bg) */}
      <section id="booking-widget-section" className="bg-cream py-16 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="bg-cream border border-earth/10 p-6 sm:p-10 rounded-2xl shadow-sm max-w-[850px] mx-auto space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-center text-earth">Select your travel dates</h2>

            {didCheck ? (
              <div id="booking-simulation" className="p-6 rounded-xl bg-forest/10 border border-forest/30 space-y-6 animate-fade-in text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-earth/10 pb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-forest flex-shrink-0" />
                    <div>
                      <h3 className="font-serif text-lg font-bold">Room Available for Booking!</h3>
                      <p className="text-xs text-earth/75">Lakeside Street 4 rates are locked for checkout securement.</p>
                    </div>
                  </div>
                  <span className="px-4 py-1 rounded bg-forest text-cream text-[11px] font-mono uppercase font-bold tracking-wider">
                    Instant Approve
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-earth/95 font-sans">
                  <div className="bg-cream p-3 rounded border border-earth/5">
                    <span className="text-earth/60 font-mono block uppercase">Room Selection</span>
                    <span className="font-bold">{selectedRoom}</span>
                  </div>
                  <div className="bg-cream p-3 rounded border border-earth/5">
                    <span className="text-earth/60 font-mono block uppercase">Check In</span>
                    <span className="font-bold">{checkInDate}</span>
                  </div>
                  <div className="bg-cream p-3 rounded border border-earth/5">
                    <span className="text-earth/60 font-mono block uppercase">Check Out</span>
                    <span className="font-bold">{checkOutDate}</span>
                  </div>
                  <div className="bg-cream p-3 rounded border border-earth/5">
                    <span className="text-earth/60 font-mono block uppercase">Calculated Nights</span>
                    <span className="font-bold">{getCalculatedNights()} nights</span>
                  </div>
                </div>

                <div className="p-4 bg-cream/70 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-xs text-earth/60 font-mono">Direct Total Estimated Rate</span>
                    <div className="text-3xl font-serif text-nanohana font-bold">
                      ${getCalculatedPrice()}{' '}
                      <span className="text-xs text-earth/80 font-normal font-sans">USD Total</span>
                    </div>
                  </div>
                  <Link
                    id="simulate-confirm-btn"
                    href="/contact"
                    className="px-6 py-3 rounded-full bg-nanohana text-earth font-sans text-xs font-semibold hover:bg-nanohana/90 transition-colors w-full sm:w-auto text-center"
                  >
                    Lock in reservation & notify owner
                  </Link>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setDidCheck(false)}
                    className="text-xs text-earth/60 hover:text-earth underline font-mono cursor-pointer"
                  >
                    ← Check different dates
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheck} className="space-y-6 my-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Checkin date picker */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">
                      Check-In Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkInDate}
                        required
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa select-none text-earth"
                      />
                    </div>
                  </div>

                  {/* Checkout date picker */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">
                      Check-Out Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkOutDate}
                        required
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa select-none text-earth"
                      />
                    </div>
                  </div>

                  {/* Room Selection drop down */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">
                      Choose Your Room
                    </label>
                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa text-earth"
                    >
                      <option>Standard Room</option>
                      <option>Standard Garden View</option>
                      <option>Deluxe Terrace Room</option>
                      <option>Family / Triple Room</option>
                    </select>
                  </div>

                  {/* Guest selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">
                      Travelers Count
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                      className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa text-earth"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults / Family</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    id="submit-widget-btn"
                    disabled={checkingAvailability}
                    className="w-full sm:w-auto px-8 sm:px-12 py-3.5 bg-forest text-cream font-sans text-xs tracking-wider uppercase font-semibold rounded-full hover:bg-forest/90 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {checkingAvailability ? 'Checking Availability...' : 'Check Availability →'}
                  </button>
                </div>
              </form>
            )}

            <div className="text-center pt-2 border-t border-earth/10">
              <span className="text-xs text-earth/65">Or book directly via our trusted aggregators:</span>
              <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-mono text-earth/50 mt-3">
                <span className="hover:text-earth transition-colors">Booking.com</span>
                <span className="hover:text-earth transition-colors">Agoda</span>
                <span className="hover:text-earth transition-colors">Expedia</span>
                <span className="hover:text-earth transition-colors font-bold text-phewa">TripAdvisor (Rating 4.6)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S8 ROOM COMPARISON TABLE */}
      <section id="comparative-table-section" className="bg-cream py-16 text-earth border-t border-earth/5">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <h2 className="font-serif text-3xl font-medium">Lakeside Room Comparisons</h2>
            <p className="text-xs text-earth/70 mt-1 uppercase font-mono tracking-wider">A transparent room metrics summary</p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-earth/10">
            <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-forest text-cream font-serif text-sm">
                  <th className="p-4">Room Category</th>
                  <th className="p-4 text-nanohana font-sans font-semibold">From Rate (USD)</th>
                  <th className="p-4">Beds config</th>
                  <th className="p-4">Primary View</th>
                  <th className="p-4">Breakfast</th>
                  <th className="p-4">Air Cooling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth/10">
                {comparisons.map((c, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-earth/5' : 'bg-cream'}>
                    <td className="p-4 font-serif font-bold text-sm tracking-wide text-earth">{c.name}</td>
                    <td className="p-4 font-bold text-nanohana text-base font-mono">${c.price}/night</td>
                    <td className="p-4 font-medium text-earth/80">{c.beds}</td>
                    <td className="p-4 font-mono uppercase text-teal-800 font-bold">{c.view}</td>
                    <td className="p-4 text-earth/70">{c.breakfast}</td>
                    <td className="p-4 text-earth/70">{c.ac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {comparisons.map((c, i) => (
              <div key={i} className="bg-cream border border-earth/10 rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-earth/10 pb-3">
                  <h3 className="font-serif font-bold text-base text-earth">{c.name}</h3>
                  <span className="font-bold text-nanohana text-base font-mono">${c.price}/night</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-earth/60 font-mono block uppercase mb-1">Beds config</span>
                    <span className="font-medium text-earth/90">{c.beds}</span>
                  </div>
                  <div>
                    <span className="text-earth/60 font-mono block uppercase mb-1">Primary View</span>
                    <span className="font-mono uppercase text-teal-800 font-bold">{c.view}</span>
                  </div>
                  <div>
                    <span className="text-earth/60 font-mono block uppercase mb-1">Breakfast</span>
                    <span className="text-earth/90">{c.breakfast}</span>
                  </div>
                  <div>
                    <span className="text-earth/60 font-mono block uppercase mb-1">Air Cooling</span>
                    <span className="text-earth/90">{c.ac}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S8 POLICY MATRIX CARDS GRID */}
      <section id="policy-matrix-section" className="bg-cream py-16 border-t border-earth/15">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-earth/80">
            {/* Card 1 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <span className="font-bold underline block font-serif text-sm text-earth">01. Room Check-In</span>
              <p className="leading-relaxed text-earth/75">
                Covered from 6:00 AM onwards because of our structured morning desk hours. Please email your anticipated landing hour in advance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <span className="font-bold underline block font-serif text-sm text-earth">02. Check-Out hour</span>
              <p className="leading-relaxed text-earth/75">
                Secure your luggage and hand keys details before 12:00 noon. Late checking adjustments are subject strictly to room availabilities.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <span className="font-bold underline block font-serif text-sm text-earth">03. Children & Cot policies</span>
              <p className="leading-relaxed text-earth/75">
                Ages 0–8 stay free when utilizing identical beds. No baby cribs or rollaway layers are managed at the lodge premises.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <span className="font-bold underline block font-serif text-sm text-earth">04. Flexible cancellations</span>
              <p className="leading-relaxed text-earth/75">
                Cancellations policies depend heavily on booking avenues. Direct reserving secures the utmost flexibility and swift refunds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY BOOK DIRECT SECTION */}
      <section id="why-book-direct" className="bg-cream py-20 border-t border-earth/10 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 text-center space-y-12">
          <h2 className="font-serif text-3xl font-medium">Why book directly with our family?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-phewa/10 text-phewa rounded-full flex items-center justify-center mx-auto">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold">Cheapest Rate Guarantee</h3>
              <p className="text-xs sm:text-sm text-earth/75 leading-relaxed max-w-[300px] mx-auto">
                By bypassing major hotel commissions, we pass 10% direct savings back to travelers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-phewa/10 text-phewa rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold">Flexible Modifications</h3>
              <p className="text-xs sm:text-sm text-earth/75 leading-relaxed max-w-[300px] mx-auto">
                Modify dates, check-in schedules, or specific view selections without paying booking engine cancellation fees.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-phewa/10 text-phewa rounded-full flex items-center justify-center mx-auto">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold">Personal Preparation</h3>
              <p className="text-xs sm:text-sm text-earth/75 leading-relaxed max-w-[300px] mx-auto">
                Booking directly alerts Rabin and Kul Bahadur immediately. Your room is prepared according to your precise timeline.
              </p>
            </div>
          </div>

          {/* Removed redundant booking button */}
        </div>
      </section>
    </div>
  );
}
